export const marketingConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://locapto.com",
  professionalPricingExperimentEnabled: false,
  professionalBetaPrice: 149,
  municipalities: ["Madrid", "Barcelona", "Mataró"],
  activities: [
    "Comercio minorista",
    "Peluquería y estética no sanitaria",
    "Cafetería y restauración",
  ],
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
