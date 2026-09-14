import { useRef, type SubmitEvent } from "react";
import { toast } from "sonner";

import { api } from "@/api/request";
import type { UseCreateProjectModalProps } from "./types";

export function useCreateProject({ onOpenModalChange, onProjectCreated }: UseCreateProjectModalProps) {
  const projectName = useRef<HTMLInputElement>({} as HTMLInputElement);
  const projectDescription = useRef<HTMLInputElement>({} as HTMLInputElement);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newProjectName = projectName.current.value;
    const newProjectDescription = projectDescription.current.value;

    if (!newProjectName) return;

    try {
      // Mock organizationId until the auth flow is implemented
      await api.post("/organizations/9612393f-1510-47e4-9140-4e897f884305/projects", {
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
  }

  return {
    projectName,
    projectDescription,
    onSubmit,
  };
}
