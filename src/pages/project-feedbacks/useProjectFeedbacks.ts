import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { move } from "@dnd-kit/helpers";
import type { DragEndEvent, DragOverEvent } from "@dnd-kit/react";

import { useAuthStore } from "@/store/auth";
import { getFeedbacks, updateFeedback } from "@/api/feedback";
import type { Feedback, FeedbackStatus } from "@/api/feedback/types";

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

  const columnsRef = useRef<FeedbackColumns>(EMPTY_COLUMNS);
  const snapshotRef = useRef<FeedbackColumns>(EMPTY_COLUMNS);

  const applyColumns = useCallback((nextColumns: FeedbackColumns) => {
    columnsRef.current = nextColumns;
    setColumns(nextColumns);
  }, []);

  const isLoading =
    isFetching && Boolean(selectedOrganization) && Boolean(project);

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
  };
}
