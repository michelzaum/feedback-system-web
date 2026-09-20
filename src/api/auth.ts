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

export async function getProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>("/me/projects");
  return data;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export async function getOrganizations(): Promise<Organization[]> {
  const { data } = await api.get("/me/organizations");
  return Array.isArray(data) ? data : data.organizations ?? [];
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
