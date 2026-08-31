import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="thanks-page">
        <div className="shell narrow">
          <p className="eyebrow">Error 404</p>
          <h1>Esta página no está disponible.</h1>
          <p>
            Puede que la dirección haya cambiado o que el contenido ya no esté
            disponible.
          </p>
          <Link className="button button-dark" href="/">
            <ArrowLeft aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
