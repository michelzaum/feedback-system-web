import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { getOrganizationProjects } from "@/api/projects";

export function useProjects() {
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const organizationsWithProjects = useAuthStore((state) => state.organizationsWithProjects);
  const setOrganizationsWithProjects = useAuthStore((state) => state.setOrganizationsWithProjects);

  const projects =
    organizationsWithProjects.find((org) => org.id === selectedOrganization?.id)?.projects ?? [];

  const refetchProjects = async () => {
    if (!isAuthenticated || !selectedOrganization) return;

    try {
      const fetchedProjects = await getOrganizationProjects(selectedOrganization.id);
      const alreadyListed = organizationsWithProjects.some((org) => org.id === selectedOrganization.id);

      setOrganizationsWithProjects(
        alreadyListed
          ? organizationsWithProjects.map((org) =>
              org.id === selectedOrganization.id ? { ...org, projects: fetchedProjects } : org
            )
          : [...organizationsWithProjects, { ...selectedOrganization, projects: fetchedProjects }]
      );
    } catch (error) {
      toast.error("Erro ao carregar projetos");
      console.log(error);
    }
  };

  return { projects, isLoading: organizationsWithProjects.length === 0, fetchProjects: refetchProjects };
}
