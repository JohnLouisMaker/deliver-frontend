import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import useAuthStore from "../store/authStore";

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true, // CRÍTICO: Permite o envio de cookies de/para o Render
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

export const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Processa a fila de requisições pendentes após obter o novo token
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor de Requisição
api.interceptors.request.use(
  (config) => {
    const requestUrl = config.url || "";
    const isAuthRoute =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/signup") ||
      requestUrl.includes("/register");
    const token = localStorage.getItem("access_token");
    if (token && config.headers && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de Resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    // Lista completa de rotas que NÃO devem disparar o refresh em caso de 401
    const isAuthRoute =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/signup") ||
      requestUrl.includes("/register");

    // Se for 401 em uma rota normal (não-auth) e ainda não tentamos o retry
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      if (isRefreshing) {
        // Se já houver um refresh rodando, enfileira a requisição para quando ele terminar
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await useAuthStore.getState().refreshAccessToken();

        if (newToken) {
          localStorage.setItem("access_token", newToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

          processQueue(null, newToken);

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          processQueue(new Error("Falha ao renovar sessão"), null);
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
