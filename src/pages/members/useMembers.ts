import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { getOrganizationMembers } from "@/api/auth";
import type { OrganizationMember } from "@/api/auth";

export function useMembers() {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);

  useEffect(() => {
    async function fetchMembers() {
      if (!selectedOrganization) return;
      try {
        const data = await getOrganizationMembers(selectedOrganization.id);
        setMembers(data);
      } catch (error) {
        toast.error("Erro ao carregar membros");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMembers();
  }, [selectedOrganization]);

  return { members, isLoading };
}
