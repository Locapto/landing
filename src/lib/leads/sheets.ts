import type { BetaLeadInput } from "./schema";
import { sanitizeForSheet } from "./sanitize";
import { interestLabel, MONTHLY_CASE_LABELS, personaLabel } from "./types";

type PayloadOptions = { leadId: string; score: number; qualified: boolean };

export function buildSheetsPayload(
  input: BetaLeadInput,
  options: PayloadOptions,
) {
  const now = new Date().toISOString();
  const base = {
    action: "upsert",
    lead_id: options.leadId,
    updated_at: now,
    status: input.stage,
    persona: sanitizeForSheet(personaLabel(input.persona), 80),
    selected_plan: input.selectedPlan ?? "",
    price_seen: input.priceSeen ?? "",
    pricing_experiment: input.pricingExperiment,
    lead_score: options.score,
    qualified: options.qualified,
    utm_source: sanitizeForSheet(input.utmSource, 100),
    utm_medium: sanitizeForSheet(input.utmMedium, 100),
    utm_campaign: sanitizeForSheet(input.utmCampaign, 160),
    utm_content: sanitizeForSheet(input.utmContent, 160),
    utm_term: sanitizeForSheet(input.utmTerm, 160),
    landing_variant: sanitizeForSheet(input.landingVariant, 80),
    page_path: sanitizeForSheet(input.pagePath, 300),
    referrer: sanitizeForSheet(input.referrer, 500),
  };
  if (input.stage === "partial")
    return {
      ...base,
      created_at: now,
      email: sanitizeForSheet(input.email.toLowerCase(), 254),
    };
  return {
    ...base,
    name: sanitizeForSheet(input.name, 120),
    company: sanitizeForSheet(input.company, 160),
    monthly_cases: input.monthlyCases
      ? MONTHLY_CASE_LABELS[input.monthlyCases]
      : "",
    locations: sanitizeForSheet(input.locations, 300),
    interests: input.interests
      .map(interestLabel)
      .map((value) => sanitizeForSheet(value, 100))
      .join(" | "),
  };
}
