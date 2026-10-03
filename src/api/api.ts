import axios from "axios";
import useAuthStore from "../store/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://deliver-backend-6ec9.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authApi = axios.create({
  baseURL: API_BASE_URL,
});

// --- Interceptor: anexa token de acesso ---
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// --- Interceptor: refresh automático ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, logout, setTokens } = useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        const { access_token, refresh_token } = res.data;
        setTokens(access_token, refresh_token);
        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;

// --- Tipos de Pedido ---
export type FormaPagamento =
  | "DINHEIRO"
  | "CARTAO_CREDITO"
  | "CARTAO_DEBITO"
  | "PIX"
  | "VALE_ALIMENTACAO";

export interface FinalizarPedidoData {
  endereco_entrega: string;
  forma_pagamento: FormaPagamento;
  troco_para?: number;
  observacao?: string;
  telefone_contato?: string;
}

export interface ItemPedidoResponse {
  id: number;
  item_id: number;
  quantidade: number;
  sabor: string;
  tamanho: string;
  preco_unitario: number;
}

export interface PedidoResponse {
  id: number;
  usuario_id: number;
  status: "PENDENTE" | "FINALIZADO" | "CANCELADO";
  preco: number;
  endereco_entrega: string | null;
  forma_pagamento: string | null;
  troco_para: number | null;
  observacao: string | null;
  telefone_contato: string | null;
  created_at: string | null;
  itens: ItemPedidoResponse[];
}
