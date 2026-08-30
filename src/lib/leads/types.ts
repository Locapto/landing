export const PERSONAS = [
  ["gestoria", "Gestoría / asesoría"],
  ["tecnico", "Arquitectura / ingeniería"],
  ["consultoria", "Consultoría de licencias"],
  ["empresa", "Empresa / cadena / franquicia"],
  ["proptech", "Inmobiliaria / proptech"],
  ["emprendedor", "Emprendedor / pyme"],
  ["otro", "Otro"],
] as const;

export const MONTHLY_CASES = [
  "none",
  "1-2",
  "3-5",
  "6-10",
  "11-25",
  "25+",
  "na",
] as const;
export const MONTHLY_CASE_LABELS: Record<
  (typeof MONTHLY_CASES)[number],
  string
> = {
  none: "Ninguno",
  "1-2": "1–2",
  "3-5": "3–5",
  "6-10": "6–10",
  "11-25": "11–25",
  "25+": "Más de 25",
  na: "No aplica",
};

export const INTERESTS = [
  ["activities", "Precalificar actividades"],
  ["premises", "Comprobar locales"],
  ["cases", "Gestionar varios expedientes"],
  ["clients", "Generar información para clientes"],
  ["locations", "Evaluar ubicaciones"],
  ["integration", "Integrar Locapto en otro producto"],
  ["other", "Otro"],
] as const;

export type Persona = (typeof PERSONAS)[number][0];
export type MonthlyCases = (typeof MONTHLY_CASES)[number];
export type Interest = (typeof INTERESTS)[number][0];

export const personaLabel = (value: Persona) =>
  PERSONAS.find(([key]) => key === value)?.[1] ?? value;
export const interestLabel = (value: Interest) =>
  INTERESTS.find(([key]) => key === value)?.[1] ?? value;
