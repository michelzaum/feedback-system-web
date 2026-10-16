import { api } from "../request";
import type { SignUpPayload, UserResponse } from "./types";

export async function signUp({ name, email, password }: SignUpPayload): Promise<UserResponse> {
  const { data } = await api.post<UserResponse>("/users", { name, email, password });
  return data;
}
