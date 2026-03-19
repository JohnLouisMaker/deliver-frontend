import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import api from "../lib/api";

interface User {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
  ativo: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

interface JwtPayload {
  sub: string;
  type: string;
  exp: number;
  iat: number;
}

async function fetchCurrentUser(): Promise<User> {
  const response = await api.get("/auth/user");
  return response.data;
}

// CRIAÇÃO DO STORE
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  isAuthenticated: false,

  login: async (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    set({ accessToken, refreshToken });

    try {
      const user = await fetchCurrentUser();
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error("Erro ao validar login:", error);
      get().logout();
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  },

  // FUNÇÃO PARA INICIALIZAR O STORE DE AUTENTICAÇÃO
  initializeAuth: async () => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    if (!access) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(access);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp <= now) {
        if (refresh) {
          try {
            const res = await api.post(
              "/auth/refresh",
              {},
              { headers: { Authorization: `Bearer ${refresh}` } },
            );

            const { access_token, refresh_token } = res.data;

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

            set({
              accessToken: access_token,
              refreshToken: refresh_token,
              isAuthenticated: true,
            });

            return;
          } catch {
            get().logout();
            return;
          }
        }

        set({ accessToken: null, refreshToken: null, isAuthenticated: false });
        return;
      }

      // token ainda válido → NÃO faz refresh
      set({
        accessToken: access,
        refreshToken: refresh,
        isAuthenticated: true,
      });

      const user = await fetchCurrentUser();
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.warn("Sessão inválida ou expirada:", error);
      get().logout();
    }
  },
}));
