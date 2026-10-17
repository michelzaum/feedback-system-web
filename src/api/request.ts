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

let refreshPromise: Promise<unknown> | null = null;

async function refreshTokens(): Promise<unknown> {
  if (!refreshPromise) {
    refreshPromise = refreshToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
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
      await refreshTokens();

      config._retried = true;

      return api.request(config);
    } catch {
      useAuthStore.getState().logout();
      toast.error(SESSION_EXPIRED_MESSAGE);

      return Promise.reject(error);
    }
  }
);
