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
  const { data } = await api.post<UserResponse>("/sign-up", { name, email, password });
  return data;
}

export async function me(): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>("/me");
  return data;
}
