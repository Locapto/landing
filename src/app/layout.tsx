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
    default: "Precalificación para abrir negocios y locales | Locapto",
    template: "%s",
  },
  description:
    "Consulta requisitos, procedimientos, condicionantes y fuentes oficiales según actividad y municipio.",
  applicationName: "Locapto",
  authors: [{ name: "Locapto" }],
  creator: "Locapto",
  publisher: "Locapto",
  formatDetection: { email: false, address: false, telephone: false },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.png", apple: "/icon.png" },
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
