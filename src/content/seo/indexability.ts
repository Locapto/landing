import type { OfficialSource } from "./types";
import type { SeoRoute } from "./routes";

export type SeoIndexabilityReason =
  | "public-page"
  | "useful-territorial-hub"
  | "useful-activity-hub"
  | "reviewed-local-evidence"
  | "insufficient-local-evidence";

export type SeoIndexability = {
  seoIndexable: boolean;
  seoIndexabilityReason: SeoIndexabilityReason;
};

export type ReviewedLocalSeoContent = {
  canonicalPath: string;
  reviewedAt: string;
  editoriallyApprovedForIndexing: true;
  localFacts: string[];
  sources: OfficialSource[];
};

// Add entries only after editorial review. Route existence never implies indexing.
export const reviewedLocalSeoContent = new Map<
  string,
  ReviewedLocalSeoContent
>();

export function seoIndexabilityForRoute(route: SeoRoute): SeoIndexability {
  if (route.kind === "activity-municipality") {
    const local = reviewedLocalSeoContent.get(route.canonicalPath);
    if (local?.localFacts.length && local.sources.length)
      return {
        seoIndexable: true,
        seoIndexabilityReason: "reviewed-local-evidence",
      };
    return {
      seoIndexable: false,
      seoIndexabilityReason: "insufficient-local-evidence",
    };
  }
  if (route.kind.startsWith("activity"))
    return {
      seoIndexable: true,
      seoIndexabilityReason: "useful-activity-hub",
    };
  return {
    seoIndexable: true,
    seoIndexabilityReason: "useful-territorial-hub",
  };
}
