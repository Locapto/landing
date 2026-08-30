import Image from "next/image";
import Link from "next/link";

export function SiteHeader({ reduced = false }: { reduced?: boolean }) {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" aria-label="Locapto, inicio">
          <Image
            src="/brand/full-logo-colors.webp"
            alt="Locapto"
            width={128}
            height={37}
            priority
          />
        </Link>
        {!reduced && (
          <nav aria-label="Navegación principal" className="desktop-nav">
            <Link href="/como-funciona">Cómo funciona</Link>
            <Link href="/para-gestorias">Para profesionales</Link>
            <Link href="/cobertura">Cobertura</Link>
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
              <Link href="/cobertura">Cobertura</Link>
              <Link href="/recursos">Recursos</Link>
              <Link className="button button-dark" href="/#acceso-beta">
                Solicitar acceso beta
              </Link>
            </nav>
          </details>
        )}
        <Link className="button button-dark header-cta" href="/#acceso-beta">
          Solicitar acceso beta
        </Link>
      </div>
    </header>
  );
}
