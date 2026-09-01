"use client";

import Link from "next/link";
import type { LandingVariant } from "@/config/marketing";
import { getFirstTouchAttribution } from "@/lib/analytics/attribution";
import { track } from "@/lib/analytics/events";

export function TrackedBetaLink({
  href = "/#acceso-beta",
  variant,
  className = "button button-dark",
  qualification,
  children,
}: {
  href?: string;
  variant: LandingVariant;
  className?: string;
  qualification?: {
    activity?: string;
    activityKey?: string;
    municipality?: string;
    municipalityCode?: string;
  };
  children: React.ReactNode;
}) {
  const query = new URLSearchParams();
  if (qualification?.activity) query.set("activity", qualification.activity);
  if (qualification?.activityKey)
    query.set("activity_key", qualification.activityKey);
  if (qualification?.municipality)
    query.set("municipality", qualification.municipality);
  if (qualification?.municipalityCode)
    query.set("municipality_code", qualification.municipalityCode);
  const resolvedHref = qualification
    ? `/?${query.toString()}#acceso-beta`
    : href;
  return (
    <Link
      href={resolvedHref}
      className={className}
      onClick={() => {
        const a = getFirstTouchAttribution(variant);
        track("cta_click", {
          landing_variant: variant,
          utm_source: a.utmSource,
          utm_campaign: a.utmCampaign,
          page_path: a.landingPage,
        });
      }}
    >
      {children}
    </Link>
  );
}
