import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { getOrganizationFeedbacks } from "@/api/feedback";
import type { Feedback } from "@/api/feedback/types";

export function useFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const organizationsWithProjects = useAuthStore((state) => state.organizationsWithProjects);

  useEffect(() => {
    async function fetchFeedbacks() {
      if (!selectedOrganization) return;

      try {
        const data = await getOrganizationFeedbacks(selectedOrganization.id);
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeedbacks(sorted);
      } catch (error) {
        toast.error("Erro ao carregar feedbacks");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeedbacks();
  }, [selectedOrganization]);

  const projectNameMap = new Map<string, string>();
  const org = organizationsWithProjects.find((organization) => organization.id === selectedOrganization?.id);
  if (org) {
    for (const project of org.projects) {
      projectNameMap.set(project.id, project.name);
    }
  }

  return {
    feedbacks,
    isLoading,
    selectedOrganization,
    projectNameMap,
  };
}
