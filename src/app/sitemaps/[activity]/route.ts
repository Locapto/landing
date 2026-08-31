import { NextResponse } from "next/server";
import { marketingConfig } from "@/config/marketing";
import {
  activityBySlug,
  activitySeoDefinitions,
} from "@/content/seo/activities";
import { geographyCatalog } from "@/content/seo/geography";
import { activityPath } from "@/content/seo/routes";

export const dynamic = "force-static";

export function generateStaticParams() {
  return activitySeoDefinitions.map((activity) => ({
    activity: activity.slug,
  }));
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function activitySitemapEntries(activitySlug: string) {
  const activity = activityBySlug.get(activitySlug);
  if (!activity) return null;
  const paths = [activityPath(activity)];
  for (const community of geographyCatalog.communities) {
    paths.push(activityPath(activity, community));
    for (const province of community.provinces) {
      paths.push(activityPath(activity, community, province));
      if (marketingConfig.municipalityActivityIndexingEnabled)
        for (const municipality of province.municipalities)
          paths.push(activityPath(activity, community, province, municipality));
    }
  }
  return paths.map((path) => ({
    url: new URL(path, marketingConfig.siteUrl).toString(),
    lastModified: activity.lastReviewedAt,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ activity: string }> },
) {
  const { activity } = await params;
  const entries = activitySitemapEntries(activity);
  if (!entries) return new NextResponse("Not found", { status: 404 });
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (entry) =>
        `<url><loc>${escapeXml(entry.url)}</loc><lastmod>${entry.lastModified}</lastmod></url>`,
    ),
    "</urlset>",
  ].join("");
  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
