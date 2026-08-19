import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import api, { authApi } from "../api/api";

interface User {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
  ativo: boolean;
}

interface JwtPayload {
  exp: number;
  sub: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Ações
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  setError: (error: string | null) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setError: (error) => set({ error }),

  login: async (accessToken, refreshToken) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Persiste no localStorage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // 2. Atualiza os estados locais
      set({
        accessToken,
        refreshToken,
      });

      // 3. Busca o usuário forçando o novo token explicitamente no cabeçalho
      const res = await authApi.get<User>("/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      set({
        user: res.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Erro ao buscar usuário no login:", err);
      get().logout();
      set({
        error:
          err.response?.data?.message || "Falha ao carregar perfil do usuário",
        isLoading: false,
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  refreshAccessToken: async () => {
    const storedRefresh =
      localStorage.getItem("refresh_token") || get().refreshToken;

    if (!storedRefresh) {
      get().logout();
      return null;
    }

    try {
      const res = await authApi.post("/auth/refresh", null, {
        headers: { Authorization: `Bearer ${storedRefresh}` },
      });

      const { access_token, refresh_token: newRefreshToken } = res.data;

      const finalRefreshToken = newRefreshToken || storedRefresh;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", finalRefreshToken);

      set({
        accessToken: access_token,
        refreshToken: finalRefreshToken,
        isAuthenticated: true,
      });

      return access_token;
    } catch (err) {
      console.error("Erro no refreshAccessToken:", err);
      get().logout();
      return null;
    }
  },

  initializeAuth: async () => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    if (!access || !refresh) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(access);
      const isExpired = decoded.exp * 1000 < Date.now();
      const needsRefresh = decoded.exp * 1000 < Date.now() + 5 * 60 * 1000; // 5 minutos de margem

      let currentAccess = access;

      if (isExpired || needsRefresh) {
        const newToken = await get().refreshAccessToken();
        if (!newToken) return;
        currentAccess = newToken;
      }

      // Valida o token atual e carrega o usuário
      const res = await api.get<User>("/auth/me", {
        headers: { Authorization: `Bearer ${currentAccess}` },
      });

      set({
        user: res.data,
        accessToken: currentAccess,
        refreshToken: localStorage.getItem("refresh_token") || refresh,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.error("Falha na inicialização da auth:", err);
      get().logout();
    }
  },
}));

export default useAuthStore;
