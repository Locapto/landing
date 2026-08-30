import type { MonthlyCases, Persona } from "./types";

const personaScores: Record<Persona, number> = {
  gestoria: 30,
  tecnico: 30,
  consultoria: 30,
  empresa: 20,
  proptech: 15,
  emprendedor: 10,
  otro: 0,
};
const volumeScores: Partial<Record<MonthlyCases, number>> = {
  "1-2": 5,
  "3-5": 15,
  "6-10": 25,
  "11-25": 35,
  "25+": 45,
};
const professionalPersonas = new Set<Persona>([
  "gestoria",
  "tecnico",
  "consultoria",
]);
const qualifiedVolumes = new Set<MonthlyCases>(["3-5", "6-10", "11-25", "25+"]);

export function scoreLead(
  persona: Persona,
  monthlyCases?: MonthlyCases,
  selectedPlan?: string | null,
) {
  return (
    personaScores[persona] +
    (monthlyCases ? (volumeScores[monthlyCases] ?? 0) : 0) +
    (selectedPlan === "professional" ? 20 : 0)
  );
}

export function isQualifiedLead(
  stage: "partial" | "complete",
  persona: Persona,
  monthlyCases?: MonthlyCases,
) {
  return (
    stage === "complete" &&
    professionalPersonas.has(persona) &&
    Boolean(monthlyCases && qualifiedVolumes.has(monthlyCases))
  );
}
