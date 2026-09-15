import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/context/ClientProviders";

const display = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Outfit({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Plan Nutricional - Sebastian Martini",
  description: "Programa nutricional para jugador de basquet. Macros, suplementos, plan por dia, batch cooking y lista de compras.",
};

export const viewport: Viewport = {
  themeColor: "#0f2744",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
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
