import type { LandingVariant } from "@/config/marketing";

const STORAGE_KEY = "locapto_first_touch_v1";

const clickIdNames = [
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "li_fat_id",
] as const;

export type Attribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  msclkid: string;
  liFatId: string;
  landingVariant: LandingVariant;
  landingPage: string;
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
      gclid: "",
      gbraid: "",
      wbraid: "",
      msclkid: "",
      liFatId: "",
      landingVariant,
      landingPage: "/",
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
    gclid: query.get(clickIdNames[0])?.slice(0, 200) || "",
    gbraid: query.get(clickIdNames[1])?.slice(0, 200) || "",
    wbraid: query.get(clickIdNames[2])?.slice(0, 200) || "",
    msclkid: query.get(clickIdNames[3])?.slice(0, 200) || "",
    liFatId: query.get(clickIdNames[4])?.slice(0, 200) || "",
    landingVariant,
    landingPage: window.location.pathname.slice(0, 300),
    referrer: referrer.slice(0, 500),
  };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
}
