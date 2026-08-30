import { describe, expect, it } from "vitest";
import { sanitizeAnalyticsProperties } from "@/lib/analytics/events";
describe("analytics privacy", () => {
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
});
