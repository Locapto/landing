import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Gracias por tu interés | Locapto",
  description: "Te has apuntado para cuando Locapto esté disponible.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/gracias" },
};
export default function ThanksPage() {
  return (
    <>
      <SiteHeader reduced />
      <main id="contenido" className="thanks-page">
        <div className="shell narrow">
          <span className="thanks-check" aria-hidden="true">
            ✓
          </span>
          <p className="eyebrow">Lista de avisos</p>
          <h1>Gracias por tu interés en Locapto.</h1>
          <p>
            Te avisaremos usando los datos que nos has facilitado en cuanto
            Locapto esté disponible.
          </p>
          <Link className="button button-dark" href="/">
            <ArrowLeft aria-hidden="true" />
            Volver a Locapto
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
