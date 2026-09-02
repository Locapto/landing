// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/beta/route";

const partial = {
  action: "upsert",
  leadType: "launch_interest",
  leadSource: "landing",
  stage: "partial",
  email: "qa@example.com",
  persona: "gestoria",
  selectedPlan: null,
  priceSeen: null,
  pricingExperiment: false,
  website: "",
  utmSource: "google",
  utmMedium: "cpc",
  utmCampaign: "test",
  utmContent: "",
  utmTerm: "",
  landingVariant: "home",
  landingPage: "/",
  referrer: "",
};
function request(body: unknown) {
  return new Request("https://locapto.com/api/beta", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://locapto.com",
      host: "locapto.com",
    },
    body: JSON.stringify(body),
  });
}
describe("POST /api/beta", () => {
  beforeEach(() => {
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.test/exec";
    process.env.GOOGLE_SHEETS_WEBHOOK_SECRET = "secret";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    delete process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  });
  it("saves a partial lead and returns its server UUID", async () => {
    const response = await POST(request(partial));
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.status).toBe("partial");
    expect(data.leadId).toMatch(/^[0-9a-f-]{36}$/);
    expect(fetch).toHaveBeenCalledOnce();
  });
  it("updates a complete lead and qualifies it", async () => {
    const response = await POST(
      request({
        ...partial,
        stage: "complete",
        email: undefined,
        leadId: "123e4567-e89b-42d3-a456-426614174000",
        name: "QA",
        company: "Locapto",
        monthlyCases: "3-5",
        locations: "Madrid",
        interests: ["activities"],
      }),
    );
    const data = await response.json();
    expect(data).toMatchObject({
      ok: true,
      status: "complete",
      qualified: true,
    });
  });
  it("silently ignores honeypot submissions", async () => {
    const response = await POST(request({ ...partial, website: "spam" }));
    expect(response.status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("accepts the legacy pagePath field from an already-open tab", async () => {
    const legacy = { ...partial, landingPage: undefined };
    const response = await POST(
      request({ ...legacy, pagePath: "/para-gestorias" }),
    );
    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledOnce();
    expect(
      JSON.parse(String(vi.mocked(fetch).mock.calls[0]?.[1]?.body)),
    ).toEqual(expect.objectContaining({ landing_page: "/para-gestorias" }));
  });
  it("uses the homepage when an older client sends no landing path", async () => {
    const legacy = { ...partial, landingPage: undefined };
    const response = await POST(request(legacy));
    expect(response.status).toBe(200);
    expect(
      JSON.parse(String(vi.mocked(fetch).mock.calls[0]?.[1]?.body)),
    ).toEqual(expect.objectContaining({ landing_page: "/" }));
  });
  it("rejects cross-origin requests", async () => {
    const bad = new Request("https://locapto.com/api/beta", {
      method: "POST",
      headers: { origin: "https://evil.test", host: "locapto.com" },
      body: JSON.stringify(partial),
    });
    expect((await POST(bad)).status).toBe(403);
  });
});
