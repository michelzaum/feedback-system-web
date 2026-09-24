import { useRef, type SubmitEvent, useState, useEffect } from "react";
import { toast } from "sonner";

import { api } from "@/api/request";
import { getOrganizations } from "@/api/auth";
import type { Organization } from "@/api/auth";
import type { UseCreateProjectModalProps } from "./types";

export function useCreateProject({ onOpenModalChange, onProjectCreated }: UseCreateProjectModalProps) {
  const projectName = useRef<HTMLInputElement>({} as HTMLInputElement);
  const projectDescription = useRef<HTMLInputElement>({} as HTMLInputElement);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const orgs = await getOrganizations();
        setOrganizations(orgs);
        if (orgs.length > 0) {
          setSelectedOrgId(orgs[0].id);
        }
      } catch (error) {
        toast.error("Erro ao carregar organizações");
        console.log(error);
      }
    }
    fetchOrganizations();
  }, []);

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
