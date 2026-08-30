import type { MetadataRoute } from "next";
import { publicPages } from "@/content/pages";
import { programmaticSeoPages } from "@/content/programmatic";
import { marketingConfig } from "@/config/marketing";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...publicPages.filter((page) => page.indexable).map((page) => page.path),
    ...programmaticSeoPages
      .filter((page) => page.indexable)
      .map((page) => `/${page.slug}`),
  ];
  return paths.map((path) => ({
    url: new URL(path, marketingConfig.siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/recursos/") ? 0.7 : 0.8,
  }));
}
