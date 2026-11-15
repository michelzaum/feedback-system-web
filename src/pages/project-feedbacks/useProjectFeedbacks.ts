import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { move } from "@dnd-kit/helpers";
import type { DragEndEvent, DragOverEvent } from "@dnd-kit/react";

import { useAuthStore } from "@/store/auth";
import { createFeedbackNote, deleteFeedbackNote, getFeedbackNotes, getFeedbacks, updateFeedback } from "@/api/feedback";
import { getOrganizationMembers } from "@/api/members";
import type { OrganizationMember } from "@/api/members/types";
import type { Feedback, FeedbackNote, FeedbackStatus } from "@/api/feedback/types";

export type FeedbackColumns = Record<FeedbackStatus, Feedback[]>;

const EMPTY_COLUMNS: FeedbackColumns = {
  NEW: [],
  IN_PROGRESS: [],
  COMPLETED: [],
};

function findFeedbackStatus(
  columns: FeedbackColumns,
  feedbackId: string,
): FeedbackStatus | undefined {
  return (Object.keys(columns) as FeedbackStatus[]).find((status) =>
    columns[status].some((feedback) => feedback.id === feedbackId),
  );
}

export function useProjectFeedbacks() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const selectedOrganization = useAuthStore(
    (state) => state.selectedOrganization,
  );
  const currentUserId = useAuthStore((state) => state.user?.id);
  const organizationsWithProjects = useAuthStore(
    (state) => state.organizationsWithProjects,
  );

  const project = useMemo(() => {
    const organization = organizationsWithProjects.find(
      (org) => org.id === selectedOrganization?.id,
    );

    return organization?.projects.find((p) => p.slug === slug) ?? null;
  }, [organizationsWithProjects, selectedOrganization, slug]);

  const [columns, setColumns] = useState<FeedbackColumns>(EMPTY_COLUMNS);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState<FeedbackNote[]>([]);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isUpdatingAssignee, setIsUpdatingAssignee] = useState(false);

  const columnsRef = useRef<FeedbackColumns>(EMPTY_COLUMNS);
  const snapshotRef = useRef<FeedbackColumns>(EMPTY_COLUMNS);

  const applyColumns = useCallback((nextColumns: FeedbackColumns) => {
    columnsRef.current = nextColumns;
    setColumns(nextColumns);
  }, []);

  const isLoading =
    isFetching && Boolean(selectedOrganization) && Boolean(project);

  useEffect(() => {
    if (!selectedOrganization) {
      setMembers([]);
      return;
    }

    let isCancelled = false;

    getOrganizationMembers(selectedOrganization.id)
      .then((organizationMembers) => {
        if (!isCancelled) setMembers(organizationMembers);
      })
      .catch((error) => {
        if (!isCancelled) {
          toast.error("Erro ao carregar membros da organização");
          console.log(error);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedOrganization]);

  useEffect(() => {
    if (!selectedOrganization || !project) {
      return;
    }

    const organizationId = selectedOrganization.id;
    const projectId = project.id;

    let isCancelled = false;

    async function fetchProjectFeedbacks() {
      setIsFetching(true);
      applyColumns(EMPTY_COLUMNS);

      try {
        const data = await getFeedbacks(organizationId, projectId);

        if (isCancelled) return;

        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        const grouped: FeedbackColumns = {
          NEW: sorted.filter((feedback) => feedback.status === "NEW"),
          IN_PROGRESS: sorted.filter(
            (feedback) => feedback.status === "IN_PROGRESS",
          ),
          COMPLETED: sorted.filter(
            (feedback) => feedback.status === "COMPLETED",
          ),
        };

        applyColumns(grouped);
      } catch (error) {
        toast.error("Erro ao carregar feedbacks");
        console.log(error);
      } finally {
        if (!isCancelled) {
          setIsFetching(false);
        }
      }
    }

    fetchProjectFeedbacks();

    return () => {
      isCancelled = true;
    };
  }, [selectedOrganization, project, applyColumns]);

  useEffect(() => {
    if (!isDetailsOpen || !selectedFeedback || !selectedOrganization || !project) {
      return;
    }

    const organizationId = selectedOrganization.id;
    const projectId = project.id;
    const feedbackId = selectedFeedback.id;
    let isCancelled = false;

    async function fetchNotes() {
      setIsNotesLoading(true);

      try {
        const notes = await getFeedbackNotes(
          organizationId,
          projectId,
          feedbackId,
        );

        if (!isCancelled) {
          setFeedbackNotes(notes);
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error("Erro ao carregar comentários internos");
          console.log(error);
        }
      } finally {
        if (!isCancelled) {
          setIsNotesLoading(false);
        }
      }
    }

    fetchNotes();

    return () => {
      isCancelled = true;
    };
  }, [isDetailsOpen, selectedFeedback, selectedOrganization, project]);

  const handleDragStart = () => {
    snapshotRef.current = columnsRef.current;
  };

  const handleDragOver = (event: DragOverEvent) => {
    applyColumns(move(columnsRef.current, event));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (event.canceled) {
      applyColumns(snapshotRef.current);

      return;
    }

    const feedbackId = String(event.operation.source?.id ?? "");

    if (!feedbackId) return;

    const initialStatus = findFeedbackStatus(snapshotRef.current, feedbackId);
    const newStatus = findFeedbackStatus(columnsRef.current, feedbackId);

    if (!initialStatus || !newStatus || initialStatus === newStatus) return;
    if (!selectedOrganization || !project) return;

    try {
      await updateFeedback(selectedOrganization.id, project.id, feedbackId, {
        status: newStatus,
      });
    } catch (error) {
      toast.error("Erro ao atualizar status");
      console.log(error);

      applyColumns(snapshotRef.current);
    }
  };

  const handleBack = () => {
    navigate("/feedbacks");
  };

  const handleOpenDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setFeedbackNotes([]);
    setNoteContent("");
    setIsDetailsOpen(true);
  };

  const handleDetailsOpenChange = (open: boolean) => {
    setIsDetailsOpen(open);

    if (!open) {
      setSelectedFeedback(null);
      setFeedbackNotes([]);
      setNoteContent("");
    }
  };

  const handleStatusChange = async (status: FeedbackStatus): Promise<boolean> => {
    if (!selectedFeedback || !selectedOrganization || !project || status === selectedFeedback.status) {
      return status === selectedFeedback?.status;
    }

    const previousFeedback = selectedFeedback;
    const previousColumns = columnsRef.current;
    const optimisticFeedback = { ...selectedFeedback, status };
    const optimisticColumns = { ...previousColumns };

    for (const columnStatus of Object.keys(optimisticColumns) as FeedbackStatus[]) {
      optimisticColumns[columnStatus] = optimisticColumns[columnStatus].filter(
        (feedback) => feedback.id !== selectedFeedback.id,
      );
    }

    optimisticColumns[status] = [optimisticFeedback, ...optimisticColumns[status]];
    applyColumns(optimisticColumns);
    setSelectedFeedback(optimisticFeedback);
    setIsUpdatingStatus(true);

    try {
      const savedFeedback = await updateFeedback(
        selectedOrganization.id,
        project.id,
        selectedFeedback.id,
        { status },
      );
      const confirmedFeedback = { ...optimisticFeedback, ...savedFeedback };
      const confirmedColumns = { ...columnsRef.current };

      confirmedColumns[status] = confirmedColumns[status].map((feedback) =>
        feedback.id === confirmedFeedback.id ? confirmedFeedback : feedback,
      );

      applyColumns(confirmedColumns);
      setSelectedFeedback(confirmedFeedback);
      return true;
    } catch (error) {
      toast.error("Erro ao atualizar status");
      console.log(error);

      applyColumns(previousColumns);
      setSelectedFeedback(previousFeedback);
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssigneeChange = async (assigneeId: string | null): Promise<boolean> => {
    if (!selectedFeedback || !selectedOrganization || !project || assigneeId === selectedFeedback.assigneeId) {
      return assigneeId === selectedFeedback?.assigneeId;
    }

    const previousFeedback = selectedFeedback;
    const selectedMember = members.find((member) => member.id === assigneeId);
    const optimisticFeedback = {
      ...selectedFeedback,
      assigneeId,
      assignee: selectedMember ? { id: selectedMember.id, name: selectedMember.name } : null,
    };
    setSelectedFeedback(optimisticFeedback);
    setIsUpdatingAssignee(true);

    try {
      const savedFeedback = await updateFeedback(
        selectedOrganization.id,
        project.id,
        selectedFeedback.id,
        { status: selectedFeedback.status, assigneeId },
      );
      const confirmedFeedback = { ...optimisticFeedback, ...savedFeedback };
      const nextColumns = { ...columnsRef.current };

      for (const status of Object.keys(nextColumns) as FeedbackStatus[]) {
        nextColumns[status] = nextColumns[status].map((feedback) =>
          feedback.id === confirmedFeedback.id ? confirmedFeedback : feedback,
        );
      }

      applyColumns(nextColumns);
      setSelectedFeedback(confirmedFeedback);
      return true;
    } catch (error) {
      toast.error("Erro ao atualizar responsável");
      console.log(error);
      setSelectedFeedback(previousFeedback);
      return false;
    } finally {
      setIsUpdatingAssignee(false);
    }
  };

  const handleCreateNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = noteContent.trim();

    if (!content || !selectedFeedback || !selectedOrganization || !project) {
      return;
    }

    setIsSavingNote(true);

    try {
      const note = await createFeedbackNote(
        selectedOrganization.id,
        project.id,
        selectedFeedback.id,
        content,
      );

      setFeedbackNotes((currentNotes) => [...currentNotes, note]);
      setNoteContent("");
    } catch (error) {
      toast.error("Erro ao salvar comentário interno");
      console.log(error);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string): Promise<boolean> => {
    if (!selectedFeedback || !selectedOrganization || !project || !currentUserId) {
      return false;
    }

    setDeletingNoteId(noteId);

    try {
      await deleteFeedbackNote(
        selectedOrganization.id,
        project.id,
        selectedFeedback.id,
        noteId,
      );

      setFeedbackNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
      return true;
    } catch (error) {
      toast.error("Erro ao excluir comentário");
      console.log(error);
      return false;
    } finally {
      setDeletingNoteId(null);
    }
  };

  const feedbackCount =
    columns.NEW.length + columns.IN_PROGRESS.length + columns.COMPLETED.length;

  return {
    project,
    columns,
    isLoading,
    feedbackCount,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleBack,
    selectedFeedback,
    isDetailsOpen,
    feedbackNotes,
    currentUserId,
    isNotesLoading,
    noteContent,
    isSavingNote,
    deletingNoteId,
    isUpdatingStatus,
    members,
    isUpdatingAssignee,
    handleOpenDetails,
    handleDetailsOpenChange,
    handleStatusChange,
    handleAssigneeChange,
    handleCreateNote,
    handleDeleteNote,
    setNoteContent,
  };
}
