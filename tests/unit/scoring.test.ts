import { describe, expect, it } from "vitest";
import { isQualifiedLead, scoreLead } from "@/lib/leads/scoring";

describe("lead scoring", () => {
  it("applies persona, volume and professional-plan points", () =>
    expect(scoreLead("gestoria", "6-10", "professional")).toBe(75));
  it("does not qualify partial leads", () =>
    expect(isQualifiedLead("partial", "gestoria", "25+")).toBe(false));
  it("qualifies professional leads from three cases", () =>
    expect(isQualifiedLead("complete", "tecnico", "3-5")).toBe(true));
  it("does not qualify non-professional or low-volume leads", () => {
    expect(isQualifiedLead("complete", "empresa", "25+")).toBe(false);
    expect(isQualifiedLead("complete", "consultoria", "1-2")).toBe(false);
  });
});
