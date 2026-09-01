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
});
