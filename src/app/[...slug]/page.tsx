import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { pageByPath, publicPages } from "@/content/pages";

export const dynamicParams = false;
export function generateStaticParams() {
  return publicPages.map((page) => ({ slug: page.path.slice(1).split("/") }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const page = pageByPath.get(path);
  if (!page) return {};
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
  const page = pageByPath.get(`/${slug.join("/")}`);
  if (!page) notFound();
  return <ContentPage page={page} />;
}
