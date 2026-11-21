import { create } from "zustand";
import { persist } from "zustand/middleware";

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

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: oppositeTheme[get().theme] }),
    }),
    { name: "theme-storage" },
  ),
);

export default useThemeStore;
