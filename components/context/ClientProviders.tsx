"use client";

import { ThemeProvider } from "./ThemeContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
