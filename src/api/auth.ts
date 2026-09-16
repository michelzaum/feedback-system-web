import { api } from "./request";

interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponse {
  message: string;
}

export async function signIn({ email, password }: SignInPayload): Promise<SignInResponse> {
  const { data } = await api.post<SignInResponse>("/sign-in", { email, password });
  return data;
}
