import { useEffect } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { getOrganizationProjects } from "@/api/projects";
import type { Organization } from "@/api/organizations/types";
import type { Project } from "@/api/projects/types";

export function useProjects() {
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const organizationsWithProjects = useAuthStore((state) => state.organizationsWithProjects);
  const setOrganizationsWithProjects = useAuthStore((state) => state.setOrganizationsWithProjects);

  useEffect(() => {
    async function fetchProjects() {
      if (!selectedOrganization) {
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
  }, [selectedOrganization, setOrganizationsWithProjects]);

  const refetchProjects = async () => {
    if (!selectedOrganization) return;
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
