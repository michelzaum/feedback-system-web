import { api } from "../request";
import type { CreateMemberPayload, Member, MemberInfo, OrganizationMember } from "./types";

export async function getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  const { data } = await api.get<OrganizationMember[]>(`/organizations/${organizationId}/members`);
  return data;
}

export async function getMembers(): Promise<Member[]> {
  const { data } = await api.get<Member[]>("/me/members");
  return data;
}

export async function findOrganizationMemberByEmail(organizationId: string, email: string): Promise<MemberInfo> {
  const { data } = await api.get<MemberInfo>(`/organizations/${organizationId}/members/find-by-email/${email}`);
  return data;
}

export async function createOrganizationMember(organizationId: string, payload: CreateMemberPayload): Promise<void> {
  await api.post(`/organizations/${organizationId}/members`, payload);
}

export async function updateOrganizationMember(organizationId: string, userId: string, role: "ADMIN" | "MEMBER"): Promise<void> {
  await api.patch(`/organizations/${organizationId}/members/${userId}`, { role });
}

export async function deleteOrganizationMember(organizationId: string, userId: string): Promise<void> {
  await api.delete(`/organizations/${organizationId}/members/${userId}`);
}
