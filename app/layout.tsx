import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/context/ClientProviders";

export const metadata: Metadata = {
  title: "Plan Nutricional - Sebastian Martini",
  description: "Programa nutricional para jugador de basquet. Macros, suplementos, plan por dia, batch cooking y lista de compras.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var d=localStorage.getItem('nutri_dark_mode');if(d==='true')document.documentElement.setAttribute('data-theme','dark')}catch(e){}})()`,
        }} />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
