import type { MetadataRoute } from "next";
import { marketingConfig } from "@/config/marketing";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/confirmar-email", "/gracias", "/lp/"],
      },
      { userAgent: "OAI-SearchBot", allow: "/" },
    ],
    sitemap: `${marketingConfig.siteUrl}/sitemap.xml`,
    host: marketingConfig.siteUrl,
  };
}
