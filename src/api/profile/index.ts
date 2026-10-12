import { api } from "../request";
import type { Profile, UpdateProfilePayload } from "./types";

export async function updateProfile(userId: string, payload: UpdateProfilePayload): Promise<Profile> {
  const { data } = await api.patch<Profile>(`/users/${userId}`, payload);
  return data;
}
