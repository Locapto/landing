import { describe, expect, it } from "vitest";
import { betaLeadSchema } from "@/lib/leads/schema";

const base = {
  action: "upsert",
  leadType: "launch_interest",
  leadSource: "landing",
  stage: "partial",
  email: "persona@empresa.es",
  persona: "gestoria",
  selectedPlan: null,
  priceSeen: null,
  pricingExperiment: false,
  website: "",
  utmSource: "google",
  utmMedium: "cpc",
  utmCampaign: "campaign",
  utmContent: "",
  utmTerm: "",
  landingVariant: "home",
  landingPage: "/",
  referrer: "",
};
describe("beta payload validation", () => {
  it("accepts a valid partial payload", () =>
    expect(betaLeadSchema.safeParse(base).success).toBe(true));
  it("rejects invalid email", () =>
    expect(
      betaLeadSchema.safeParse({ ...base, email: "not-an-email" }).success,
    ).toBe(false));
  it("rejects invalid persona", () =>
    expect(
      betaLeadSchema.safeParse({ ...base, persona: "unknown" }).success,
    ).toBe(false));
  it("requires a description when the professional profile is other", () => {
    expect(betaLeadSchema.safeParse({ ...base, persona: "otro" }).success).toBe(
      false,
    );
    expect(
      betaLeadSchema.safeParse({
        ...base,
        persona: "otro",
        otherPersona: "Administración de fincas",
      }).success,
    ).toBe(true);
  });
  it("requires a lead ID for completion", () =>
    expect(
      betaLeadSchema.safeParse({
        ...base,
        stage: "complete",
        email: undefined,
        name: "",
        company: "",
        locations: "",
        interests: [],
      }).success,
    ).toBe(false));
});
