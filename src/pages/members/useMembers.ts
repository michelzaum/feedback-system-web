import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/toasts";

import { useAuthStore } from "@/store/auth";
import { getOrganizationMembers, updateOrganizationMember, deleteOrganizationMember } from "@/api/members";
import type { OrganizationMember } from "@/api/members/types";

export function useMembers() {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<{ id: string; role: string } | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);

  const handleEdit = (member: { id: string; role: string }) => {
    setEditingMember(member);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (memberId: string) => {
    setEditingMember({ id: memberId, role: "" });
    setIsDeleteDialogOpen(true);
  };

  const onUpdateRole = async () => {
    if (!editingMember) return;
    await updateMember(editingMember.id, editingMember.role as "ADMIN" | "MEMBER");
    setIsEditDialogOpen(false);
    setEditingMember(null);
  };

  const onConfirmDelete = async () => {
    if (!editingMember) return;
    await deleteMember(editingMember.id);
    setIsDeleteDialogOpen(false);
    setEditingMember(null);
  };

  const toggleIsModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    async function fetchMembers() {
      if (!selectedOrganization) return;
      try {
        const data = await getOrganizationMembers(selectedOrganization.id);
        setMembers(data);
      } catch (error) {
        toast.error(TOAST_MESSAGES.MEMBERS_LOAD_ERROR);
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
        toast.error(TOAST_MESSAGES.MEMBERS_LOAD_ERROR);
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
      toast.error(TOAST_MESSAGES.MEMBER_UPDATE_ERROR);
      console.log(error);
    }
  };

  const deleteMember = async (userId: string) => {
    try {
      await deleteOrganizationMember(selectedOrganization!.id, userId);
      toast.success(TOAST_MESSAGES.MEMBER_DELETE_SUCCESS);
      refetch();
    } catch (error) {
      toast.error(TOAST_MESSAGES.MEMBER_DELETE_ERROR);
      console.log(error);
    }
  };

  return {
    members,
    isLoading,
    refetch,
    updateMember,
    deleteMember,
    isModalOpen,
    editingMember,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleEdit,
    handleDelete,
    onUpdateRole,
    onConfirmDelete,
    toggleIsModalOpen,
    selectedOrganization,
    setIsEditDialogOpen,
    setEditingMember,
    setIsDeleteDialogOpen,
  };
}
