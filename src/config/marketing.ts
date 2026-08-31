export const BETA_CTA_LABEL = "Avisadme cuando esté disponible";
export const AVAILABILITY_CHIP_LABEL =
  "PRÓXIMAMENTE · APÚNTATE PARA RECIBIR AVISO";

export const marketingConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://locapto.com",
  professionalPricingExperimentEnabled: false,
  professionalBetaPrice: 149,
  municipalityActivityIndexingEnabled:
    process.env.INDEX_MUNICIPALITY_ACTIVITIES !== "false",
} as const;

export type LandingVariant =
  | "home"
  | "seo_gestorias"
  | "seo_tecnicos"
  | "seo_empresas"
  | "lp_gestorias"
  | "lp_tecnicos"
  | "lp_empresas"
  | "content";
