import { describe, expect, it } from "vitest";
import { getFirstTouchAttribution } from "@/lib/analytics/attribution";
describe("first-touch attribution", () => {
  it("captures UTMs and does not overwrite them", () => {
    window.history.replaceState(
      {},
      "",
      "/?utm_source=google&utm_medium=cpc&utm_campaign=first&gclid=google-click&msclkid=bing-click",
    );
    const first = getFirstTouchAttribution("home");
    window.history.replaceState(
      {},
      "",
      "/?utm_source=linkedin&utm_campaign=second",
    );
    const second = getFirstTouchAttribution("lp_empresas");
    expect(first.utmSource).toBe("google");
    expect(second.utmSource).toBe("google");
    expect(second.utmCampaign).toBe("first");
    expect(second.gclid).toBe("google-click");
    expect(second.msclkid).toBe("bing-click");
    expect(second.landingVariant).toBe("home");
  });
  it("classifies an empty referrer as direct", () =>
    expect(getFirstTouchAttribution("home").utmSource).toBe("direct"));

  it("migrates the legacy pagePath field without losing first-touch data", () => {
    sessionStorage.setItem(
      "locapto_first_touch_v1",
      JSON.stringify({
        utmSource: "linkedin",
        utmMedium: "referral",
        utmCampaign: "legacy-campaign",
        landingVariant: "home",
        pagePath: "/para-gestorias",
        referrer: "",
      }),
    );

    const attribution = getFirstTouchAttribution("lp_empresas");

    expect(attribution.landingPage).toBe("/para-gestorias");
    expect(attribution.utmCampaign).toBe("legacy-campaign");
    expect(attribution.gclid).toBe("");
    expect(
      JSON.parse(sessionStorage.getItem("locapto_first_touch_v1") ?? "{}"),
    ).not.toHaveProperty("pagePath");
  });
});
