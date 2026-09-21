import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { getOrganizationProjects } from "@/api/auth";
import type { Organization, Project } from "@/api/auth";

interface OrganizationWithProjects extends Organization {
  projects: Project[];
}

export function useProjects() {
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const [organizationsWithProjects, setOrganizationsWithProjects] = useState<OrganizationWithProjects[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (!selectedOrganization) {
        setIsLoading(false);
        return;
      }
      try {
        const projects = await getOrganizationProjects(selectedOrganization.id);
        setOrganizationsWithProjects([{ ...selectedOrganization, projects }]);
      } catch (error) {
        toast.error("Erro ao carregar projetos");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, [selectedOrganization]);

  const refetchProjects = async () => {
    if (!selectedOrganization) return;
    try {
      const projects = await getOrganizationProjects(selectedOrganization.id);
      setOrganizationsWithProjects([{ ...selectedOrganization, projects }]);
    } catch (error) {
      toast.error("Erro ao carregar projetos");
      console.log(error);
    }
  };

  return { organizationsWithProjects, isLoading, fetchProjects: refetchProjects };
}
