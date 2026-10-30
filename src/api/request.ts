import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { refreshToken } from "@/api/refresh-token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retried?: boolean;
  }
}

const AUTH_ENDPOINTS = ["/sign-in", "/sign-up", "/refresh-token"];
const SESSION_EXPIRED_MESSAGE = "Sua sessão expirou. Faça login novamente.";

// Track in-flight refresh requests to prevent multiple concurrent refreshes
const refreshRequests = new Map<string, Promise<unknown>>();

async function refreshTokens(requestId: string): Promise<unknown> {
  if (refreshRequests.has(requestId)) {
    return refreshRequests.get(requestId)!;
  }

  const promise = refreshToken().finally(() => {
    refreshRequests.delete(requestId);
  });

  refreshRequests.set(requestId, promise);
  return promise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const config = error.config;

    if (status !== 401 || !config) {
      return Promise.reject(error);
    }

    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => config.url?.includes(endpoint));

    if (isAuthEndpoint || config._retried) {
      if (!isAuthEndpoint) {
        useAuthStore.getState().logout();
        toast.error(SESSION_EXPIRED_MESSAGE);
      }

      return Promise.reject(error);
    }

    try {
      const requestId = crypto.randomUUID();
      await refreshTokens(requestId);

      config._retried = true;

      return api.request(config);
    } catch {
      useAuthStore.getState().logout();
      toast.error(SESSION_EXPIRED_MESSAGE);

      return Promise.reject(error);
    }
  }
);
