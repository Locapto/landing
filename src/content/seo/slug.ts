export function slugifyTerritory(value: string): string {
  const parts = value.split(",").map((part) => part.trim());
  const reordered =
    parts.length === 2 && parts[1] ? `${parts[1]} ${parts[0]}` : value;
  return reordered
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function municipalitySegment(municipality: {
  slug: string;
  code: string;
}): string {
  return `${municipality.slug}-${municipality.code}`;
}

export function municipalityCodeFromSegment(segment: string): string | null {
  return segment.match(/-(\d{5})$/)?.[1] ?? null;
}
