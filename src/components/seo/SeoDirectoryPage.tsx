import { AlertTriangle, ArrowRight, Check, Landmark } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackedBetaLink } from "@/components/TrackedBetaLink";
import { marketingConfig } from "@/config/marketing";
import { activitySeoDefinitions } from "@/content/seo/activities";
import { geographyCatalog } from "@/content/seo/geography";
import { seoPagePresentation } from "@/content/seo/presentation";
import {
  activityPath,
  territoryPath,
  type SeoRoute,
} from "@/content/seo/routes";

const officialDirectorySource = {
  title: "Directorio de las Administraciones Públicas",
  url: "https://administracion.gob.es/pagFront/espanaAdmon/directorioOrganigrama/entidadesLocales/entidadesLocales.htm",
  organization: "Punto de Acceso General de la Administración",
  scope: "Directorio oficial para localizar la sede y los trámites municipales",
  lastReviewedAt: "2026-08-31",
};

function crumbsFor(route: SeoRoute): Crumb[] {
  const crumbs: Crumb[] = [];
  if (route.kind.startsWith("activity")) {
    crumbs.push({ label: "Abrir un negocio", path: activityPath() });
    if (route.activity)
      crumbs.push({
        label: route.activity.name,
        path: activityPath(route.activity),
      });
    if (route.community)
      crumbs.push({
        label: route.community.name,
        path: activityPath(route.activity, route.community),
      });
    if (route.province)
      crumbs.push({
        label: route.province.name,
        path: activityPath(route.activity, route.community, route.province),
      });
    if (route.municipality)
      crumbs.push({
        label: route.municipality.name,
        path: route.canonicalPath,
      });
    return crumbs;
  }
  crumbs.push({ label: "Municipios", path: territoryPath() });
  if (route.community)
    crumbs.push({
      label: route.community.name,
      path: territoryPath(route.community),
    });
  if (route.province)
    crumbs.push({
      label: route.province.name,
      path: territoryPath(route.community, route.province),
    });
  if (route.municipality)
    crumbs.push({
      label: route.municipality.name,
      path: route.canonicalPath,
    });
  return crumbs;
}

function directoryItems(route: SeoRoute): Array<{
  label: string;
  detail: string;
  path: string;
}> {
  switch (route.kind) {
    case "territory-index":
      return geographyCatalog.communities.map((community) => ({
        label: community.name,
        detail: `${community.provinces.length} ${community.provinces.length === 1 ? "provincia" : "provincias"}`,
        path: territoryPath(community),
      }));
    case "community":
      return (route.community?.provinces ?? []).map((province) => ({
        label: province.name,
        detail: `${province.municipalities.length} municipios`,
        path: territoryPath(route.community, province),
      }));
    case "province":
      return (route.province?.municipalities ?? []).map((municipality) => ({
        label: municipality.name,
        detail: `Código INE ${municipality.code}`,
        path: territoryPath(route.community, route.province, municipality),
      }));
    case "municipality":
      return activitySeoDefinitions.map((activity) => ({
        label: `Abrir ${activity.name}`,
        detail: "Requisitos, pasos y fuentes",
        path: activityPath(
          activity,
          route.community,
          route.province,
          route.municipality,
        ),
      }));
    case "activity-index":
      return activitySeoDefinitions.map((activity) => ({
        label: `Abrir ${activity.name}`,
        detail: activity.synonyms.slice(0, 2).join(" · "),
        path: activityPath(activity),
      }));
    case "activity":
      return geographyCatalog.communities.map((community) => ({
        label: community.name,
        detail: `${community.provinces.length} ${community.provinces.length === 1 ? "provincia" : "provincias"}`,
        path: activityPath(route.activity, community),
      }));
    case "activity-community":
      return (route.community?.provinces ?? []).map((province) => ({
        label: province.name,
        detail: `${province.municipalities.length} municipios`,
        path: activityPath(route.activity, route.community, province),
      }));
    case "activity-province":
      return (route.province?.municipalities ?? []).map((municipality) => ({
        label: municipality.name,
        detail: `Código INE ${municipality.code}`,
        path: activityPath(
          route.activity,
          route.community,
          route.province,
          municipality,
        ),
      }));
    case "activity-municipality":
      return [];
  }
}

function schemasFor(route: SeoRoute, crumbs: Crumb[]) {
  const presentation = seoPagePresentation(route);
  const items = directoryItems(route);
  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: presentation.heading,
      description: presentation.description,
      url: new URL(route.canonicalPath, marketingConfig.siteUrl).toString(),
      inLanguage: "es",
      dateModified: presentation.lastModified,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: marketingConfig.siteUrl,
        },
        ...crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: crumb.label,
          item: new URL(crumb.path, marketingConfig.siteUrl).toString(),
        })),
      ],
    },
  ];
  if (items.length)
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: new URL(item.path, marketingConfig.siteUrl).toString(),
      })),
    });
  return schemas;
}

function Directory({ route }: { route: SeoRoute }) {
  const items = directoryItems(route);
  return (
    <section
      className="seo-directory-section"
      aria-labelledby="directory-title"
    >
      <div className="shell">
        <div className="seo-section-heading">
          <div>
            <p className="eyebrow">Siguiente nivel</p>
            <h2 id="directory-title">
              {route.kind === "municipality"
                ? "Elige una actividad"
                : "Elige un territorio"}
            </h2>
          </div>
          <p>{items.length} opciones en este directorio.</p>
        </div>
        <ul className="seo-directory-grid">
          {items.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HubContent({ route }: { route: SeoRoute }) {
  const activity = route.activity;
  if (activity && route.kind !== "activity-municipality")
    return (
      <section className="section" aria-labelledby="activity-overview-title">
        <div className="shell seo-article-layout">
          <article className="seo-article">
            <section>
              <h2 id="activity-overview-title">
                Qué conviene revisar antes de abrir {activity.name}
              </h2>
              <p>{activity.summary}</p>
              <p>
                El procedimiento y las condiciones concretas pueden cambiar con
                la ubicación, el alcance de la actividad y las características
                del local. Este hub organiza la orientación general y el acceso
                al siguiente nivel territorial.
              </p>
            </section>
            <section>
              <h2>Requisitos generales</h2>
              <ul className="check-list">
                {activity.requirements.map((requirement) => (
                  <li key={requirement}>
                    <Check aria-hidden="true" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2>Pasos habituales</h2>
              <ol className="step-list">
                {activity.steps.map((step, index) => (
                  <li key={step}>
                    <span>{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2>Fuentes generales de referencia</h2>
              <ul className="seo-source-list">
                {activity.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      <span>
                        <strong>{source.title}</strong>
                        <small>{source.organization}</small>
                      </span>
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </article>
          <aside className="seo-product-aside">
            <div>
              <p className="eyebrow">Guías relacionadas</p>
              <h2>Prepara mejor la revisión del local.</h2>
              <p>
                Consulta conceptos habituales antes de concretar el trámite y la
                documentación aplicables.
              </p>
              <Link href="/recursos/que-comprobar-antes-de-alquilar-un-local">
                Qué comprobar antes de alquilar un local
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link href="/recursos/licencia-actividad-vs-declaracion-responsable">
                Licencia o declaración responsable
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    );

  return (
    <section className="section" aria-labelledby="territory-context-title">
      <div className="shell narrow seo-article">
        <h2 id="territory-context-title">La ubicación cambia la revisión.</h2>
        <p>
          El municipio, la actividad concreta y las características del local
          determinan qué administración, procedimiento y documentación conviene
          contrastar. Utiliza el directorio para avanzar por la jerarquía
          territorial sin interpretar la ruta como una comprobación del caso.
        </p>
      </div>
    </section>
  );
}

function FinalActivityPage({ route }: { route: SeoRoute }) {
  const activity = route.activity;
  const municipality = route.municipality;
  if (!activity || !municipality || !route.province || !route.community)
    return null;
  const sources = [
    ...activity.sources,
    {
      title: geographyCatalog.source.title,
      url: geographyCatalog.source.url,
      organization: geographyCatalog.source.organization,
      scope: "Identidad territorial y código INE",
      lastReviewedAt: geographyCatalog.source.lastReviewedAt,
    },
    officialDirectorySource,
  ];
  return (
    <div className="shell seo-article-layout">
      <article className="seo-article">
        <section>
          <p className="seo-answer">
            {activity.summary} En {municipality.name}, el ayuntamiento es quien
            debe confirmar el trámite y las condiciones municipales aplicables.
          </p>
          <div className="seo-territory-card">
            <Landmark aria-hidden="true" />
            <dl>
              <div>
                <dt>Municipio</dt>
                <dd>{municipality.name}</dd>
              </div>
              <div>
                <dt>Provincia</dt>
                <dd>{route.province.name}</dd>
              </div>
              <div>
                <dt>Comunidad</dt>
                <dd>{route.community.name}</dd>
              </div>
              <div>
                <dt>Código INE</dt>
                <dd>{municipality.code}</dd>
              </div>
            </dl>
          </div>
        </section>
        <section>
          <h2>Requisitos generales que suele cumplir el local</h2>
          <ul className="check-list">
            {activity.requirements.map((requirement) => (
              <li key={requirement}>
                <Check aria-hidden="true" />
                {requirement}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Pasos habituales</h2>
          <ol className="step-list">
            {activity.steps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2>Qué depende de la dirección y del local</h2>
          <ul className="seo-plain-list">
            {activity.uncertainties.map((uncertainty) => (
              <li key={uncertainty}>{uncertainty}</li>
            ))}
          </ul>
          <aside className="content-callout">
            <AlertTriangle aria-hidden="true" />
            <div>
              <strong>Información preliminar</strong>
              <p>
                Esta página no resuelve la compatibilidad de una dirección, las
                condiciones específicas de un local ni la documentación
                personalizada. Tampoco sustituye la consulta al ayuntamiento o
                la revisión técnica necesaria.
              </p>
            </div>
          </aside>
        </section>
        <section>
          <h2>Fuentes oficiales consultadas</h2>
          <p>
            No se ha revisado una fuente municipal específica para esta
            combinación. Usa el directorio oficial para localizar la sede del
            Ayuntamiento de {municipality.name} y contrasta allí el trámite
            vigente.
          </p>
          <ul className="seo-source-list">
            {sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  <span>
                    <strong>{source.title}</strong>
                    <small>
                      {source.organization} · {source.scope}
                    </small>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="seo-review-date">
            Contenido revisado el {activity.lastReviewedAt}. Catálogo INE:{" "}
            {geographyCatalog.version}.
          </p>
        </section>
      </article>
      <aside className="seo-product-aside">
        <div>
          <p className="eyebrow">Próximamente en Locapto</p>
          <h2>Analiza una dirección y un local concretos.</h2>
          <p>
            Locapto añadirá comprobaciones del emplazamiento, condiciones del
            local, documentación personalizada, fuentes trazables y seguimiento
            de cambios.
          </p>
          <TrackedBetaLink
            variant="content"
            qualification={{
              activity: activity.name,
              activityKey: activity.slug,
              municipality: municipality.name,
              municipalityCode: municipality.code,
            }}
          >
            Avísame cuando esté disponible
            <ArrowRight aria-hidden="true" />
          </TrackedBetaLink>
        </div>
      </aside>
    </div>
  );
}

export function SeoDirectoryPage({ route }: { route: SeoRoute }) {
  const presentation = seoPagePresentation(route);
  const crumbs = crumbsFor(route);
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="seo-page">
        <JsonLd data={schemasFor(route, crumbs)} />
        <section className="page-hero seo-page-hero">
          <div className="shell narrow">
            <Breadcrumbs items={crumbs} />
            <p className="eyebrow">{presentation.eyebrow}</p>
            <h1>{presentation.heading}</h1>
            <p>{presentation.intro}</p>
          </div>
        </section>
        {route.kind === "activity-municipality" ? (
          <FinalActivityPage route={route} />
        ) : (
          <>
            <HubContent route={route} />
            <Directory route={route} />
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
