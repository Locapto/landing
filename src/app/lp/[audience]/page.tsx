import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { BetaLeadForm } from "@/components/BetaLeadForm";
import { PricingExperiment } from "@/components/PricingExperiment";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackedBetaLink } from "@/components/TrackedBetaLink";
import { TrackedProductPreview } from "@/components/TrackedProductPreview";
import { marketingConfig, type LandingVariant } from "@/config/marketing";

const campaigns = {
  gestorias: {
    variant: "lp_gestorias" as LandingVariant,
    title:
      "Reduce el tiempo que dedicas a investigar cada expediente de apertura.",
    intro:
      "Locapto organiza requisitos, procedimiento probable, información pendiente y fuentes oficiales por actividad y municipio.",
    benefits: [
      "Estructura la investigación inicial",
      "Detecta información pendiente",
      "Localiza evidencia oficial",
    ],
  },
  tecnicos: {
    variant: "lp_tecnicos" as LandingVariant,
    title: "Precalifica un local antes de dedicar horas al estudio completo.",
    intro:
      "Identifica procedimiento probable, condicionantes y preguntas pendientes antes de entrar en el análisis técnico completo.",
    benefits: [
      "Prioriza comprobaciones",
      "Ordena condicionantes del local",
      "Explica riesgos al cliente",
    ],
  },
  empresas: {
    variant: "lp_empresas" as LandingVariant,
    title:
      "Detecta riesgos de un local antes de alquilar, reformar o comprometer capital.",
    intro:
      "Compara ubicaciones con criterios consistentes y descubre qué necesita validación antes de avanzar.",
    benefits: [
      "Compara ubicaciones",
      "Detecta bloqueos habituales",
      "Decide con mejores preguntas",
    ],
  },
} as const;

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(campaigns).map((audience) => ({ audience }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ audience: string }>;
}): Promise<Metadata> {
  const { audience } = await params;
  const campaign = campaigns[audience as keyof typeof campaigns];
  if (!campaign) return {};
  return {
    title: `${campaign.title} | Locapto`,
    description: campaign.intro,
    robots: { index: false, follow: false },
    alternates: { canonical: `/lp/${audience}` },
    openGraph: {
      title: campaign.title,
      description: campaign.intro,
      url: `/lp/${audience}`,
      locale: "es_ES",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: campaign.title,
      description: campaign.intro,
    },
  };
}
export default async function CampaignPage({
  params,
}: {
  params: Promise<{ audience: string }>;
}) {
  const { audience } = await params;
  const campaign = campaigns[audience as keyof typeof campaigns];
  if (!campaign) notFound();
  return (
    <>
      <SiteHeader reduced />
      <main id="contenido">
        <section className="campaign-hero">
          <div className="shell hero-grid">
            <div>
              <p className="eyebrow">BETA PRIVADA · Acceso anticipado</p>
              <h1>{campaign.title}</h1>
              <p className="hero-lead">{campaign.intro}</p>
              <ul className="campaign-benefits">
                {campaign.benefits.map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <TrackedBetaLink variant={campaign.variant} href="#acceso-beta">
                Solicitar acceso beta <ArrowRight aria-hidden="true" />
              </TrackedBetaLink>
              <p className="hero-note">
                Locapto ofrece orientación preliminar y no concede licencias.
              </p>
            </div>
            <TrackedProductPreview variant={campaign.variant} compact />
          </div>
        </section>
        {audience === "gestorias" &&
          marketingConfig.professionalPricingExperimentEnabled && (
            <section className="section">
              <div className="shell pricing-wrap">
                <PricingExperiment />
              </div>
            </section>
          )}
        <section className="beta-section" id="acceso-beta">
          <div className="shell beta-grid">
            <div>
              <p className="eyebrow">Acceso anticipado</p>
              <h2>Cuéntanos cómo trabajas.</h2>
              <p>
                La primera parte tarda menos de un minuto y queda guardada antes
                de pedir información opcional.
              </p>
            </div>
            <BetaLeadForm landingVariant={campaign.variant} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
