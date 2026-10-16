import { api } from "../request";
import type { SignOutResponse } from "./types";

export async function signOut(): Promise<SignOutResponse> {
  const { data } = await api.post<SignOutResponse>("/sign-out");
  return data;
}
