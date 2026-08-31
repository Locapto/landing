import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { publicPages } from "@/content/pages";
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
    const urls = sitemap().map((item) => item.url);
    for (const page of publicPages)
      expect(urls).toContain(`https://locapto.com${page.path}`);
  });
  it("excludes noindex routes", () => {
    const urls = sitemap().map((item) => item.url);
    for (const route of [
      "/lp/gestorias",
      "/lp/tecnicos",
      "/lp/empresas",
      "/gracias",
      "/cobertura",
    ])
      expect(urls).not.toContain(`https://locapto.com${route}`);
  });
});
