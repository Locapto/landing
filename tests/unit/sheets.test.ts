import { describe, expect, it } from "vitest";
import { betaLeadSchema } from "@/lib/leads/schema";
import { buildSheetsPayload } from "@/lib/leads/sheets";
describe("Apps Script payload", () => {
  it("maps a complete request to sheet columns", () => {
    const parsed = betaLeadSchema.parse({
      action: "upsert",
      leadType: "launch_interest",
      leadSource: "landing",
      stage: "complete",
      leadId: "123e4567-e89b-42d3-a456-426614174000",
      persona: "gestoria",
      selectedPlan: "professional",
      priceSeen: 149,
      pricingExperiment: true,
      website: "",
      activity: "Cafetería",
      municipality: "Valencia",
      utmSource: "linkedin",
      utmMedium: "paid",
      utmCampaign: "linkedin_gestorias",
      utmContent: "anuncio-a",
      utmTerm: "licencia apertura",
      gclid: "google-click-id",
      gbraid: "google-braid-id",
      wbraid: "google-wbraid-id",
      msclkid: "microsoft-click-id",
      liFatId: "linkedin-click-id",
      landingVariant: "lp_gestorias",
      landingPage: "/lp/gestorias",
      referrer: "",
      name: "Ana",
      company: "Acme",
      companyWebsite: "https://acme.example",
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
      lead_type: "launch_interest",
      lead_source: "landing",
      activity: "Cafetería",
      municipality: "Valencia",
      company_website: "https://acme.example",
      utm_source: "linkedin",
      utm_content: "anuncio-a",
      utm_term: "licencia apertura",
      gclid: "google-click-id",
      gbraid: "google-braid-id",
      wbraid: "google-wbraid-id",
      msclkid: "microsoft-click-id",
      li_fat_id: "linkedin-click-id",
      landing_page: "/lp/gestorias",
    });
    expect("interests" in payload ? payload.interests : "").toContain(
      "Revisar los requisitos de una actividad",
    );
  });
  it("stores and sanitizes a custom professional profile", () => {
    const parsed = betaLeadSchema.parse({
      action: "upsert",
      leadType: "launch_interest",
      leadSource: "landing",
      stage: "partial",
      email: "otro@example.com",
      persona: "otro",
      otherPersona: "=Consultoría especializada",
      selectedPlan: null,
      priceSeen: null,
      pricingExperiment: false,
      website: "",
      utmSource: "direct",
      utmMedium: "",
      utmCampaign: "",
      utmContent: "",
      utmTerm: "",
      landingVariant: "home",
      landingPage: "/",
      referrer: "",
    });
    const payload = buildSheetsPayload(parsed, {
      leadId: "123e4567-e89b-42d3-a456-426614174000",
      score: 0,
      qualified: false,
    });
    expect(payload).toMatchObject({
      persona: "Otro",
      persona_other: "'=Consultoría especializada",
    });
  });
});
