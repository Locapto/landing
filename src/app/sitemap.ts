import type { MetadataRoute } from "next";
import { publicPages } from "@/content/pages";
import { marketingConfig } from "@/config/marketing";
import { geographyCatalog } from "@/content/seo/geography";
import { activityPath, territoryPath } from "@/content/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Array<{ path: string; lastModified: string }> = [
    { path: "/", lastModified: "2026-08-31" },
    ...publicPages
      .filter((page) => page.indexable)
      .map((page) => ({ path: page.path, lastModified: "2026-08-31" })),
    { path: territoryPath(), lastModified: geographyCatalog.publishedAt },
    { path: activityPath(), lastModified: "2026-08-31" },
  ];
  for (const community of geographyCatalog.communities) {
    entries.push({
      path: territoryPath(community),
      lastModified: geographyCatalog.publishedAt,
    });
    for (const province of community.provinces) {
      entries.push({
        path: territoryPath(community, province),
        lastModified: geographyCatalog.publishedAt,
      });
      for (const municipality of province.municipalities)
        entries.push({
          path: territoryPath(community, province, municipality),
          lastModified: geographyCatalog.publishedAt,
        });
    }
  }
  return entries.map(({ path, lastModified }) => ({
    url: new URL(path, marketingConfig.siteUrl).toString(),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/recursos/") ? 0.7 : 0.8,
  }));
}
