import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/toasts";

import { useAuthStore } from "@/store/auth";
import { getOrganizationFeedbacks } from "@/api/feedback";
import type { Feedback } from "@/api/feedback/types";

export function useOverview() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    let isMounted = true;

    async function fetchFeedbacks() {
      if (!isMounted || !selectedOrganization || !isAuthenticated) return;

      try {
        const data = await getOrganizationFeedbacks(selectedOrganization.id);
        if (!isMounted) return;
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeedbacks(sorted);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error(TOAST_MESSAGES.FEEDBACKS_LOAD_ERROR);
          console.log(error);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchFeedbacks();

    return () => {
      isMounted = false;
    };
  }, [selectedOrganization, isAuthenticated]);

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter((f) => f.status === "NEW").length,
    inProgress: feedbacks.filter((f) => f.status === "IN_PROGRESS").length,
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
