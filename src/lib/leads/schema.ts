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
  gclid: optionalText(200),
  gbraid: optionalText(200),
  wbraid: optionalText(200),
  msclkid: optionalText(200),
  liFatId: optionalText(200),
  landingVariant: z.string().trim().min(1).max(80),
  landingPage: z.string().trim().min(1).max(300).optional().default("/"),
  referrer: optionalText(500),
};
const common = {
  action: z.literal("upsert"),
  leadType: z.literal("launch_interest"),
  leadSource: z.literal("landing"),
  leadId: z.uuid().optional(),
  persona: z.enum(personaValues),
  otherPersona: optionalText(120),
  activity: optionalText(160),
  municipality: optionalText(160),
  selectedPlan: z.enum(["professional"]).nullable().optional(),
  priceSeen: z.number().int().min(0).max(10000).nullable().optional(),
  pricingExperiment: z.boolean().default(false),
  website: optionalText(200),
  ...attribution,
};

export const betaLeadSchema = z
  .discriminatedUnion("stage", [
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
        companyWebsite: optionalText(200),
        monthlyCases: z.enum(MONTHLY_CASES).optional(),
        locations: optionalText(300),
        interests: z.array(z.enum(interestValues)).max(7).default([]),
      })
      .strict(),
  ])
  .superRefine((input, context) => {
    if (input.persona === "otro" && !input.otherPersona) {
      context.addIssue({
        code: "custom",
        path: ["otherPersona"],
        message: "Describe tu perfil profesional.",
      });
    }
  });

export type BetaLeadInput = z.infer<typeof betaLeadSchema>;
