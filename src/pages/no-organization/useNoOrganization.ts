import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { useAuthStore } from "@/store/auth";
import { signOut } from "@/api/sign-out";
import { createOrganization, getOrganizations } from "@/api/organizations";
import { getProjects } from "@/api/projects";

export function useNoOrganization() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const setOrganizations = useAuthStore((state) => state.setOrganizations);
  const setOrganizationsWithProjects = useAuthStore((state) => state.setOrganizationsWithProjects);
  const setSelectedOrganization = useAuthStore((state) => state.setSelectedOrganization);
  const [isCheckingOrganizations, setIsCheckingOrganizations] = useState(true);
  const [checkRequestId, setCheckRequestId] = useState(0);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function checkOrganizations() {
      try {
        const organizations = await getOrganizations();
        const projects = await getProjects();

        const organizationsWithProjects = organizations.map((organization) => ({
          ...organization,
          projects: projects.filter((project) => project.organizationId === organization.id),
        }));

        if (organizationsWithProjects.length === 1) {
          setOrganizations(organizations);
          setOrganizationsWithProjects(organizationsWithProjects);
          setSelectedOrganization(organizationsWithProjects[0]);

          navigate("/overview", { replace: true });

          return;
        }

        if (organizationsWithProjects.length > 1) {
          setOrganizations(organizations);
          setOrganizationsWithProjects(organizationsWithProjects);

          navigate("/select-org", { replace: true });

          return;
        }

        setIsCheckingOrganizations(false);
      } catch {
        setIsCheckingOrganizations(false);

        toast.error("Falha ao verificar suas organizações. Tente novamente.");
      }
    }

    checkOrganizations();
  }, [checkRequestId, navigate, setOrganizations, setOrganizationsWithProjects, setSelectedOrganization]);

  const onCheckOrganizations = () => {
    setIsCheckingOrganizations(true);
    setIsCreateFormOpen(false);

    setCheckRequestId((id) => id + 1);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();

    if (!name) {
      toast.error("Informe o nome da organização.");

      return;
    }

    setIsSubmitting(true);
    try {
      await createOrganization({ name });

      const organizations = await getOrganizations();
      const projects = await getProjects();

      const organizationsWithProjects = organizations.map((organization) => ({
        ...organization,
        projects: projects.filter((project) => project.organizationId === organization.id),
      }));

      const newOrganization = organizationsWithProjects.find(
        (organization) => organization.name.toLowerCase() === name.toLowerCase(),
      );

      setOrganizations(organizations);
      setOrganizationsWithProjects(organizationsWithProjects);

      if (newOrganization) {
        setSelectedOrganization(newOrganization);
      }

      toast.success("Organização criada com sucesso!");

      navigate(newOrganization ? "/overview" : "/select-org", { replace: true });
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

  const onLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();

      toast.success("Logout realizado com sucesso.");
    } catch {
      toast.error("Falha ao fazer logout. Tente novamente.");
    } finally {
      logout();

      navigate("/sign-in", { replace: true });
      setIsLoggingOut(false);
    }
  };

  return { isCheckingOrganizations, isCreateFormOpen, setIsCreateFormOpen, isSubmitting, isLoggingOut, onCheckOrganizations, onSubmit, onLogout };
}
