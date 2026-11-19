import { create } from "zustand";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const oppositeTheme: Record<Theme, Theme> = {
  light: "dark",
  dark: "light",
};

const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set({ theme: oppositeTheme[get().theme] }),
}));

export default useThemeStore;
