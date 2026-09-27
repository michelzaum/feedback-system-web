import { useEffect } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { getOrganizationProjects } from "@/api/projects";
import type { Organization } from "@/api/organizations/types";
import type { Project } from "@/api/projects/types";

export function useProjects() {
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const organizationsWithProjects = useAuthStore((state) => state.organizationsWithProjects);
  const setOrganizationsWithProjects = useAuthStore((state) => state.setOrganizationsWithProjects);

  useEffect(() => {
    async function fetchProjects() {
      if (!isAuthenticated || !selectedOrganization) {
        setOrganizationsWithProjects([]);
        return;
      }
      try {
        const projects = await getOrganizationProjects(selectedOrganization.id);
        setOrganizationsWithProjects([{ ...selectedOrganization, projects } as Organization & { projects: Project[] }]);
      } catch (error) {
        toast.error("Erro ao carregar projetos");
        console.log(error);
      }
    }
    fetchProjects();
  }, [isAuthenticated, selectedOrganization, setOrganizationsWithProjects]);

  const refetchProjects = async () => {
    if (!isAuthenticated || !selectedOrganization) return;
    try {
      const projects = await getOrganizationProjects(selectedOrganization.id);
      setOrganizationsWithProjects([{ ...selectedOrganization, projects } as Organization & { projects: Project[] }]);
    } catch (error) {
      toast.error("Erro ao carregar projetos");
      console.log(error);
    }
  };

  return { organizationsWithProjects, isLoading: organizationsWithProjects.length === 0, fetchProjects: refetchProjects };
}
