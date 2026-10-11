import { useRef, type SubmitEvent, useState } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { api } from "@/api/request";
import type { UseCreateProjectModalProps } from "./types";

export function useCreateProject({ onOpenModalChange, onProjectCreated }: UseCreateProjectModalProps) {
  const projectName = useRef<HTMLInputElement>({} as HTMLInputElement);
  const projectDescription = useRef<HTMLInputElement>({} as HTMLInputElement);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const organizations = useAuthStore((state) => state.organizations);

  const handleOrgChange = (value: unknown) => {
    setSelectedOrgId(value as string);
  };

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newProjectName = projectName.current.value;
    const newProjectDescription = projectDescription.current.value;

    if (!newProjectName) return;
    if (!selectedOrgId) return;

    try {
      await api.post(`/organizations/${selectedOrgId}/projects`, {
        name: newProjectName,
        description: newProjectDescription,
      });

      toast.success("Projeto criado com sucesso!");
      onProjectCreated?.(newProjectName);
    } catch (error) {
      toast.error("Erro ao criar projeto");
      console.log(error);
    }

    onOpenModalChange(false);
  };

  return {
    projectName,
    projectDescription,
    organizations,
    selectedOrgId,
    handleOrgChange,
    onSubmit,
  };
}
