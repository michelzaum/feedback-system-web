import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { getOrganizations, getProjects } from "@/api/auth";
import type { Organization } from "@/components/create-project/types";

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

  const fetchProjects = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { organizationsWithProjects, isLoading, fetchProjects };
}
