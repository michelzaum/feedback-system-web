import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useParams } from "react-router";
import { useAuthStore } from "@/store/auth";
import { getProjectByOrganizationIdAndSlug, updateProject } from "@/api/auth";
import type { Project } from "@/api/auth";

export function useProject() {
  const { slug } = useParams<{ slug: string }>();
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!slug || !selectedOrganization) return;

      try {
        const data = await getProjectByOrganizationIdAndSlug(selectedOrganization.id, slug);
        setProject(data);
      } catch (error) {
        toast.error("Erro ao carregar projeto");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [slug, selectedOrganization]);

  const onSaveName = async (newName: string) => {
    if (!slug || !selectedOrganization) return;

    setIsSaving(true);
    try {
      const updated = await updateProject(selectedOrganization.id, slug, { name: newName });
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
