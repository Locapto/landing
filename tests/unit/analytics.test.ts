import { beforeEach, describe, expect, it } from "vitest";
import { googleConsentState } from "@/components/ConsentManager";
import {
  sanitizeAnalyticsProperties,
  trackGenerateLeadOnce,
} from "@/lib/analytics/events";
describe("analytics privacy", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.dataLayer = [];
    window.gtag = (_command, event, properties) => {
      window.dataLayer?.push({
        event: String(event),
        ...((properties as Record<string, unknown>) ?? {}),
      });
    };
  });
  it("drops PII and unknown properties", () =>
    expect(
      sanitizeAnalyticsProperties({
        email: "person@example.com",
        name: "Ana",
        company: "Acme",
        persona: "gestoria",
        utm_source: "google",
        secret: "x",
      }),
    ).toEqual({ persona: "gestoria", utm_source: "google" }));

  it("maps Consent Mode v2 categories", () => {
    expect(
      googleConsentState({ analytics: true, marketing: false, decided: true }),
    ).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("emits generate_lead once per lead after analytics consent", () => {
    localStorage.setItem(
      "locapto_consent_v1",
      JSON.stringify({ analytics: true, marketing: false, decided: true }),
    );
    trackGenerateLeadOnce("lead-1", { lead_type: "launch_interest" });
    trackGenerateLeadOnce("lead-1", { lead_type: "launch_interest" });
    expect(
      window.dataLayer?.filter((item) => item.event === "generate_lead"),
    ).toHaveLength(1);
  });
});
