import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { activitySitemapEntries } from "@/app/sitemaps/[activity]/route";
import { SeoDirectoryPage } from "@/components/seo/SeoDirectoryPage";
import {
  activitySelection,
  activitySeoDefinitions,
} from "@/content/seo/activities";
import {
  geographyCatalog,
  municipalityByCode,
  municipalityCount,
} from "@/content/seo/geography";
import { metadataForSeoRoute } from "@/content/seo/presentation";
import { seoIndexabilityForRoute } from "@/content/seo/indexability";
import { resolveSeoRoute, upperLevelStaticParams } from "@/content/seo/routes";
import { slugifyTerritory } from "@/content/seo/slug";
import {
  activityHubSitemapEntries,
  sitemapIndexXml,
  territorialHubSitemapEntries,
  urlsetXml,
} from "@/lib/seo/sitemaps";

describe("INE geography catalog", () => {
  it("contains complete, unique five-digit municipality codes", () => {
    const codes = [...municipalityByCode.keys()];
    expect(geographyCatalog.communities).toHaveLength(19);
    expect(
      geographyCatalog.communities.flatMap((community) => community.provinces),
    ).toHaveLength(52);
    expect(municipalityCount).toBe(8132);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes.every((code) => /^\d{5}$/.test(code))).toBe(true);
    for (const [code, match] of municipalityByCode)
      expect(code.startsWith(match.province.code)).toBe(true);
  });

  it("normalizes accents, ñ, punctuation and official trailing articles", () => {
    expect(slugifyTerritory("Cañiza, A")).toBe("a-caniza");
    expect(slugifyTerritory("Iglesuela del Cid, La")).toBe(
      "la-iglesuela-del-cid",
    );
    expect(slugifyTerritory("Asturias, Principado de")).toBe(
      "principado-de-asturias",
    );
    expect(slugifyTerritory("Castellón/Castelló")).toBe("castellon-castello");
  });

  it("keeps homonymous municipalities addressable by INE code", () => {
    const matches = [...municipalityByCode.values()].filter(
      ({ municipality }) => municipality.slug === "mieres",
    );
    expect(matches.length).toBeGreaterThan(1);
    expect(
      new Set(matches.map(({ municipality }) => municipality.code)).size,
    ).toBe(matches.length);
  });
});

describe("SEO route resolution", () => {
  it("uses the ten activities selected with Google Trends", () => {
    expect(activitySeoDefinitions.map(({ slug }) => slug)).toEqual([
      "restaurante",
      "bar",
      "hotel",
      "estanco",
      "farmacia",
      "tienda-de-ropa",
      "gimnasio",
      "discoteca",
      "supermercado",
      "inmobiliaria",
    ]);
    expect(activitySelection.status).toBe("selected-with-google-trends");
  });

  it("resolves every level and canonicalizes a stale municipality name", () => {
    expect(resolveSeoRoute(["municipios"])?.kind).toBe("territory-index");
    expect(resolveSeoRoute(["municipios", "comunidad-de-madrid"])?.kind).toBe(
      "community",
    );
    expect(
      resolveSeoRoute([
        "abrir-negocio",
        "bar",
        "comunidad-de-madrid",
        "madrid",
        "madrid-28079",
      ])?.kind,
    ).toBe("activity-municipality");
    expect(
      resolveSeoRoute([
        "abrir-negocio",
        "bar",
        "comunidad-de-madrid",
        "madrid",
        "nombre-antiguo-28079",
      ])?.canonicalPath,
    ).toBe("/abrir-negocio/bar/comunidad-de-madrid/madrid/madrid-28079");
  });

  it("rejects unknown codes and incoherent territory hierarchies", () => {
    expect(
      resolveSeoRoute(["municipios", "andalucia", "almeria", "madrid-28079"]),
    ).toBeNull();
    expect(
      resolveSeoRoute([
        "municipios",
        "comunidad-de-madrid",
        "madrid",
        "desconocido-99999",
      ]),
    ).toBeNull();
    expect(
      resolveSeoRoute(["abrir-negocio", "actividad-inexistente"]),
    ).toBeNull();
  });

  it("builds unique canonical metadata with real review dates", () => {
    const route = resolveSeoRoute([
      "abrir-negocio",
      "bar",
      "comunidad-de-madrid",
      "madrid",
      "madrid-28079",
    ]);
    expect(route).not.toBeNull();
    const metadata = metadataForSeoRoute(route!);
    expect(metadata.alternates?.canonical).toBe(route?.canonicalPath);
    expect(metadata.title).toContain("Madrid");
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
    expect(seoIndexabilityForRoute(route!)).toEqual({
      seoIndexable: false,
      seoIndexabilityReason: "insufficient-local-evidence",
    });
    expect(route?.activity?.lastReviewedAt).toBe("2026-08-31");
  });

  it("indexes useful hubs independently from local guide evidence", () => {
    const activity = resolveSeoRoute(["abrir-negocio", "bar"]);
    const territory = resolveSeoRoute([
      "municipios",
      "comunidad-de-madrid",
      "madrid",
    ]);
    expect(seoIndexabilityForRoute(activity!)).toEqual({
      seoIndexable: true,
      seoIndexabilityReason: "useful-activity-hub",
    });
    expect(seoIndexabilityForRoute(territory!)).toEqual({
      seoIndexable: true,
      seoIndexabilityReason: "useful-territorial-hub",
    });
  });

  it("keeps the build-time route count below the agreed ceiling", () => {
    expect(upperLevelStaticParams().length).toBeLessThan(80_000);
    expect(upperLevelStaticParams().length).toBe(793);
  });
});

describe("final activity pages", () => {
  it("render an answer, CTA, preliminary notice and visible sources", () => {
    const route = resolveSeoRoute([
      "abrir-negocio",
      "bar",
      "comunidad-de-madrid",
      "madrid",
      "madrid-28079",
    ]);
    expect(route).not.toBeNull();
    const html = renderToStaticMarkup(<SeoDirectoryPage route={route!} />);
    expect(html).toContain("Abrir un bar suele requerir");
    expect(html).toContain("Avísame cuando esté disponible");
    expect(html).toContain("Información preliminar");
    expect(html).toContain("Fuentes oficiales consultadas");
    expect(html).toContain("Ayuntamiento de Madrid");
  });
});

describe("sitemap and robots coverage", () => {
  it("keeps the root sitemap unique and covers every territorial page", () => {
    const urls = territorialHubSitemapEntries().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toContain("https://locapto.com/municipios");
    expect(urls).toContain(
      "https://locapto.com/municipios/comunidad-de-madrid/madrid/madrid-28079",
    );
    expect(urls.some((url) => url.includes("/abrir-negocio/bar/"))).toBe(false);
    expect(urls.length).toBeGreaterThan(municipalityCount);
  });

  it("creates one complete sitemap below 50,000 URLs per activity", () => {
    const expectedCount = 52 + 19 + 1;
    for (const activity of activitySeoDefinitions) {
      const entries = activitySitemapEntries(activity.slug);
      expect(entries).not.toBeNull();
      expect(entries).toHaveLength(expectedCount);
      expect(entries!.length).toBeLessThan(50_000);
      expect(new Set(entries!.map((entry) => entry.url)).size).toBe(
        entries!.length,
      );
      expect(entries!.some((entry) => /\d{5}$/.test(entry.url))).toBe(false);
    }
    expect(activityHubSitemapEntries().length).toBe(
      expectedCount * activitySeoDefinitions.length + 1,
    );
  });

  it("publishes one sitemap index and explicitly allows OAI-SearchBot", () => {
    const configuration = robots();
    expect(configuration.sitemap).toBe("https://locapto.com/sitemap.xml");
    expect(configuration.rules).toContainEqual({
      userAgent: "OAI-SearchBot",
      allow: "/",
    });
    const index = sitemapIndexXml();
    expect(index).toContain("<sitemapindex");
    expect(index).toContain("/sitemaps/territorial-hubs.xml");
    expect(index).not.toContain("business-guides-1.xml");
    expect(urlsetXml(activityHubSitemapEntries())).not.toContain(
      "<changefreq>",
    );
  });
});
