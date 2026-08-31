import type { MetadataRoute } from "next";
import { activitySeoDefinitions } from "@/content/seo/activities";
import { marketingConfig } from "@/config/marketing";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/gracias", "/lp/"],
      },
      { userAgent: "OAI-SearchBot", allow: "/" },
    ],
    sitemap: [
      `${marketingConfig.siteUrl}/sitemap.xml`,
      ...activitySeoDefinitions.map(
        (activity) => `${marketingConfig.siteUrl}/sitemaps/${activity.slug}`,
      ),
    ],
    host: marketingConfig.siteUrl,
  };
}
