import { activityBySlug, activitySeoDefinitions } from "./activities";
import {
  communityBySlug,
  geographyCatalog,
  municipalityByCode,
} from "./geography";
import { municipalityCodeFromSegment, municipalitySegment } from "./slug";
import type {
  ActivitySeoDefinition,
  AutonomousCommunity,
  Municipality,
  Province,
} from "./types";

export type SeoRoute = {
  kind:
    | "territory-index"
    | "community"
    | "province"
    | "municipality"
    | "activity-index"
    | "activity"
    | "activity-community"
    | "activity-province"
    | "activity-municipality";
  canonicalPath: string;
  community?: AutonomousCommunity;
  province?: Province;
  municipality?: Municipality;
  activity?: ActivitySeoDefinition;
};

function provinceFor(
  community: AutonomousCommunity,
  provinceSlug: string,
): Province | undefined {
  return community.provinces.find((province) => province.slug === provinceSlug);
}

function resolveMunicipality(
  community: AutonomousCommunity,
  province: Province,
  segment: string,
): Municipality | undefined {
  const code = municipalityCodeFromSegment(segment);
  if (!code) return undefined;
  const match = municipalityByCode.get(code);
  if (
    !match ||
    match.community.code !== community.code ||
    match.province.code !== province.code
  )
    return undefined;
  return match.municipality;
}

export function territoryPath(
  community?: AutonomousCommunity,
  province?: Province,
  municipality?: Municipality,
): string {
  return [
    "/municipios",
    community?.slug,
    province?.slug,
    municipality ? municipalitySegment(municipality) : undefined,
  ]
    .filter(Boolean)
    .join("/");
}

export function activityPath(
  activity?: ActivitySeoDefinition,
  community?: AutonomousCommunity,
  province?: Province,
  municipality?: Municipality,
): string {
  return [
    "/abrir-negocio",
    activity?.slug,
    community?.slug,
    province?.slug,
    municipality ? municipalitySegment(municipality) : undefined,
  ]
    .filter(Boolean)
    .join("/");
}

export function resolveSeoRoute(segments: string[]): SeoRoute | null {
  if (segments[0] === "municipios") {
    if (segments.length === 1)
      return { kind: "territory-index", canonicalPath: territoryPath() };
    const community = communityBySlug.get(segments[1]);
    if (!community) return null;
    if (segments.length === 2)
      return {
        kind: "community",
        canonicalPath: territoryPath(community),
        community,
      };
    const province = provinceFor(community, segments[2]);
    if (!province) return null;
    if (segments.length === 3)
      return {
        kind: "province",
        canonicalPath: territoryPath(community, province),
        community,
        province,
      };
    if (segments.length !== 4) return null;
    const municipality = resolveMunicipality(community, province, segments[3]);
    if (!municipality) return null;
    return {
      kind: "municipality",
      canonicalPath: territoryPath(community, province, municipality),
      community,
      province,
      municipality,
    };
  }

  if (segments[0] === "abrir-negocio") {
    if (segments.length === 1)
      return { kind: "activity-index", canonicalPath: activityPath() };
    const activity = activityBySlug.get(segments[1]);
    if (!activity) return null;
    if (segments.length === 2)
      return {
        kind: "activity",
        canonicalPath: activityPath(activity),
        activity,
      };
    const community = communityBySlug.get(segments[2]);
    if (!community) return null;
    if (segments.length === 3)
      return {
        kind: "activity-community",
        canonicalPath: activityPath(activity, community),
        activity,
        community,
      };
    const province = provinceFor(community, segments[3]);
    if (!province) return null;
    if (segments.length === 4)
      return {
        kind: "activity-province",
        canonicalPath: activityPath(activity, community, province),
        activity,
        community,
        province,
      };
    if (segments.length !== 5) return null;
    const municipality = resolveMunicipality(community, province, segments[4]);
    if (!municipality) return null;
    return {
      kind: "activity-municipality",
      canonicalPath: activityPath(activity, community, province, municipality),
      activity,
      community,
      province,
      municipality,
    };
  }
  return null;
}

export function upperLevelStaticParams(): { slug: string[] }[] {
  const paths = [territoryPath(), activityPath()];
  for (const community of geographyCatalog.communities) {
    paths.push(territoryPath(community));
    for (const province of community.provinces)
      paths.push(territoryPath(community, province));
  }
  for (const activity of activitySeoDefinitions) {
    paths.push(activityPath(activity));
    for (const community of geographyCatalog.communities) {
      paths.push(activityPath(activity, community));
      for (const province of community.provinces)
        paths.push(activityPath(activity, community, province));
    }
  }
  return paths.map((path) => ({ slug: path.slice(1).split("/") }));
}
