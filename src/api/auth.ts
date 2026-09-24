import { api } from "./request";

interface UserResponse {
  message: string;
  name: string;
  email: string;
  avatar?: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponse {
  message: string;
}

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export async function signIn({ email, password }: SignInPayload): Promise<SignInResponse> {
  const { data } = await api.post<UserResponse>("/sign-in", { email, password });
  return data;
}

export async function signUp({ name, email, password }: SignUpPayload): Promise<UserResponse> {
  const { data } = await api.post<UserResponse>("/users", { name, email, password });
  return data;
}

export async function me(): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>("/me");
  return data;
}

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  const { data } = await api.get<OrganizationMember[]>(`/organizations/${organizationId}/members`);
  return data;
}

export interface MemberOrganization {
  id: string;
  name: string;
  role: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  organizations: MemberOrganization[];
}

export async function getMembers(): Promise<Member[]> {
  const { data } = await api.get<Member[]>("/me/members");
  return data;
}

export interface MemberInfo {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function findOrganizationMemberByEmail(organizationId: string, email: string): Promise<MemberInfo> {
  const { data } = await api.get<MemberInfo>(`/organizations/${organizationId}/members/find-by-email/${email}`);
  return data;
}

export interface CreateMemberPayload {
  userId: string;
  role: "ADMIN" | "MEMBER";
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
