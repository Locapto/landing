import Image from "next/image";
import Link from "next/link";
import { BETA_CTA_LABEL } from "@/config/marketing";
import { TrackedBetaLink } from "./TrackedBetaLink";

export function SiteHeader({ reduced = false }: { reduced?: boolean }) {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="header-brand" href="/" aria-label="Locapto, inicio">
          <Image
            src="/brand/full-logo-colors.png"
            alt=""
            width={144}
            height={41}
            priority
          />
        </Link>
        {!reduced && (
          <nav aria-label="Navegación principal" className="desktop-nav">
            <Link href="/como-funciona">Cómo funciona</Link>
            <Link href="/para-gestorias">Para profesionales</Link>
            <Link href="/recursos">Recursos</Link>
          </nav>
        )}
        {!reduced && (
          <details className="mobile-menu">
            <summary aria-label="Abrir menú">
              <span></span>
              <span></span>
              <span></span>
            </summary>
            <nav aria-label="Navegación móvil">
              <Link href="/como-funciona">Cómo funciona</Link>
              <Link href="/para-gestorias">Para profesionales</Link>
              <Link href="/recursos">Recursos</Link>
              <TrackedBetaLink variant="content">
                {BETA_CTA_LABEL}
              </TrackedBetaLink>
            </nav>
          </details>
        )}
        <TrackedBetaLink
          className="button button-dark header-cta"
          variant="content"
        >
          {BETA_CTA_LABEL}
        </TrackedBetaLink>
      </div>
    </header>
  );
}
