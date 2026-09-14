import { useRef, type SubmitEvent } from "react";
import { toast } from "sonner";

import { api } from "@/api/request";
import type { UseCreateProjectModalProps } from "./types";

export function useCreateProject({ onOpenModalChange, onProjectCreated }: UseCreateProjectModalProps) {
  const projectName = useRef<HTMLInputElement>({} as HTMLInputElement);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newProjectName = projectName.current.value;

    if (!newProjectName) return;

    try {
      await api.post("/projects", { name: newProjectName });
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
    onSubmit,
  };
}
