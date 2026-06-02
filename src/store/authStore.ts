import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import api from "../api/api";

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

// Variável de controle fora da store para evitar múltiplas chamadas de refresh simultâneas
let refreshPromise: Promise<string | null> | null = null;

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
      // 1. Salva no Storage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // 2. Busca dados do usuário (usando o token que acabou de chegar)
      const res = await api.get<User>("/auth/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      set({
        user: res.data,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.error(err);
      get().logout();
      set({ error: "Falha ao carregar perfil do usuário", isLoading: false });
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
    });
    // Nota: O redirecionamento deve ser feito pelo componente de rotas (ProtectedRoute)
  },

  refreshAccessToken: async () => {
    // Se já existe um refresh em andamento, retorna a mesma promessa
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      const storedRefresh =
        localStorage.getItem("refresh_token") || get().refreshToken;

      if (!storedRefresh) {
        get().logout();
        return null;
      }

      try {
        const res = await api.post(
          "/auth/auth/refresh",
          {},
          {
            headers: { Authorization: `Bearer ${storedRefresh}` },
          },
        );

        const { access_token, refresh_token } = res.data;

        localStorage.setItem("access_token", access_token);
        if (refresh_token) localStorage.setItem("refresh_token", refresh_token);

        set({
          accessToken: access_token,
          refreshToken: refresh_token || storedRefresh,
          isAuthenticated: true,
        });

        return access_token;
      } catch (err) {
        console.error(err);
        get().logout();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
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
        if (!newToken) return; // refreshAccessToken já lida com o logout
        currentAccess = newToken;
      }

      // Valida o token atual buscando o usuário
      const res = await api.get<User>("/auth/auth/me", {
        headers: { Authorization: `Bearer ${currentAccess}` },
      });

      set({
        user: res.data,
        accessToken: currentAccess,
        refreshToken: refresh,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.error("Falha na inicialização da auth", err);
      get().logout();
    }
  },
}));

export default useAuthStore;
