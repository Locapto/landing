import Image from "next/image";
import Link from "next/link";
import { OpenConsentButton } from "./OpenConsentButton";

const groups = [
  [
    "Producto",
    [
      ["Cómo funciona", "/como-funciona"],
      ["Lista de acceso", "/#acceso-beta"],
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
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image
            src="/brand/full-logo-colors.webp"
            alt="Locapto"
            width={128}
            height={37}
          />
          <p>
            Precalificación de aperturas de negocio con fuentes oficiales para
            solicitudes de toda España.
          </p>
        </div>
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
      </div>
      <div className="shell footer-bottom">
        <p>
          Locapto ofrece información preliminar basada en fuentes oficiales. No
          concede licencias ni sustituye la revisión profesional o
          administrativa que pueda resultar necesaria.
        </p>
        <OpenConsentButton />
      </div>
    </footer>
  );
}
