import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { getOrganizationFeedbacks, updateFeedback } from "@/api/feedback";
import type { Feedback, FeedbackStatus } from "@/api/feedback/types";

export interface ProjectFeedbacks {
  projectId: string;
  projectName: string;
  projectSlug: string;
  feedbacks: Feedback[];
}

export function useFeedbacks() {
  const [projectFeedbacks, setProjectFeedbacks] = useState<ProjectFeedbacks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);

  useEffect(() => {
    async function fetchFeedbacks() {
      if (!selectedOrganization) return;

      try {
        const data = await getOrganizationFeedbacks(selectedOrganization.id);
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const organizationsWithProjects = useAuthStore.getState().organizationsWithProjects;
        const org = organizationsWithProjects.find((organization) => organization.id === selectedOrganization.id);

        const grouped = new Map<string, Feedback[]>();
        for (const feedback of sorted) {
          const list = grouped.get(feedback.projectId) ?? [];
          list.push(feedback);
          grouped.set(feedback.projectId, list);
        }

        const result: ProjectFeedbacks[] = [];
        const knownProjectIds = new Set<string>();

        if (org) {
          for (const project of org.projects) {
            knownProjectIds.add(project.id);

            result.push({
              projectId: project.id,
              projectName: project.name,
              projectSlug: project.slug,
              feedbacks: grouped.get(project.id) ?? [],
            });
          }
        }

        for (const [projectId, feedbacks] of grouped) {
          if (knownProjectIds.has(projectId)) continue;

          result.push({
            projectId,
            projectName: "Projeto desconhecido",
            projectSlug: "",
            feedbacks,
          });
        }

        result.sort((a, b) => {
          const aTime = a.feedbacks[0]
            ? new Date(a.feedbacks[0].createdAt).getTime()
            : 0;
          const bTime = b.feedbacks[0]
            ? new Date(b.feedbacks[0].createdAt).getTime()
            : 0;

          return bTime - aTime;
        });

        setProjectFeedbacks(result);
      } catch (error) {
        toast.error("Erro ao carregar feedbacks");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeedbacks();
  }, [selectedOrganization]);

  const handleUpdateStatus = async (projectId: string, feedbackId: string, status: FeedbackStatus) => {
    if (!selectedOrganization) return;

    const feedback = projectFeedbacks
      .find((group) => group.projectId === projectId)
      ?.feedbacks.find((f) => f.id === feedbackId);

    if (!feedback || feedback.status === status) return;

    try {
      await updateFeedback(selectedOrganization.id, projectId, feedbackId, { status });

      setProjectFeedbacks((prev) =>
        prev.map((group) =>
          group.projectId === projectId
            ? {
                ...group,
                feedbacks: group.feedbacks.map((f) =>
                  f.id === feedbackId ? { ...f, status } : f
                ),
              }
            : group
        )
      );

      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar status");
      console.log(error);
    }
  };

  const handleViewAll = (projectSlug: string) => {
    navigate(`/projects/${projectSlug}/feedbacks`);
  };

  return {
    projectFeedbacks,
    isLoading,
    selectedOrganization,
    handleUpdateStatus,
    handleViewAll,
  };
}
