import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plan Nutricional - Sebastian Martini",
  description: "Programa nutricional para jugador de basquet. Macros, suplementos, plan por dia, batch cooking y lista de compras.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
