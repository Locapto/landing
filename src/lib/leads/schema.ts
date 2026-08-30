import { z } from "zod";
import { MONTHLY_CASES } from "./types";

const personaValues = [
  "gestoria",
  "tecnico",
  "consultoria",
  "empresa",
  "proptech",
  "emprendedor",
  "otro",
] as const;
const interestValues = [
  "activities",
  "premises",
  "cases",
  "clients",
  "locations",
  "integration",
  "other",
] as const;

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().default("");
const attribution = {
  utmSource: optionalText(100),
  utmMedium: optionalText(100),
  utmCampaign: optionalText(160),
  utmContent: optionalText(160),
  utmTerm: optionalText(160),
  landingVariant: z.string().trim().min(1).max(80),
  pagePath: z.string().trim().min(1).max(300),
  referrer: optionalText(500),
};
const common = {
  action: z.literal("upsert"),
  leadId: z.uuid().optional(),
  persona: z.enum(personaValues),
  selectedPlan: z.enum(["professional"]).nullable().optional(),
  priceSeen: z.number().int().min(0).max(10000).nullable().optional(),
  pricingExperiment: z.boolean().default(false),
  website: optionalText(200),
  ...attribution,
};

export const betaLeadSchema = z.discriminatedUnion("stage", [
  z
    .object({
      ...common,
      stage: z.literal("partial"),
      email: z.email().max(254),
    })
    .strict(),
  z
    .object({
      ...common,
      stage: z.literal("complete"),
      leadId: z.uuid(),
      name: optionalText(120),
      company: optionalText(160),
      monthlyCases: z.enum(MONTHLY_CASES).optional(),
      locations: optionalText(300),
      interests: z.array(z.enum(interestValues)).max(7).default([]),
    })
    .strict(),
]);

export type BetaLeadInput = z.infer<typeof betaLeadSchema>;
