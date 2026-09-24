import { api } from "../request";
import type { SignInPayload, SignInResponse, SignOutResponse, UserResponse } from "./types";

export async function signIn({ email, password }: SignInPayload): Promise<SignInResponse> {
  const { data } = await api.post<UserResponse>("/sign-in", { email, password });
  return data;
}

export async function me(): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>("/me");
  return data;
}

export async function signOut(): Promise<SignOutResponse> {
  const { data } = await api.post<SignOutResponse>("/sign-out");
  return data;
}
