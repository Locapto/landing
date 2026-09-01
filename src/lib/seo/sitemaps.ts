import { publicPages } from "@/content/pages";
import { activitySeoDefinitions } from "@/content/seo/activities";
import { geographyCatalog } from "@/content/seo/geography";
import {
  reviewedLocalSeoContent,
  seoIndexabilityForRoute,
} from "@/content/seo/indexability";
import {
  activityPath,
  resolveSeoRoute,
  territoryPath,
} from "@/content/seo/routes";
import { marketingConfig } from "@/config/marketing";

export type SitemapEntry = { url: string; lastModified?: string };
const CONTENT_LAST_MODIFIED = "2026-09-01";

const absolute = (path: string) =>
  new URL(path, marketingConfig.siteUrl).toString();

export function staticSitemapEntries(): SitemapEntry[] {
  return [
    { url: absolute("/"), lastModified: CONTENT_LAST_MODIFIED },
    ...publicPages
      .filter((page) => !["article", "resource-index"].includes(page.kind))
      .map((page) => ({
        url: absolute(page.path),
        lastModified: CONTENT_LAST_MODIFIED,
      })),
  ];
}

export function resourceSitemapEntries(): SitemapEntry[] {
  return publicPages
    .filter((page) => ["article", "resource-index"].includes(page.kind))
    .map((page) => ({
      url: absolute(page.path),
      lastModified: CONTENT_LAST_MODIFIED,
    }));
}

export function territorialHubSitemapEntries(): SitemapEntry[] {
  const paths = [territoryPath()];
  for (const community of geographyCatalog.communities) {
    paths.push(territoryPath(community));
    for (const province of community.provinces) {
      paths.push(territoryPath(community, province));
      for (const municipality of province.municipalities)
        paths.push(territoryPath(community, province, municipality));
    }
  }
  return paths.map((path) => ({
    url: absolute(path),
    lastModified: geographyCatalog.publishedAt,
  }));
}

export function activityHubSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    {
      url: absolute(activityPath()),
      lastModified: CONTENT_LAST_MODIFIED,
    },
  ];
  for (const activity of activitySeoDefinitions) {
    const paths = [activityPath(activity)];
    for (const community of geographyCatalog.communities) {
      paths.push(activityPath(activity, community));
      for (const province of community.provinces)
        paths.push(activityPath(activity, community, province));
    }
    entries.push(
      ...paths.map((path) => ({
        url: absolute(path),
        lastModified: activity.lastReviewedAt,
      })),
    );
  }
  return entries;
}

export function localGuideSitemapEntries(): SitemapEntry[] {
  return [...reviewedLocalSeoContent.values()]
    .filter((local) => {
      const route = resolveSeoRoute(local.canonicalPath.slice(1).split("/"));
      return route && seoIndexabilityForRoute(route).seoIndexable;
    })
    .map((local) => ({
      url: absolute(local.canonicalPath),
      lastModified: local.reviewedAt,
    }));
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function urlsetXml(entries: SitemapEntry[]) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      ({ url, lastModified }) =>
        `<url><loc>${escapeXml(url)}</loc>${lastModified ? `<lastmod>${escapeXml(lastModified)}</lastmod>` : ""}</url>`,
    ),
    "</urlset>",
  ].join("");
}

export function sitemapIndexXml() {
  const paths = [
    "/sitemaps/static.xml",
    "/sitemaps/resources.xml",
    "/sitemaps/activities.xml",
    "/sitemaps/territorial-hubs.xml",
  ];
  if (localGuideSitemapEntries().length)
    paths.push("/sitemaps/business-guides-1.xml");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map(
      (path) => `<sitemap><loc>${escapeXml(absolute(path))}</loc></sitemap>`,
    ),
    "</sitemapindex>",
  ].join("");
}

export const xmlResponse = (body: string) =>
  new Response(body, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
