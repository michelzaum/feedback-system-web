import { api } from "../request";
import type { CreateOrganizationPayload, Organization } from "./types";

export async function getOrganizations(): Promise<Organization[]> {
  const { data } = await api.get("/me/organizations");
  return Array.isArray(data) ? data : data.organizations ?? [];
}

export async function createOrganization(payload: CreateOrganizationPayload): Promise<void> {
  await api.post("/organizations", payload);
}
