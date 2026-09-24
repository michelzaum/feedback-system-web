import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useParams } from "react-router";
import { useAuthStore } from "@/store/auth";
import { updateProject } from "@/api/auth";

export function useProject() {
  const { slug } = useParams<{ slug: string }>();
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const organizationsWithProjects = useAuthStore((state) => state.organizationsWithProjects);
  const setOrganizationsWithProjects = useAuthStore((state) => state.setOrganizationsWithProjects);
  const [isSaving, setIsSaving] = useState(false);

  const project = useMemo(() => {
    const organization = organizationsWithProjects.find((org) => org.id === selectedOrganization?.id);
    return organization?.projects.find((p) => p.slug === slug) ?? null;
  }, [organizationsWithProjects, selectedOrganization, slug]);

  const onSaveName = async (newName: string) => {
    if (!project) return;
    if (!selectedOrganization) return;

    setIsSaving(true);
    try {
      const updated = await updateProject(selectedOrganization.id, project.id, { name: newName });
      setOrganizationsWithProjects(
        organizationsWithProjects.map((org) =>
          org.id === selectedOrganization.id
            ? { ...org, projects: org.projects.map((p) => (p.id === project.id ? updated : p)) }
            : org
        )
      );
      toast.success("Projeto atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar projeto");
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const publicUrl = `https://app.feedback.com/${project?.slug ?? ""}`;

  return { project, isLoading: false, isSaving, publicUrl, onSaveName };
}
