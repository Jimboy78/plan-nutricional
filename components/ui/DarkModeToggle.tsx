"use client";

import { useTheme } from "../context/ThemeContext";

export function DarkModeToggle() {
  const { isDark, toggleDark } = useTheme();

  return (
    <button
      onClick={toggleDark}
      style={{
        background: "rgba(255,255,255,0.15)",
        border: "none",
        borderRadius: 8,
        padding: "5px 10px",
        cursor: "pointer",
        fontSize: 18,
        lineHeight: 1,
        transition: "background 0.2s",
      }}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
