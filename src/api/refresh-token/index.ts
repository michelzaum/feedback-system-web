import { api } from "../request";

export async function refreshToken(): Promise<void> {
  await api.post<void>("/refresh-token");
}
