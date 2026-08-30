import type { LandingVariant } from "@/config/marketing";

const STORAGE_KEY = "locapto_first_touch_v1";

export type Attribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  landingVariant: LandingVariant;
  pagePath: string;
  referrer: string;
};

function fallbackSource(referrer: string) {
  if (!referrer) return { source: "direct", medium: "none" };
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (/google\.|bing\.|duckduckgo\.|yahoo\./.test(host))
      return { source: "organic", medium: "organic" };
    if (host.includes("linkedin.com"))
      return { source: "linkedin", medium: "referral" };
    if (host === window.location.hostname)
      return { source: "direct", medium: "internal" };
    return { source: host, medium: "referral" };
  } catch {
    return { source: "direct", medium: "none" };
  }
}

export function getFirstTouchAttribution(
  landingVariant: LandingVariant,
): Attribution {
  if (typeof window === "undefined") {
    return {
      utmSource: "direct",
      utmMedium: "none",
      utmCampaign: "",
      utmContent: "",
      utmTerm: "",
      landingVariant,
      pagePath: "/",
      referrer: "",
    };
  }
  const existing = window.sessionStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as Attribution;
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }
  const query = new URLSearchParams(window.location.search);
  const referrer = document.referrer;
  const fallback = fallbackSource(referrer);
  const attribution: Attribution = {
    utmSource: query.get("utm_source")?.slice(0, 100) || fallback.source,
    utmMedium: query.get("utm_medium")?.slice(0, 100) || fallback.medium,
    utmCampaign: query.get("utm_campaign")?.slice(0, 160) || "",
    utmContent: query.get("utm_content")?.slice(0, 160) || "",
    utmTerm: query.get("utm_term")?.slice(0, 160) || "",
    landingVariant,
    pagePath: window.location.pathname.slice(0, 300),
    referrer: referrer.slice(0, 500),
  };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
}
