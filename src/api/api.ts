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
        // Refresh via header (contrato): o refresh token NÃO vai no corpo.
        const res = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          undefined,
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          },
        );
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

// --- Tipos de Checkout (contrato: docs/checkout-api.md) ---

export type FormaPagamento =
  | "DINHEIRO"
  | "CARTAO_CREDITO"
  | "CARTAO_DEBITO"
  | "PIX"
  | "VALE_ALIMENTACAO";

export type TamanhoPedido = "pequena" | "media" | "grande";

export type StatusPedido = "PENDENTE" | "FINALIZADO" | "CANCELADO";

/** Item do corpo do checkout. `tamanho` obrigatório só para pizzas. */
export interface ItemCheckoutRequest {
  item_cardapio_id: number;
  quantidade: number;
  tamanho?: TamanhoPedido;
}

export interface CriarPedidoRequest {
  itens: ItemCheckoutRequest[];
  endereco_entrega: string;
  forma_pagamento: FormaPagamento;
  telefone_contato: string;
  /** Obrigatório apenas para DINHEIRO; ignorado nas demais formas. */
  troco_para?: number;
  observacao?: string;
}

export interface ItemPedidoResponse {
  item_cardapio_id: number;
  nome_snapshot: string;
  tamanho: TamanhoPedido | null;
  quantidade: number;
  preco_unitario: number;
}

export interface PedidoResponse {
  id: number;
  status: StatusPedido;
  itens: ItemPedidoResponse[];
  total: number;
}

export interface CheckoutResponse {
  pedido: PedidoResponse;
}
