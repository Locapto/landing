import type { ActivitySeoDefinition, OfficialSource } from "./types";

const REVIEW_DATE = "2026-08-31";

const buildingSource: OfficialSource = {
  title: "Código Técnico de la Edificación",
  url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-5515",
  organization: "Agencia Estatal Boletín Oficial del Estado",
  scope: "nacional",
  lastReviewedAt: REVIEW_DATE,
};

const retailSource: OfficialSource = {
  title:
    "Ley 12/2012, de medidas urgentes de liberalización del comercio y de determinados servicios",
  url: "https://www.boe.es/buscar/act.php?id=BOE-A-2012-15595",
  organization: "Agencia Estatal Boletín Oficial del Estado",
  scope: "nacional",
  lastReviewedAt: REVIEW_DATE,
};

const foodHygieneSource: OfficialSource = {
  title:
    "Reglamento (CE) n.º 852/2004 relativo a la higiene de los productos alimenticios",
  url: "https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:02004R0852-20210324",
  organization: "Unión Europea",
  scope: "nacional",
  lastReviewedAt: REVIEW_DATE,
};

const tobaccoSource: OfficialSource = {
  title: "Real Decreto 1199/1999, de ordenación del mercado de tabacos",
  url: "https://www.boe.es/buscar/act.php?id=BOE-A-1999-15353",
  organization: "Agencia Estatal Boletín Oficial del Estado",
  scope: "nacional",
  lastReviewedAt: REVIEW_DATE,
};

const pharmacySource: OfficialSource = {
  title: "Ley 16/1997, de regulación de servicios de las oficinas de farmacia",
  url: "https://www.boe.es/buscar/act.php?id=BOE-A-1997-9022",
  organization: "Agencia Estatal Boletín Oficial del Estado",
  scope: "nacional",
  lastReviewedAt: REVIEW_DATE,
};

const noiseSource: OfficialSource = {
  title: "Ley 37/2003, del Ruido",
  url: "https://www.boe.es/buscar/act.php?id=BOE-A-2003-20976",
  organization: "Agencia Estatal Boletín Oficial del Estado",
  scope: "nacional",
  lastReviewedAt: REVIEW_DATE,
};

const commonRequirements = [
  "Compatibilidad urbanística del uso y de la actividad en el emplazamiento.",
  "Accesibilidad, evacuación, protección contra incendios y seguridad de utilización.",
  "Instalaciones, ventilación y condiciones del local adecuadas a la actividad real.",
];

const commonSteps = [
  "Definir con precisión la actividad, los servicios y el aforo previsto.",
  "Comprobar el uso permitido y las condiciones del local antes de comprometerse.",
  "Identificar si habrá obras, proyecto o certificados técnicos.",
  "Confirmar el procedimiento municipal y presentar la documentación exigible.",
];

const commonUncertainties = [
  "La dirección exacta y el planeamiento aplicable.",
  "La superficie, el aforo, las obras y las instalaciones existentes.",
  "La ordenanza y el criterio del ayuntamiento para el caso concreto.",
];

function activity(
  definition: Omit<
    ActivitySeoDefinition,
    "requirements" | "steps" | "uncertainties" | "lastReviewedAt"
  > & {
    requirements?: string[];
    steps?: string[];
    uncertainties?: string[];
  },
): ActivitySeoDefinition {
  return {
    ...definition,
    requirements: [...commonRequirements, ...(definition.requirements ?? [])],
    steps: definition.steps ?? commonSteps,
    uncertainties: [
      ...commonUncertainties,
      ...(definition.uncertainties ?? []),
    ],
    lastReviewedAt: REVIEW_DATE,
  };
}

export const activitySeoDefinitions: ActivitySeoDefinition[] = [
  activity({
    id: "restaurant",
    slug: "restaurante",
    name: "un restaurante",
    synonyms: ["restauración", "casa de comidas"],
    summary:
      "Abrir un restaurante suele exigir comprobar la compatibilidad del local, las obras e instalaciones, las condiciones higiénico-sanitarias y el procedimiento municipal antes de iniciar la actividad.",
    requirements: [
      "Zonas de manipulación y conservación de alimentos con condiciones higiénicas adecuadas.",
      "Extracción, ventilación, saneamiento y gestión de residuos acordes con la cocina prevista.",
    ],
    sources: [buildingSource, foodHygieneSource],
  }),
  activity({
    id: "bar",
    slug: "bar",
    name: "un bar",
    synonyms: ["bar de copas", "taberna"],
    summary:
      "Abrir un bar suele requerir verificar el uso del local, el aforo, el ruido, la ventilación o extracción, la seguridad y el trámite municipal aplicable.",
    requirements: [
      "Control de ruido, horarios y posible incidencia ambiental según la actividad real.",
      "Condiciones higiénicas para alimentos y bebidas cuando exista manipulación.",
    ],
    sources: [buildingSource, foodHygieneSource],
  }),
  activity({
    id: "hotel",
    slug: "hotel",
    name: "un hotel",
    synonyms: ["alojamiento hotelero", "establecimiento hotelero"],
    summary:
      "Abrir un hotel suele exigir comprobar el uso del inmueble, la accesibilidad, la seguridad, las instalaciones y el procedimiento turístico de la comunidad autónoma, además del trámite municipal.",
    requirements: [
      "Habitaciones, zonas comunes, evacuación y protección contra incendios adecuadas al aforo previsto.",
      "Clasificación y requisitos turísticos de alojamiento establecidos por la comunidad autónoma.",
    ],
    uncertainties: [
      "La categoría hotelera, los servicios, el número de habitaciones y la normativa turística autonómica.",
    ],
    sources: [buildingSource],
  }),
  activity({
    id: "tobacco-shop",
    slug: "estanco",
    name: "un estanco",
    synonyms: ["expendeduría de tabaco", "expendeduría de tabaco y timbre"],
    summary:
      "Abrir un estanco requiere una concesión o autorización del Comisionado para el Mercado de Tabacos y comprobar que el local cumple las condiciones urbanísticas y técnicas aplicables.",
    requirements: [
      "Título concesional y cumplimiento de las reglas sectoriales sobre ubicación, transmisión y funcionamiento.",
      "Local accesible y seguro, compatible con el uso comercial permitido.",
    ],
    sources: [buildingSource, tobaccoSource],
  }),
  activity({
    id: "pharmacy",
    slug: "farmacia",
    name: "una farmacia",
    synonyms: ["oficina de farmacia", "botica"],
    summary:
      "Abrir una farmacia depende de la planificación y autorización sanitaria de la comunidad autónoma, de la titularidad profesional y de que el local cumpla las condiciones técnicas aplicables.",
    requirements: [
      "Autorización de oficina de farmacia y dirección por farmacéuticos conforme a la normativa autonómica.",
      "Conservación y custodia de medicamentos, accesibilidad y condiciones adecuadas del local.",
    ],
    uncertainties: [
      "La planificación farmacéutica, el concurso o procedimiento autonómico y las distancias exigibles.",
    ],
    sources: [buildingSource, pharmacySource],
  }),
  activity({
    id: "clothing-store",
    slug: "tienda-de-ropa",
    name: "una tienda de ropa",
    synonyms: ["comercio textil", "boutique"],
    summary:
      "Abrir una tienda de ropa suele requerir confirmar el uso comercial, la superficie, las obras, la accesibilidad y si puede acogerse al régimen previsto para determinados comercios.",
    requirements: [
      "Distribución, recorridos de evacuación y carga de fuego compatibles con los productos almacenados.",
      "Zonas de venta, probadores, almacén e instalaciones adecuadas a la actividad real.",
    ],
    sources: [buildingSource, retailSource],
  }),
  activity({
    id: "gym",
    slug: "gimnasio",
    name: "un gimnasio",
    synonyms: ["centro deportivo", "sala de entrenamiento"],
    summary:
      "Abrir un gimnasio suele depender del uso permitido, el aforo, la accesibilidad, el ruido y vibraciones, la ventilación y las condiciones de vestuarios e instalaciones.",
    requirements: [
      "Aforo, evacuación y ventilación calculados para la ocupación y el esfuerzo físico previstos.",
      "Control de ruido estructural, música y vibraciones de equipos.",
    ],
    sources: [buildingSource],
  }),
  activity({
    id: "nightclub",
    slug: "discoteca",
    name: "una discoteca",
    synonyms: ["sala de fiestas", "local de ocio nocturno"],
    summary:
      "Abrir una discoteca suele exigir confirmar la compatibilidad del uso, el aforo, el aislamiento acústico, la evacuación, la ventilación y el régimen autonómico y municipal de espectáculos.",
    requirements: [
      "Estudio acústico, aislamiento y medidas correctoras acordes con el horario y los equipos de sonido.",
      "Aforo, evacuación, protección contra incendios y medidas de seguridad para pública concurrencia.",
    ],
    sources: [buildingSource, noiseSource],
  }),
  activity({
    id: "supermarket",
    slug: "supermercado",
    name: "un supermercado",
    synonyms: ["autoservicio", "comercio de alimentación"],
    summary:
      "Abrir un supermercado suele requerir comprobar el uso comercial, el aforo, la logística, la seguridad y las condiciones de higiene y conservación de los alimentos.",
    requirements: [
      "Almacenamiento, exposición y cadena de frío adecuados a cada tipo de alimento vendido.",
      "Carga y descarga, gestión de residuos, evacuación y protección contra incendios acordes con la superficie y mercancía.",
    ],
    sources: [buildingSource, retailSource, foodHygieneSource],
  }),
  activity({
    id: "real-estate-agency",
    slug: "inmobiliaria",
    name: "una inmobiliaria",
    synonyms: ["agencia inmobiliaria", "oficina inmobiliaria"],
    summary:
      "Abrir una inmobiliaria suele requerir comprobar el uso de oficina o comercial, la accesibilidad y seguridad del local, el trámite municipal y los posibles requisitos autonómicos para agentes inmobiliarios.",
    requirements: [
      "Zona de atención al público accesible e instalaciones seguras para el uso previsto.",
      "Información al consumidor, protección de datos y, donde proceda, inscripción profesional autonómica.",
    ],
    uncertainties: [
      "La existencia de un registro autonómico de agentes, seguro o garantía obligatoria.",
    ],
    sources: [buildingSource],
  }),
];

export const activityBySlug = new Map(
  activitySeoDefinitions.map((definition) => [definition.slug, definition]),
);

export const activitySelection = {
  selectedAt: REVIEW_DATE,
  status: "selected-with-google-trends",
  sourceUrl: "https://trends.google.com/trends/explore?date=today%205-y&geo=ES",
  method:
    "Google Trends, España, búsqueda web, últimos 5 años; consultas de intención de apertura con ancla común y desempate a 12 meses.",
  note: "Se excluyeron consultas genéricas contaminadas por intención digital o de producto. Search Console deberá validar la selección cuando exista suficiente tráfico propio.",
} as const;
