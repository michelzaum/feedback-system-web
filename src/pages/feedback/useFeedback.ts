import { useState, useEffect, type FormEvent } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

import { getProjectBySlugs, createFeedback } from "@/api/feedback";

export function useFeedback() {
  const { organizationSlug, projectSlug } = useParams<{ organizationSlug: string; projectSlug: string }>();

  const [project, setProject] = useState<Awaited<ReturnType<typeof getProjectBySlugs>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!organizationSlug || !projectSlug) return;

      setIsLoading(true);
      try {
        const data = await getProjectBySlugs(organizationSlug, projectSlug);
        setProject(data);
      } catch (error) {
        toast.error("Erro ao carregar projeto");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [organizationSlug, projectSlug]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project) return;

    setIsSubmitting(true);
    try {
      await createFeedback(project.id, { title, description });

      toast.success("Feedback enviado com sucesso!");
      setIsSubmitted(true);
    } catch (error) {
      toast.error("Erro ao enviar feedback");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    project,
    isLoading,
    isSubmitting,
    title,
    setTitle,
    description,
    setDescription,
    isSubmitted,
    onSubmit,
  };
}
