import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BETA_CTA_LABEL } from "@/config/marketing";
import { activitySeoDefinitions } from "@/content/seo/activities";
import { geographyCatalog } from "@/content/seo/geography";
import { activityPath, territoryPath } from "@/content/seo/routes";
import { OpenConsentButton } from "./OpenConsentButton";

const groups = [
  [
    "Producto",
    [
      ["Cómo funciona", "/como-funciona"],
      ["Aviso de disponibilidad", "/#acceso-beta"],
    ],
  ],
  [
    "Profesionales",
    [
      ["Gestorías", "/para-gestorias"],
      ["Arquitectura e ingeniería", "/para-arquitectos-ingenieros"],
      ["Empresas", "/para-empresas"],
    ],
  ],
  [
    "Recursos",
    [
      ["Guías", "/recursos"],
      ["Licencia de actividad", "/recursos/licencia-de-actividad"],
      ["Declaración responsable", "/recursos/declaracion-responsable"],
    ],
  ],
  [
    "Legal",
    [
      ["Aviso legal", "/aviso-legal"],
      ["Privacidad", "/privacidad"],
      ["Cookies", "/cookies"],
    ],
  ],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-callout">
        <div>
          <span>Locapto estará disponible próximamente</span>
          <h2>¿Quieres que te avisemos?</h2>
        </div>
        <Link className="footer-callout-link" href="/#acceso-beta">
          {BETA_CTA_LABEL}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
      <div className="shell footer-main">
        <div className="footer-brand">
          <Link className="footer-logo" href="/" aria-label="Locapto, inicio">
            <Image
              src="/brand/full-logo-white.png"
              alt=""
              width={160}
              height={56}
            />
          </Link>
          <p>
            Información para preparar aperturas de negocio con fuentes oficiales
            en toda España.
          </p>
        </div>
        <nav className="footer-nav" aria-label="Enlaces del pie de página">
          {groups.map(([title, links]) => (
            <div key={title}>
              <strong>{title}</strong>
              {links.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <nav
        className="shell footer-directory"
        aria-label="Directorios de actividades y comunidades"
      >
        <div>
          <strong>Abrir un negocio</strong>
          <div className="footer-directory-links footer-activity-links">
            {activitySeoDefinitions.map((activity) => (
              <Link key={activity.slug} href={activityPath(activity)}>
                Abrir {activity.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <strong>Por comunidad autónoma</strong>
          <div className="footer-directory-links footer-community-links">
            {geographyCatalog.communities.map((community) => (
              <Link key={community.code} href={territoryPath(community)}>
                {community.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <div className="shell footer-bottom">
        <p>
          Locapto ofrece información preliminar basada en fuentes oficiales. No
          concede licencias ni sustituye la revisión profesional o
          administrativa que pueda resultar necesaria.
        </p>
        <div className="footer-legal-actions">
          <span>© 2026 Locapto</span>
          <OpenConsentButton />
        </div>
      </div>
    </footer>
  );
}
