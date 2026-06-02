import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import useAuthStore from "../store/authStore";

const BASE_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Evita tentar fazer refresh múltiplas vezes
let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Não tenta refresh em rotas de autenticação (login, refresh, etc)
    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = useAuthStore.getState().refreshAccessToken();
      }

      // Espera o refresh ser concluído
      if (refreshPromise) {
        try {
          const newToken = await refreshPromise;
          isRefreshing = false;
          refreshPromise = null;

          if (newToken) {
            onRefreshed(newToken);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } else {
            useAuthStore.getState().logout();
          }
        } catch {
          isRefreshing = false;
          refreshPromise = null;
          useAuthStore.getState().logout();
        }
      }
    } else if (error.response?.status === 401 && isAuthRoute) {
      // Se for erro 401 em rota de auth (login, etc), só retorna o erro sem fazer logout
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
