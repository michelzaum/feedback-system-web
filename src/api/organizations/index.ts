import { api } from "../request";
import type { Organization } from "./types";

export async function getOrganizations(): Promise<Organization[]> {
  const { data } = await api.get("/me/organizations");
  return Array.isArray(data) ? data : data.organizations ?? [];
}
