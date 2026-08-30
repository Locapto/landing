import type { MetadataRoute } from "next";
import { marketingConfig } from "@/config/marketing";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/gracias", "/lp/"],
    },
    sitemap: `${marketingConfig.siteUrl}/sitemap.xml`,
    host: marketingConfig.siteUrl,
  };
}
