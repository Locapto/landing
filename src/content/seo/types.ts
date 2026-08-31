export type OfficialSource = {
  title: string;
  url: string;
  organization: string;
  scope: "nacional" | "territorial" | "directorio-oficial";
  lastReviewedAt: string;
};

export type Municipality = {
  code: string;
  name: string;
  slug: string;
};

export type Province = {
  code: string;
  name: string;
  slug: string;
  municipalities: Municipality[];
};

export type AutonomousCommunity = {
  code: string;
  name: string;
  slug: string;
  provinces: Province[];
};

export type GeographyCatalog = {
  version: string;
  publishedAt: string;
  source: {
    title: string;
    url: string;
    organization: string;
    scope: string;
    lastReviewedAt: string;
  };
  territorySourceUrl: string;
  communities: AutonomousCommunity[];
};

export type ActivitySeoDefinition = {
  id: string;
  slug: string;
  name: string;
  synonyms: string[];
  summary: string;
  requirements: string[];
  steps: string[];
  uncertainties: string[];
  sources: OfficialSource[];
  lastReviewedAt: string;
};
