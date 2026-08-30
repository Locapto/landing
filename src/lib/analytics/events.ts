export const ANALYTICS_EVENTS = [
  "page_view",
  "cta_beta_click",
  "example_result_view",
  "beta_form_view",
  "beta_step1_submit",
  "beta_step1_success",
  "beta_step2_submit",
  "beta_complete",
  "pricing_view",
  "pricing_cta_click",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsProperties = Partial<{
  persona: string;
  landing_variant: string;
  selected_plan: string;
  price_seen: number;
  pricing_experiment: boolean;
  utm_source: string;
  utm_campaign: string;
  page_path: string;
  qualified: boolean;
}>;

const allowedProperties = new Set([
  "persona",
  "landing_variant",
  "selected_plan",
  "price_seen",
  "pricing_experiment",
  "utm_source",
  "utm_campaign",
  "page_path",
  "qualified",
]);
const piiKeys = new Set(["email", "name", "company"]);

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
  const safe = sanitizeAnalyticsProperties(properties);
  window.dataLayer ??= [];
  window.dataLayer.push({ event, ...safe });
  window.gtag?.("event", event, safe);
}
