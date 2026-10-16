import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { getOrganizationFeedbacks } from "@/api/feedback";
import type { Feedback } from "@/api/feedback/types";

export function useOverview() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useLayoutEffect(() => {
    async function fetchFeedbacks() {
      if (!selectedOrganization || !isAuthenticated) return;

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
  }, [selectedOrganization, isAuthenticated]);

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter((f) => f.status === "PENDING").length,
    inProgress: feedbacks.filter((f) => f.status === "IN_REVIEW").length,
    done: feedbacks.filter((f) => f.status === "COMPLETED").length,
  };

  const recentFeedbacks = feedbacks.slice(0, 3);

  const handleViewAll = () => {
    navigate("/feedbacks");
  };

  return {
    feedbacks,
    isLoading,
    stats,
    recentFeedbacks,
    selectedOrganization,
    handleViewAll,
  };
}
