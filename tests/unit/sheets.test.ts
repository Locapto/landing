import { describe, expect, it } from "vitest";
import { betaLeadSchema } from "@/lib/leads/schema";
import { buildSheetsPayload } from "@/lib/leads/sheets";
describe("Apps Script payload", () => {
  it("maps a complete request to sheet columns", () => {
    const parsed = betaLeadSchema.parse({
      action: "upsert",
      stage: "complete",
      leadId: "123e4567-e89b-42d3-a456-426614174000",
      persona: "gestoria",
      selectedPlan: "professional",
      priceSeen: 149,
      pricingExperiment: true,
      website: "",
      utmSource: "linkedin",
      utmMedium: "paid",
      utmCampaign: "linkedin_gestorias",
      utmContent: "",
      utmTerm: "",
      landingVariant: "lp_gestorias",
      pagePath: "/lp/gestorias",
      referrer: "",
      name: "Ana",
      company: "Acme",
      monthlyCases: "3-5",
      locations: "Madrid",
      interests: ["activities", "cases"],
    });
    const payload = buildSheetsPayload(parsed, {
      leadId: parsed.leadId!,
      score: 65,
      qualified: true,
    });
    expect(payload).toMatchObject({
      status: "complete",
      persona: "Gestoría / asesoría",
      monthly_cases: "3–5",
      selected_plan: "professional",
      price_seen: 149,
      lead_score: 65,
      qualified: true,
      utm_source: "linkedin",
    });
    expect("interests" in payload ? payload.interests : "").toContain(
      "Precalificar actividades",
    );
  });
});
