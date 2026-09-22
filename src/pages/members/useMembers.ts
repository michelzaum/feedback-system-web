import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { getOrganizationMembers, updateOrganizationMember, deleteOrganizationMember } from "@/api/auth";
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

  const refetch = () => {
    setIsLoading(true);
    if (!selectedOrganization) return;
    getOrganizationMembers(selectedOrganization.id)
      .then((data) => setMembers(data))
      .catch((error) => {
        toast.error("Erro ao carregar membros");
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };

  const updateMember = async (userId: string, role: "ADMIN" | "MEMBER") => {
    try {
      await updateOrganizationMember(selectedOrganization!.id, userId, role);
      toast.success("Membro atualizado com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao atualizar membro");
      console.log(error);
    }
  };

  const deleteMember = async (userId: string) => {
    try {
      await deleteOrganizationMember(selectedOrganization!.id, userId);
      toast.success("Membro excluído com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao excluir membro");
      console.log(error);
    }
  };

  return { members, isLoading, refetch, updateMember, deleteMember };
}
