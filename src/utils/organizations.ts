import type { Organization } from "@/api/organizations/types";
import type { Project } from "@/api/projects/types";

export interface OrganizationWithProjects extends Organization {
  projects: Project[];
}

export function mapOrganizationsWithProjects(
  orgs: Organization[],
  projects: Project[],
): OrganizationWithProjects[] {
  return orgs.map((org) => ({
    ...org,
    projects: projects.filter((p) => p.organizationId === org.id),
  }));
}