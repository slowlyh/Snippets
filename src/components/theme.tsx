import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx>({ theme: "system", setTheme: () => {} });

function applyTheme(t: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = t === "dark" || (t === "system" && prefersDark);
  root.classList.toggle("dark", isDark);
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = (localStorage.getItem("theme") as Theme) || defaultTheme;
    return stored;
  });

  const setTheme = (t: Theme) => {
    localStorage.setItem("theme", t);
    setThemeState(t);
    applyTheme(t);
  };

  useEffect(() => {
    // apply on mount
    applyTheme(theme);
    // react to system changes when theme=system
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const stored = (localStorage.getItem("theme") as Theme) || "system";
      if (stored === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
