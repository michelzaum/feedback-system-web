import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useParams } from "react-router";
import { useAuthStore } from "@/store/auth";
import { getProjectByOrganizationId, updateProject } from "@/api/auth";
import type { Project } from "@/api/auth";

export function useProject() {
  const { id } = useParams<{ id: string }>();
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!id || !selectedOrganization) return;

      try {
        const data = await getProjectByOrganizationId(selectedOrganization.id, id);
        setProject(data);
      } catch (error) {
        toast.error("Erro ao carregar projeto");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [id, selectedOrganization]);

  const onSaveName = async (newName: string) => {
    if (!id || !selectedOrganization) return;

    setIsSaving(true);
    try {
      const updated = await updateProject(selectedOrganization.id, id, { name: newName });
      setProject(updated);
      toast.success("Projeto atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar projeto");
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const publicUrl = `https://app.feedback.com/${project?.slug ?? ""}`;

  return { project, isLoading, isSaving, publicUrl, onSaveName };
}
