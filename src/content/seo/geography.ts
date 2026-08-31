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

for (const community of geographyCatalog.communities) {
  for (const province of community.provinces) {
    provinceByCode.set(province.code, province);
    for (const municipality of province.municipalities) {
      municipalityByCode.set(municipality.code, {
        community,
        province,
        municipality,
      });
    }
  }
}

export const municipalityCount = municipalityByCode.size;
