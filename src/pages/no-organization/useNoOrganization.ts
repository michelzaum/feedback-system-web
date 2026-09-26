import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { signOut } from "@/api/sign-out";

export function useNoOrganization() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isLoading, setIsLoading] = useState(false);

  const onLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();

      toast.success("Logged out successfully.");
    } catch {
      toast.error("Failed to log out. Please try again.");
    } finally {
      logout();

      navigate("/sign-in", { replace: true });
      setIsLoading(false);
    }
  };

  return { isLoading, onLogout };
}
