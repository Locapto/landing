import catalogData from "@/data/geography-catalog.json";
import type {
  AutonomousCommunity,
  GeographyCatalog,
  Municipality,
  Province,
} from "./types";

export const geographyCatalog = catalogData as GeographyCatalog;

export const communityBySlug = new Map(
  geographyCatalog.communities.map((community) => [community.slug, community]),
);

export const provinceByCode = new Map<string, Province>();
export const municipalityByCode = new Map<
  string,
  {
    community: AutonomousCommunity;
    province: Province;
    municipality: Municipality;
  }
>();
export const municipalityNameCounts = new Map<string, number>();

for (const community of geographyCatalog.communities) {
  for (const province of community.provinces) {
    provinceByCode.set(province.code, province);
    for (const municipality of province.municipalities) {
      municipalityNameCounts.set(
        municipality.name,
        (municipalityNameCounts.get(municipality.name) ?? 0) + 1,
      );
      municipalityByCode.set(municipality.code, {
        community,
        province,
        municipality,
      });
    }
  }
}

export const municipalityCount = municipalityByCode.size;
