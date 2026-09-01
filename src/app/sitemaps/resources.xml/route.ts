import {
  resourceSitemapEntries,
  urlsetXml,
  xmlResponse,
} from "@/lib/seo/sitemaps";

export const dynamic = "force-static";
export function GET() {
  return xmlResponse(urlsetXml(resourceSitemapEntries()));
}
