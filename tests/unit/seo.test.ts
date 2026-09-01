import { describe, expect, it } from "vitest";
import { publicPages } from "@/content/pages";
import {
  activityHubSitemapEntries,
  localGuideSitemapEntries,
  resourceSitemapEntries,
  sitemapIndexXml,
  staticSitemapEntries,
  territorialHubSitemapEntries,
  urlsetXml,
} from "@/lib/seo/sitemaps";

const sitemapEntries = () => [
  ...staticSitemapEntries(),
  ...resourceSitemapEntries(),
];
describe("SEO route configuration", () => {
  it("has unique indexable paths, titles and descriptions", () => {
    expect(new Set(publicPages.map((p) => p.path)).size).toBe(
      publicPages.length,
    );
    expect(new Set(publicPages.map((p) => p.title)).size).toBe(
      publicPages.length,
    );
    expect(new Set(publicPages.map((p) => p.description)).size).toBe(
      publicPages.length,
    );
  });
  it("includes every public page in sitemap", () => {
    const urls = sitemapEntries().map((item) => item.url);
    for (const page of publicPages)
      expect(urls).toContain(`https://locapto.com${page.path}`);
  });
  it("excludes noindex routes", () => {
    const urls = sitemapEntries().map((item) => item.url);
    for (const route of [
      "/lp/gestorias",
      "/lp/tecnicos",
      "/lp/empresas",
      "/gracias",
      "/cobertura",
    ])
      expect(urls).not.toContain(`https://locapto.com${route}`);
  });

  it("emits valid, canonical HTTPS sitemap documents within protocol limits", () => {
    const groups = [
      staticSitemapEntries(),
      resourceSitemapEntries(),
      activityHubSitemapEntries(),
      territorialHubSitemapEntries(),
      localGuideSitemapEntries(),
    ];
    const allUrls = groups.flatMap((entries) => entries.map(({ url }) => url));
    expect(new Set(allUrls).size).toBe(allUrls.length);
    expect(allUrls.every((url) => url.startsWith("https://"))).toBe(true);

    for (const entries of groups) {
      expect(entries.length).toBeLessThanOrEqual(50_000);
      for (const entry of entries) {
        expect(entry.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
      const document = new DOMParser().parseFromString(
        urlsetXml(entries),
        "application/xml",
      );
      expect(document.querySelector("parsererror")).toBeNull();
      expect(document.querySelectorAll("changefreq, priority")).toHaveLength(0);
    }

    const index = new DOMParser().parseFromString(
      sitemapIndexXml(),
      "application/xml",
    );
    expect(index.querySelector("parsererror")).toBeNull();
    for (const location of index.querySelectorAll("loc"))
      expect(location.textContent).toMatch(/^https:\/\//);
  });
});
