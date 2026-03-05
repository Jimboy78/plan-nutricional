"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeCtx {
  isDark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ isDark: false, toggleDark: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nutri_dark_mode");
    if (stored === "true") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
      localStorage.setItem("nutri_dark_mode", String(isDark));
    }
  }, [isDark, mounted]);

  const toggleDark = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
