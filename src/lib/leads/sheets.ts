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
    lead_type: input.leadType,
    lead_source: input.leadSource,
    persona: sanitizeForSheet(personaLabel(input.persona), 80),
    persona_other:
      input.persona === "otro" ? sanitizeForSheet(input.otherPersona, 120) : "",
    activity: sanitizeForSheet(input.activity, 160),
    municipality: sanitizeForSheet(input.municipality, 160),
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
    gclid: sanitizeForSheet(input.gclid, 200),
    gbraid: sanitizeForSheet(input.gbraid, 200),
    wbraid: sanitizeForSheet(input.wbraid, 200),
    msclkid: sanitizeForSheet(input.msclkid, 200),
    li_fat_id: sanitizeForSheet(input.liFatId, 200),
    landing_variant: sanitizeForSheet(input.landingVariant, 80),
    page_path: sanitizeForSheet(input.landingPage, 300),
    landing_page: sanitizeForSheet(input.landingPage, 300),
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
    company_website: sanitizeForSheet(input.companyWebsite, 200),
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
