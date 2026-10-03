import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { getOrganizationFeedbacks } from "@/api/feedback";
import type { Feedback } from "@/api/feedback/types";

interface ProjectFeedbacks {
  projectId: string;
  projectName: string;
  feedbacks: Feedback[];
}

export function useFeedbacks() {
  const [projectFeedbacks, setProjectFeedbacks] = useState<ProjectFeedbacks[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const projectNameMap = new Map<string, string>();
        const org = organizationsWithProjects.find((organization) => organization.id === selectedOrganization.id);
        if (org) {
          for (const project of org.projects) {
            projectNameMap.set(project.id, project.name);
          }
        }

        const grouped = new Map<string, Feedback[]>();
        for (const feedback of sorted) {
          const list = grouped.get(feedback.projectId) ?? [];
          list.push(feedback);
          grouped.set(feedback.projectId, list);
        }

        const result: ProjectFeedbacks[] = [];
        for (const [projectId, feedbacks] of grouped) {
          result.push({
            projectId,
            projectName: projectNameMap.get(projectId) ?? "Projeto desconhecido",
            feedbacks,
          });
        }

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

  return {
    projectFeedbacks,
    isLoading,
    selectedOrganization,
  };
}
