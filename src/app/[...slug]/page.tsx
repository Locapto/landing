import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { SeoDirectoryPage } from "@/components/seo/SeoDirectoryPage";
import { pageByPath, publicPages } from "@/content/pages";
import { metadataForSeoRoute } from "@/content/seo/presentation";
import { resolveSeoRoute, upperLevelStaticParams } from "@/content/seo/routes";

export const dynamic = "force-static";
export const dynamicParams = true;
export function generateStaticParams() {
  return [
    ...publicPages.map((page) => ({ slug: page.path.slice(1).split("/") })),
    ...upperLevelStaticParams(),
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const page = pageByPath.get(path);
  if (!page) {
    const seoRoute = resolveSeoRoute(slug);
    return seoRoute ? metadataForSeoRoute(seoRoute) : {};
  }
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      type: page.kind === "article" ? "article" : "website",
      locale: "es_ES",
      url: path,
      title: page.title,
      description: page.description,
      siteName: "Locapto",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const page = pageByPath.get(path);
  if (page) return <ContentPage page={page} />;
  const seoRoute = resolveSeoRoute(slug);
  if (!seoRoute) notFound();
  if (path !== seoRoute.canonicalPath)
    permanentRedirect(seoRoute.canonicalPath);
  return <SeoDirectoryPage route={seoRoute} />;
}
