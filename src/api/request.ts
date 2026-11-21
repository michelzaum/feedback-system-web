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

// Share one refresh request across all concurrent 401 responses.
let refreshRequest: Promise<void> | null = null;

function refreshTokens(): Promise<void> {
  if (!refreshRequest) {
    refreshRequest = refreshToken()
      .catch((error) => {
        const authStore = useAuthStore.getState();

        if (authStore.isAuthenticated) {
          authStore.logout();
          toast.error(SESSION_EXPIRED_MESSAGE);
        }

        throw error;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
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

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (config._retried) {
      const authStore = useAuthStore.getState();

      if (authStore.isAuthenticated) {
        authStore.logout();
        toast.error(SESSION_EXPIRED_MESSAGE);
      }

      return Promise.reject(error);
    }

    if (!useAuthStore.getState().isAuthenticated) {
      return Promise.reject(error);
    }

    try {
      await refreshTokens();

      config._retried = true;

      return api.request(config);
    } catch {
      return Promise.reject(error);
    }
  }
);
