import { AxiosError } from "axios";
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

  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setError: (error: string | null) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    set({ accessToken, refreshToken });
  },

  setError: (error) => set({ error }),

  login: async (accessToken, refreshToken) => {
    set({ isLoading: true, error: null });
    try {
      get().setTokens(accessToken, refreshToken);

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
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      console.error("Erro ao buscar usuário no login:", err);
      get().logout();
      set({
        error:
          axiosError.response?.data?.message ||
          "Falha ao carregar perfil do usuário",
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

      get().setTokens(access_token, finalRefreshToken);
      set({ isAuthenticated: true });

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
      const needsRefresh = decoded.exp * 1000 < Date.now() + 5 * 60 * 1000;

      let currentAccess = access;

      if (isExpired || needsRefresh) {
        const newToken = await get().refreshAccessToken();
        if (!newToken) return;
        currentAccess = newToken;
      }

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