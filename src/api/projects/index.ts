import { api } from "../request";
import type { Project, UpdateProjectPayload } from "./types";

export async function getProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>("/me/projects");
  return data;
}

export async function updateProject(organizationId: string, projectId: string, payload: UpdateProjectPayload): Promise<Project> {
  const { data } = await api.patch<Project>(`/organizations/${organizationId}/projects/${projectId}`, payload);
  return data;
}

export async function getOrganizationProjects(organizationId: string): Promise<Project[]> {
  const { data } = await api.get<Project[]>(`/organizations/${organizationId}/projects`);
  return data;
}

export async function getProjectByOrganizationIdAndSlug(organizationId: string, projectId: string): Promise<Project> {
  const { data } = await api.get<Project>(`/organizations/${organizationId}/projects/by-slug/${projectId}`);
  return data;
}
