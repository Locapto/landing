export const BETA_CTA_LABEL = "Avísame cuando esté disponible";
export const AVAILABILITY_CHIP_LABEL =
  "PRÓXIMAMENTE · APÚNTATE PARA RECIBIR AVISO";

export const marketingConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://locapto.com",
  professionalPricingExperimentEnabled: false,
  professionalBetaPrice: 149,
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
