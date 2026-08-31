import { AlertTriangle, ArrowRight, Check } from "lucide-react";
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
function crumbsFor(page: PublicPageDefinition): Crumb[] {
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
        <section className="page-hero">
          <div className="shell narrow">
            <Breadcrumbs items={crumbs} />
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.heading}</h1>
            <p>{page.intro}</p>
          </div>
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
              <p className="eyebrow">Lista de acceso</p>
              <h2>Precalifica con fuentes oficiales.</h2>
              <p>
                Apúntate desde cualquier municipio de España y podremos
                contactarte cuando abramos el acceso.
              </p>
              <Link className="button button-dark" href="#acceso-beta">
                {BETA_CTA_LABEL} <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
        <section className="related-section">
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">Sigue investigando</p>
              <h2>Recursos relacionados</h2>
            </div>
            <div className="related-grid">
              {page.relatedPaths.map((path) => (
                <Link key={path} href={path}>
                  <span>{pageLabel(path)}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="beta-section" id="acceso-beta">
          <div className="shell beta-grid">
            <div>
              <p className="eyebrow">Lista de acceso</p>
              <h2>Apúntate para cuando Locapto esté disponible.</h2>
              <p>
                Déjanos tu contacto ahora y podremos avisarte cuando abramos el
                acceso en todo el territorio nacional.
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
