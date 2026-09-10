//client/lib/theme-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = "candidex-theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    const initialPref = stored ?? "system";
    const resolved = initialPref === "system" ? getSystemTheme() : initialPref;
    setPreferenceState(initialPref);
    setTheme(resolved);
    applyTheme(resolved);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setPreferenceState((current) => {
        if (current === "system") {
          const next = getSystemTheme();
          setTheme(next);
          applyTheme(next);
        }
        return current;
      });
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const setPreference = (p: ThemePreference) => {
    setPreferenceState(p);
    window.localStorage.setItem(STORAGE_KEY, p);
    const resolved = p === "system" ? getSystemTheme() : p;
    setTheme(resolved);
    applyTheme(resolved);
  };

  const toggle = () => setPreference(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}