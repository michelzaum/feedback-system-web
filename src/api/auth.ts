import { api } from "./request";

interface UserResponse {
  message: string;
  name: string;
  email: string;
  avatar?: string;
}

export async function signUp({ name, email, password }: SignUpPayload): Promise<UserResponse> {
  const { data } = await api.post<UserResponse>("/users", { name, email, password });
  return data;
}
