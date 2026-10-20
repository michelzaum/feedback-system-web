import { useRef, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { createOrganization, getOrganizations } from "@/api/organizations";
import { getProjects } from "@/api/projects";
import { useAuthStore } from "@/store/auth";
import type { UseCreateOrganizationModalProps } from "./types";

export function useCreateOrganization({ onOpenModalChange }: UseCreateOrganizationModalProps) {
  const navigate = useNavigate();
  const organizationName = useRef<HTMLInputElement>({} as HTMLInputElement);
  const setOrganizations = useAuthStore((state) => state.setOrganizations);
  const setOrganizationsWithProjects = useAuthStore((state) => state.setOrganizationsWithProjects);
  const setSelectedOrganization = useAuthStore((state) => state.setSelectedOrganization);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const newOrganizationName = organizationName.current.value.trim();

    if (!newOrganizationName) return;

    setIsSubmitting(true);
    try {
      await createOrganization({ name: newOrganizationName });

      const organizations = await getOrganizations();
      const projects = await getProjects();

      const organizationsWithProjects = organizations.map((organization) => ({
        ...organization,
        projects: projects.filter((project) => project.organizationId === organization.id),
      }));

      const newOrganization = organizationsWithProjects.find(
        (organization) => organization.name.toLowerCase() === newOrganizationName.toLowerCase(),
      );

      setOrganizations(organizations);
      setOrganizationsWithProjects(organizationsWithProjects);

      if (newOrganization) {
        setSelectedOrganization(newOrganization);
      }

      toast.success("Organização criada com sucesso!");

      onOpenModalChange(false);

      navigate("/overview", { replace: true });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error("Já existe uma organização com esse nome. Tente outro nome.");
      } else {
        toast.error("Falha ao criar a organização. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    organizationName,
    isSubmitting,
    onSubmit,
  };
}
