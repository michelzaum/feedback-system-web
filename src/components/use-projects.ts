import { useState, useEffect } from "react";
import { toast } from "sonner";

import { getOrganizations, getProjects } from "@/api/auth";
import type { Organization } from "@/api/auth";

interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  organizationId: string;
}

interface OrganizationWithProjects extends Organization {
  projects: Project[];
}

export function useProjects() {
  const [organizationsWithProjects, setOrganizationsWithProjects] = useState<OrganizationWithProjects[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const [orgs, projects] = await Promise.all([
          getOrganizations(),
          getProjects(),
        ]);
        const grouped = orgs.map((org) => ({
          ...org,
          projects: projects.filter((p) => p.organizationId === org.id),
        }));
        setOrganizationsWithProjects(grouped);
      } catch (error) {
        toast.error("Erro ao carregar projetos");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const fetchProjectsCallback = async () => {
    try {
      const [orgs, projects] = await Promise.all([
        getOrganizations(),
        getProjects(),
      ]);
      const grouped = orgs.map((org) => ({
        ...org,
        projects: projects.filter((p) => p.organizationId === org.id),
      }));
      setOrganizationsWithProjects(grouped);
    } catch (error) {
      toast.error("Erro ao carregar projetos");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { organizationsWithProjects, isLoading, fetchProjects: fetchProjectsCallback };
}
