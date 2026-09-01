export const ANALYTICS_EVENTS = [
  "page_view",
  "cta_click",
  "form_start",
  "generate_lead",
  "form_error",
  "activity_selected",
  "municipality_selected",
  "persona_selected",
  "example_result_view",
  "pricing_view",
  "pricing_cta_click",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsProperties = Partial<{
  persona: string;
  activity: string;
  municipality: string;
  lead_type: "launch_interest";
  landing_page_type: string;
  landing_variant: string;
  selected_plan: string;
  price_seen: number;
  pricing_experiment: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  page_path: string;
  qualified: boolean;
}>;

const allowedProperties = new Set([
  "persona",
  "activity",
  "municipality",
  "lead_type",
  "landing_page_type",
  "landing_variant",
  "selected_plan",
  "price_seen",
  "pricing_experiment",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "page_path",
  "qualified",
]);
const piiKeys = new Set([
  "email",
  "name",
  "company",
  "website",
  "company_website",
  "phone",
]);

const CONSENT_KEY = "locapto_consent_v1";
const GENERATED_LEAD_KEY = "locapto_generated_leads_v1";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function sanitizeAnalyticsProperties(
  input: Record<string, unknown>,
): AnalyticsProperties {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (piiKeys.has(key) || !allowedProperties.has(key)) continue;
    if (["string", "number", "boolean"].includes(typeof value))
      safe[key] = value;
  }
  return safe as AnalyticsProperties;
}

export function track(
  event: AnalyticsEvent,
  properties: AnalyticsProperties = {},
) {
  if (typeof window === "undefined") return;
  try {
    const consent = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "{}") as {
      analytics?: boolean;
      marketing?: boolean;
    };
    const gtmConfigured = Boolean(process.env.NEXT_PUBLIC_GTM_ID);
    if (
      gtmConfigured
        ? !consent.analytics && !consent.marketing
        : !consent.analytics
    )
      return;
  } catch {
    return;
  }
  const safe = sanitizeAnalyticsProperties(properties);
  window.dataLayer ??= [];
  if (process.env.NEXT_PUBLIC_GTM_ID) window.dataLayer.push({ event, ...safe });
  else window.gtag?.("event", event, safe);
}

export function trackGenerateLeadOnce(
  leadId: string,
  properties: AnalyticsProperties,
) {
  if (typeof window === "undefined") return;
  let tracked: string[] = [];
  try {
    tracked = JSON.parse(sessionStorage.getItem(GENERATED_LEAD_KEY) ?? "[]");
  } catch {
    sessionStorage.removeItem(GENERATED_LEAD_KEY);
  }
  if (tracked.includes(leadId)) return;
  track("generate_lead", properties);
  tracked.push(leadId);
  sessionStorage.setItem(
    GENERATED_LEAD_KEY,
    JSON.stringify(tracked.slice(-20)),
  );
}
