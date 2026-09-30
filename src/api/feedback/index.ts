import { api } from "../request";
import type { Project } from "@/api/projects/types";
import type { CreateFeedbackPayload, Feedback } from "./types";

export async function getProjectBySlugs(organizationSlug: string, projectSlug: string): Promise<Project> {
  const { data } = await api.get<Project>(`/organizations/${organizationSlug}/projects/${projectSlug}`);
  return data;
}

export async function createFeedback(projectId: string, payload: CreateFeedbackPayload): Promise<Feedback> {
  const { data } = await api.post<Feedback>(`/projects/${projectId}/feedbacks`, payload);
  return data;
}
