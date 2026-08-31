import {
  AlertTriangle,
  ArrowRight,
  Check,
  Landmark,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { BETA_CTA_LABEL, type LandingVariant } from "@/config/marketing";
import type { PublicPageDefinition } from "@/content/types";
import { pageLabel } from "@/content/pages";
import { BetaLeadForm } from "./BetaLeadForm";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

const SITE = "https://locapto.com";
const audienceHeroContent: Record<
  string,
  { label: string; context: string; highlights: string[] }
> = {
  "/para-gestorias": {
    label: "Expediente organizado",
    context: "Peluquería · Madrid",
    highlights: [
      "Trámite más probable",
      "Documentación habitual",
      "Fuentes y fecha de revisión",
    ],
  },
  "/para-arquitectos-ingenieros": {
    label: "Revisión inicial del local",
    context: "Local comercial · 85 m²",
    highlights: [
      "Compatibilidad del uso",
      "Obras e instalaciones",
      "Puntos técnicos por confirmar",
    ],
  },
  "/para-empresas": {
    label: "Comparación inicial",
    context: "Nueva ubicación · Madrid",
    highlights: [
      "Riesgos antes de alquilar",
      "Datos pendientes del local",
      "Fuentes oficiales consultadas",
    ],
  },
};
const relatedLabels: Record<string, string> = {
  "/como-funciona": "Cómo funciona Locapto",
  "/recursos": "Guías para preparar una apertura",
  "/recursos/licencia-de-actividad": "Qué es una licencia de actividad",
  "/recursos/declaracion-responsable":
    "Cómo funciona una declaración responsable",
  "/recursos/licencia-de-apertura": "Qué es una licencia de apertura",
  "/recursos/licencia-actividad-vs-declaracion-responsable":
    "Licencia o declaración responsable",
  "/recursos/que-comprobar-antes-de-alquilar-un-local":
    "Qué comprobar antes de alquilar un local",
  "/recursos/como-abrir-un-negocio-en-un-local":
    "Cómo abrir un negocio en un local",
  "/para-gestorias": "Locapto para gestorías",
  "/para-arquitectos-ingenieros": "Locapto para técnicos",
  "/para-empresas": "Locapto para empresas",
};

function relatedCategory(path: string) {
  if (path === "/como-funciona") return "Producto";
  if (path === "/recursos") return "Colección de guías";
  if (path.startsWith("/recursos/")) return "Guía práctica";
  return "Para profesionales";
}

function crumbsFor(page: PublicPageDefinition): Crumb[] {
  if (page.kind === "audience")
    return [{ label: page.eyebrow, path: page.path }];
  return page.path.startsWith("/recursos/")
    ? [
        { label: "Recursos", path: "/recursos" },
        { label: page.heading, path: page.path },
      ]
    : [{ label: page.heading, path: page.path }];
}
function variantFor(path: string): LandingVariant {
  if (path === "/para-gestorias") return "seo_gestorias";
  if (path === "/para-arquitectos-ingenieros") return "seo_tecnicos";
  if (path === "/para-empresas") return "seo_empresas";
  return "content";
}

export function ContentPage({ page }: { page: PublicPageDefinition }) {
  const crumbs = crumbsFor(page);
  const variant = variantFor(page.path);
  const audienceHero =
    page.kind === "audience" ? audienceHeroContent[page.path] : undefined;
  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
        ...crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: crumb.label,
          item: `${SITE}${crumb.path}`,
        })),
      ],
    },
  ];
  if (page.kind === "article")
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.heading,
      description: page.description,
      inLanguage: "es",
      mainEntityOfPage: `${SITE}${page.path}`,
      publisher: { "@type": "Organization", name: "Locapto", url: SITE },
    });
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <JsonLd data={schemas} />
        <section
          className={
            audienceHero ? "page-hero audience-page-hero" : "page-hero"
          }
        >
          {audienceHero ? (
            <div className="shell audience-hero-layout">
              <div className="audience-hero-copy">
                <Breadcrumbs items={crumbs} />
                <p className="eyebrow">{page.eyebrow}</p>
                <h1>{page.heading}</h1>
                <p>{page.intro}</p>
                <div className="audience-hero-actions">
                  <Link className="button button-dark" href="#acceso-beta">
                    {BETA_CTA_LABEL} <ArrowRight aria-hidden="true" />
                  </Link>
                  <span>Sin compromiso · Para solicitudes de toda España</span>
                </div>
              </div>
              <div
                className="audience-hero-card"
                aria-label={`Vista de Locapto para ${page.eyebrow.toLowerCase()}`}
              >
                <div className="audience-card-topline">
                  <span>
                    <Sparkles aria-hidden="true" />
                    Vista inicial
                  </span>
                  <strong>{audienceHero.label}</strong>
                </div>
                <div className="audience-card-context">
                  <span>Ejemplo de apertura</span>
                  <strong>{audienceHero.context}</strong>
                </div>
                <ul>
                  {audienceHero.highlights.map((highlight) => (
                    <li key={highlight}>
                      <Check aria-hidden="true" />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <div className="audience-card-source">
                  <Landmark aria-hidden="true" />
                  <div>
                    <strong>Basado en fuentes oficiales</strong>
                    <span>Información localizable y lista para revisar</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="shell narrow">
              <Breadcrumbs items={crumbs} />
              <p className="eyebrow">{page.eyebrow}</p>
              <h1>{page.heading}</h1>
              <p>{page.intro}</p>
            </div>
          )}
        </section>
        <div className="shell article-layout">
          <article className="article-content">
            {page.sections.map((section, index) => (
              <section key={section.title} id={section.id}>
                <span className="section-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{section.title}</h2>
                {section.blocks.map((block, blockIndex) => {
                  if (block.type === "paragraph")
                    return <p key={blockIndex}>{block.text}</p>;
                  if (block.type === "bullets")
                    return (
                      <ul className="check-list" key={blockIndex}>
                        {block.items.map((item) => (
                          <li key={item}>
                            <Check aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  if (block.type === "steps")
                    return (
                      <ol className="step-list" key={blockIndex}>
                        {block.items.map((item, stepIndex) => (
                          <li key={item.title}>
                            <span>{stepIndex + 1}</span>
                            <div>
                              <strong>{item.title}</strong>
                              <p>{item.text}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    );
                  return (
                    <aside className="content-callout" key={blockIndex}>
                      <AlertTriangle aria-hidden="true" />
                      <div>
                        <strong>{block.title}</strong>
                        <p>{block.text}</p>
                      </div>
                    </aside>
                  );
                })}
              </section>
            ))}
          </article>
          <aside className="article-aside">
            <div className="aside-card">
              <p className="eyebrow">Aviso de disponibilidad</p>
              <h2>Prepara tu apertura con fuentes oficiales.</h2>
              <p>
                Déjanos tu contacto y te avisaremos cuando Locapto esté
                disponible para solicitudes de toda España.
              </p>
              <Link
                className="button button-dark aside-cta"
                href="#acceso-beta"
              >
                <span>{BETA_CTA_LABEL}</span>
                <span className="aside-cta-icon" aria-hidden="true">
                  <ArrowRight />
                </span>
              </Link>
            </div>
          </aside>
        </div>
        <section className="related-section">
          <div className="shell">
            <div className="related-heading">
              <div>
                <p className="eyebrow">Sigue avanzando</p>
                <h2>También te puede ayudar</h2>
              </div>
              <p>
                Continúa con una guía práctica o descubre cómo encaja Locapto en
                tu forma de trabajar.
              </p>
            </div>
            <div className="related-grid">
              {page.relatedPaths.map((path, index) => (
                <Link key={path} href={path}>
                  <div className="related-card-meta">
                    <span>{relatedCategory(path)}</span>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                  </div>
                  <h3>{relatedLabels[path] ?? pageLabel(path)}</h3>
                  <div className="related-card-action">
                    <span>Ver recurso</span>
                    <ArrowRight aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="beta-section" id="acceso-beta">
          <div className="shell beta-grid">
            <div>
              <p className="eyebrow">Aviso de disponibilidad</p>
              <h2>Te avisaremos cuando Locapto esté disponible.</h2>
              <p>
                Déjanos tu contacto. Podrás usar Locapto para solicitudes de
                cualquier municipio de España.
              </p>
            </div>
            <BetaLeadForm landingVariant={variant} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
