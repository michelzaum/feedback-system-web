import { api } from "../request";
import type { Project } from "@/api/projects/types";
import type { CreateFeedbackPayload, Feedback, UpdateFeedbackPayload } from "./types";

export async function getProjectBySlugs(organizationSlug: string, projectSlug: string): Promise<Project> {
  const { data } = await api.get<Project>(`/organizations/${organizationSlug}/projects/${projectSlug}`);
  return data;
}

export async function createFeedback(projectId: string, payload: CreateFeedbackPayload): Promise<Feedback> {
  const { data } = await api.post<Feedback>(`/projects/${projectId}/feedbacks`, payload);
  return data;
}

export async function getFeedbacks(organizationId: string, projectId: string): Promise<Feedback[]> {
  const { data } = await api.get<Feedback[]>(`/organizations/${organizationId}/projects/${projectId}/feedbacks`);
  return data;
}

export async function getOrganizationFeedbacks(organizationId: string): Promise<Feedback[]> {
  const { data } = await api.get<Feedback[]>(`/organizations/${organizationId}/feedbacks`);
  return data;
}

export async function updateFeedback(
  organizationId: string,
  projectId: string,
  feedbackId: string,
  payload: UpdateFeedbackPayload
): Promise<Feedback> {
  const { data } = await api.patch<Feedback>(
    `/organizations/${organizationId}/projects/${projectId}/feedbacks/${feedbackId}`,
    payload
  );
  return data;
}
