"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  accent,
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  accent?: string;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const stored = localStorage.getItem("mi-theme") as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mi-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!accent) return;
    const root = document.documentElement;
    root.style.setProperty("--cyan", accent);
    root.style.setProperty("--accent-grad", `linear-gradient(120deg, ${accent} 0%, #7C3AED 100%)`);
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
