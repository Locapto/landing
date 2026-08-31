import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ConsentManager } from "@/components/ConsentManager";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});
export const viewport: Viewport = {
  themeColor: "#10152f",
  colorScheme: "light",
};
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://locapto.com",
  ),
  title: {
    default: "Qué necesitas para abrir un negocio o local | Locapto",
    template: "%s",
  },
  description:
    "Consulta trámites, requisitos, documentos y fuentes oficiales según la actividad y el municipio.",
  applicationName: "Locapto",
  authors: [{ name: "Locapto" }],
  creator: "Locapto",
  publisher: "Locapto",
  formatDetection: { email: false, address: false, telephone: false },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", type: "image/x-icon", sizes: "64x64" },
      { url: "/icon.png?v=3", type: "image/png", sizes: "894x894" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: [{ url: "/icon.png?v=3", type: "image/png", sizes: "894x894" }],
  },
  openGraph: { locale: "es_ES", siteName: "Locapto", type: "website" },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={geist.variable}>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        {children}
        <ConsentManager />
      </body>
    </html>
  );
}
