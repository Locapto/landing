"use client";

import Link from "next/link";
import type { LandingVariant } from "@/config/marketing";
import { getFirstTouchAttribution } from "@/lib/analytics/attribution";
import { track } from "@/lib/analytics/events";

export function TrackedBetaLink({
  href = "/#acceso-beta",
  variant,
  className = "button button-dark",
  children,
}: {
  href?: string;
  variant: LandingVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        const a = getFirstTouchAttribution(variant);
        track("cta_beta_click", {
          landing_variant: variant,
          utm_source: a.utmSource,
          utm_campaign: a.utmCampaign,
          page_path: a.pagePath,
        });
      }}
    >
      {children}
    </Link>
  );
}
