export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "steps"; items: Array<{ title: string; text: string }> }
  | { type: "callout"; title: string; text: string };

export type ContentSection = {
  id?: string;
  title: string;
  blocks: ContentBlock[];
};

export type PublicPageDefinition = {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  kind:
    | "audience"
    | "product"
    | "coverage"
    | "resource-index"
    | "article"
    | "legal";
  sections: ContentSection[];
  relatedPaths: string[];
  indexable: true;
};

export type ProgrammaticSeoPage = {
  slug: string;
  title: string;
  description: string;
  municipality: string;
  activity: string;
  content: ContentBlock[];
  officialSources: Array<{ title: string; url: string }>;
  lastReviewedAt: string | null;
  coverageStatus: "planned" | "in_review" | "reviewed";
  indexable: boolean;
};
