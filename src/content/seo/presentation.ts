import type { Metadata } from "next";
import { marketingConfig } from "@/config/marketing";
import { geographyCatalog } from "./geography";
import type { SeoRoute } from "./routes";

export type SeoPagePresentation = {
  title: string;
  description: string;
  heading: string;
  eyebrow: string;
  intro: string;
  lastModified: string;
};

export function seoPagePresentation(route: SeoRoute): SeoPagePresentation {
  const place =
    route.municipality?.name ?? route.province?.name ?? route.community?.name;
  const activity = route.activity;
  switch (route.kind) {
    case "territory-index":
      return {
        title: "Municipios de España para abrir un negocio | Locapto",
        description:
          "Consulta el directorio territorial de comunidades, provincias y municipios para preparar la apertura de un negocio.",
        heading: "Abrir un negocio en cualquier municipio de España.",
        eyebrow: "Directorio territorial",
        intro:
          "Elige una comunidad autónoma o ciudad autónoma para llegar a la provincia, el municipio y la actividad que quieres iniciar.",
        lastModified: geographyCatalog.publishedAt,
      };
    case "community":
      return {
        title: `Municipios de ${place} para abrir un negocio | Locapto`,
        description: `Consulta las provincias y municipios de ${place} para preparar una apertura con contexto territorial y fuentes oficiales.`,
        heading: `Municipios de ${place}.`,
        eyebrow: "Directorio territorial",
        intro:
          "Selecciona una provincia para consultar sus municipios y las actividades disponibles en el directorio.",
        lastModified: geographyCatalog.publishedAt,
      };
    case "province":
      return {
        title: `Municipios de ${place} para abrir un negocio | Locapto`,
        description: `Directorio de municipios de ${place} para consultar información preliminar sobre aperturas de negocio.`,
        heading: `Municipios de ${place}.`,
        eyebrow: route.community?.name ?? "Directorio territorial",
        intro:
          "Selecciona un municipio para ver las actividades y la información general que conviene comprobar antes de abrir un local.",
        lastModified: geographyCatalog.publishedAt,
      };
    case "municipality":
      return {
        title: `Abrir un negocio en ${place}: actividades y fuentes | Locapto`,
        description: `Consulta actividades, requisitos generales y fuentes oficiales para preparar la apertura de un negocio en ${place}.`,
        heading: `Abrir un negocio en ${place}.`,
        eyebrow: `${route.province?.name} · ${route.community?.name}`,
        intro:
          "Elige una actividad para consultar una orientación inicial. La viabilidad de una dirección y un local concretos siempre requiere comprobaciones adicionales.",
        lastModified: geographyCatalog.publishedAt,
      };
    case "activity-index":
      return {
        title: "Cómo abrir un negocio: actividades y municipios | Locapto",
        description:
          "Consulta cómo suele iniciarse cada actividad y recorre comunidades, provincias y municipios de España.",
        heading: "Cómo abrir un negocio en España.",
        eyebrow: "Directorio por actividad",
        intro:
          "Selecciona una actividad y después el territorio. Encontrarás requisitos generales, pasos habituales, incertidumbres y fuentes oficiales.",
        lastModified: route.activity?.lastReviewedAt ?? "2026-08-31",
      };
    case "activity":
      return {
        title: `Cómo abrir ${activity?.name} en España | Locapto`,
        description: `Consulta los pasos y requisitos generales para abrir ${activity?.name} y elige comunidad, provincia y municipio.`,
        heading: `Cómo abrir ${activity?.name} en España.`,
        eyebrow: "Guía por actividad",
        intro: activity?.summary ?? "Selecciona un territorio para continuar.",
        lastModified: activity?.lastReviewedAt ?? "2026-08-31",
      };
    case "activity-community":
      return {
        title: `Cómo abrir ${activity?.name} en ${place} | Locapto`,
        description: `Consulta información preliminar para abrir ${activity?.name} en ${place} y elige provincia y municipio.`,
        heading: `Abrir ${activity?.name} en ${place}.`,
        eyebrow: "Guía por actividad y territorio",
        intro:
          "Elige una provincia para llegar al municipio. El procedimiento concreto debe contrastarse con la administración competente.",
        lastModified: activity?.lastReviewedAt ?? "2026-08-31",
      };
    case "activity-province":
      return {
        title: `Cómo abrir ${activity?.name} en ${place} | Locapto`,
        description: `Elige un municipio de ${place} y consulta requisitos generales, pasos y fuentes para abrir ${activity?.name}.`,
        heading: `Abrir ${activity?.name} en ${place}.`,
        eyebrow: route.community?.name ?? "Guía territorial",
        intro:
          "Selecciona un municipio para consultar una orientación general y las cuestiones que dependen de la dirección y del local.",
        lastModified: activity?.lastReviewedAt ?? "2026-08-31",
      };
    case "activity-municipality":
      return {
        title: `Cómo abrir ${activity?.name} en ${place}: requisitos | Locapto`,
        description: `Requisitos generales, pasos, incertidumbres y fuentes oficiales para preparar la apertura de ${activity?.name} en ${place}.`,
        heading: `Cómo abrir ${activity?.name} en ${place}.`,
        eyebrow: `${route.province?.name} · ${route.community?.name}`,
        intro: `${activity?.summary} Esta orientación identifica el territorio, pero no determina la compatibilidad de una dirección o un local concretos.`,
        lastModified: activity?.lastReviewedAt ?? "2026-08-31",
      };
  }
}

export function metadataForSeoRoute(route: SeoRoute): Metadata {
  const presentation = seoPagePresentation(route);
  const indexable =
    route.kind !== "activity-municipality" ||
    marketingConfig.municipalityActivityIndexingEnabled;
  return {
    title: presentation.title,
    description: presentation.description,
    alternates: { canonical: route.canonicalPath },
    robots: { index: indexable, follow: true },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: route.canonicalPath,
      title: presentation.title,
      description: presentation.description,
      siteName: "Locapto",
    },
    twitter: {
      card: "summary_large_image",
      title: presentation.title,
      description: presentation.description,
    },
  };
}
