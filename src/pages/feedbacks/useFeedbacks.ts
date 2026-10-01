import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { getFeedbacks } from "@/api/feedback";
import type { Feedback } from "@/api/feedback/types";

export function useFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const organizationsWithProjects = useAuthStore((state) => state.organizationsWithProjects);

  useEffect(() => {
    async function fetchFeedbacks() {
      if (!selectedOrganization) return;

      const org = organizationsWithProjects.find((organization) => organization.id === selectedOrganization.id);
      if (!org || org.projects.length === 0) {
        setFeedbacks([]);
        setIsLoading(false);
        return;
      }

      try {
        const allFeedbacks = await Promise.all(
          org.projects.map((project) =>
            getFeedbacks(selectedOrganization.id, project.id)
          )
        );
        const combined = allFeedbacks.flat().sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeedbacks(combined);
      } catch (error) {
        toast.error("Erro ao carregar feedbacks");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeedbacks();
  }, [selectedOrganization, organizationsWithProjects]);

  return {
    feedbacks,
    isLoading,
    selectedOrganization,
  };
}
