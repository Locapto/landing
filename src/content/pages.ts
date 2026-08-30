import type { PublicPageDefinition } from "./types";

export const publicPages: PublicPageDefinition[] = [
  {
    path: "/para-gestorias",
    title:
      "Locapto para gestorías | Precalificación de aperturas y actividades",
    description:
      "Reduce investigación repetitiva en expedientes de apertura y actividad. Organiza requisitos, condicionantes y fuentes oficiales con Locapto.",
    eyebrow: "Para gestorías y asesorías",
    heading: "Cada nuevo expediente no debería empezar desde cero.",
    intro:
      "Locapto está pensado para estructurar la investigación inicial de aperturas y ayudarte a identificar antes qué información falta.",
    kind: "audience",
    sections: [
      {
        title: "Una primera revisión más ordenada",
        blocks: [
          {
            type: "paragraph",
            text: "Los requisitos de una apertura suelen estar repartidos entre trámites, ordenanzas, formularios y sedes electrónicas. Locapto los organiza alrededor de una actividad y un municipio concretos.",
          },
          {
            type: "bullets",
            items: [
              "Procedimiento administrativo más probable.",
              "Documentación que suele solicitarse.",
              "Variables del local que conviene confirmar.",
              "Fuentes oficiales y fecha de revisión.",
            ],
          },
        ],
      },
      {
        title: "Diseñado para expedientes repetitivos",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Recoge el contexto",
                text: "Actividad, municipio y características conocidas del local.",
              },
              {
                title: "Detecta lagunas",
                text: "Identifica preguntas pendientes antes de pedir documentación al cliente.",
              },
              {
                title: "Conserva la evidencia",
                text: "Localiza la fuente oficial detrás de cada orientación preliminar.",
              },
            ],
          },
          {
            type: "callout",
            title: "Orientación preliminar",
            text: "Locapto no concede licencias ni sustituye la revisión profesional o administrativa que corresponda.",
          },
        ],
      },
    ],
    relatedPaths: [
      "/como-funciona",
      "/cobertura",
      "/recursos/licencia-actividad-vs-declaracion-responsable",
    ],
    indexable: true,
  },
  {
    path: "/para-arquitectos-ingenieros",
    title: "Locapto para arquitectos e ingenieros | Precalificación de locales",
    description:
      "Detecta condicionantes de actividad y local antes de dedicar horas a un estudio o proyecto completo.",
    eyebrow: "Para arquitectura e ingeniería",
    heading: "Precalifica un local antes de dedicar horas al estudio completo.",
    intro:
      "Obtén una vista inicial de procedimiento, documentación y variables técnicas que pueden condicionar el encargo.",
    kind: "audience",
    sections: [
      {
        title: "Llegar antes a las preguntas importantes",
        blocks: [
          {
            type: "paragraph",
            text: "Una dirección y una actividad no bastan para concluir la viabilidad. Locapto separa lo que puede orientarse con fuentes oficiales de aquello que necesita comprobación técnica o municipal.",
          },
          {
            type: "bullets",
            items: [
              "Uso y compatibilidad urbanística por confirmar.",
              "Alcance de obras previsto.",
              "Condiciones de accesibilidad, instalaciones y seguridad aplicables.",
              "Información del local todavía ausente.",
            ],
          },
        ],
      },
      {
        title: "Un punto de partida, no un proyecto técnico",
        blocks: [
          {
            type: "paragraph",
            text: "La precalificación ayuda a ordenar la fase inicial y a explicar riesgos al cliente. El estudio técnico, las visitas, mediciones y verificaciones exigibles siguen correspondiendo al profesional competente.",
          },
          {
            type: "callout",
            title: "Cobertura explícita",
            text: "La primera cobertura se está desarrollando para Madrid, Barcelona y Mataró y tres familias de actividad.",
          },
        ],
      },
    ],
    relatedPaths: [
      "/como-funciona",
      "/cobertura",
      "/recursos/que-comprobar-antes-de-alquilar-un-local",
    ],
    indexable: true,
  },
  {
    path: "/para-empresas",
    title: "Locapto para empresas y cadenas | Evalúa locales antes de invertir",
    description:
      "Compara ubicaciones y detecta condicionantes de una apertura antes de alquilar, reformar o comprometer capital.",
    eyebrow: "Para empresas, cadenas y emprendedores",
    heading: "Detecta riesgos de un local antes de comprometer una operación.",
    intro:
      "Locapto ayuda a ordenar la investigación previa de una ubicación para que las decisiones comerciales empiecen con mejores preguntas.",
    kind: "audience",
    sections: [
      {
        title: "Comparar con criterios consistentes",
        blocks: [
          {
            type: "paragraph",
            text: "Dos locales parecidos pueden conducir a trámites y necesidades diferentes. Una precalificación común facilita comparar ubicaciones sin confundir una orientación inicial con una aprobación.",
          },
          {
            type: "bullets",
            items: [
              "Procedimiento probable por actividad y municipio.",
              "Condicionantes que pueden alterar la respuesta.",
              "Documentos e información que faltan.",
              "Bloqueos habituales que merece la pena investigar.",
            ],
          },
        ],
      },
      {
        title: "Antes de alquilar, reformar o invertir",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Define la actividad real",
                text: "Incluye servicios accesorios y forma de funcionamiento.",
              },
              {
                title: "Reúne datos del local",
                text: "Superficie, obras previstas, antecedentes y características conocidas.",
              },
              {
                title: "Valida con especialistas",
                text: "Escala los puntos técnicos o administrativos que requieran confirmación.",
              },
            ],
          },
        ],
      },
    ],
    relatedPaths: [
      "/cobertura",
      "/recursos/como-abrir-un-negocio-en-un-local",
      "/recursos/que-comprobar-antes-de-alquilar-un-local",
    ],
    indexable: true,
  },
  {
    path: "/como-funciona",
    title: "Cómo funciona Locapto | Precalificación de aperturas",
    description:
      "Conoce cómo Locapto estructura actividad, ubicación, requisitos, preguntas pendientes y fuentes oficiales.",
    eyebrow: "Cómo funciona",
    heading: "De una idea y una ubicación a una precalificación trazable.",
    intro:
      "Locapto organiza la información inicial para mostrar qué parece probable, qué falta por saber y qué fuente oficial respalda cada orientación.",
    kind: "product",
    sections: [
      {
        title: "Tres pasos",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "1. Describe la actividad",
                text: "Explica qué quieres abrir en lenguaje normal, incluyendo los servicios relevantes.",
              },
              {
                title: "2. Indica dónde",
                text: "Selecciona municipio y, si ya existe un local, aporta sus características conocidas.",
              },
              {
                title: "3. Consulta la precalificación",
                text: "Revisa procedimiento probable, requisitos, documentación, preguntas pendientes y evidencia oficial.",
              },
            ],
          },
        ],
      },
      {
        title: "Una respuesta diseñada para actuar",
        blocks: [
          {
            type: "bullets",
            items: [
              "Actividad normalizada y alcance interpretado.",
              "Procedimiento administrativo más probable.",
              "Requisitos y documentación habituales.",
              "Administraciones y fuentes oficiales implicadas.",
              "Variables críticas, bloqueos y elementos no evaluados.",
            ],
          },
          {
            type: "callout",
            title: "La respuesta puede cambiar",
            text: "El municipio, la actividad exacta, las obras y las condiciones del establecimiento pueden modificar el trámite o exigir revisiones adicionales.",
          },
        ],
      },
    ],
    relatedPaths: [
      "/cobertura",
      "/recursos",
      "/recursos/licencia-de-actividad",
    ],
    indexable: true,
  },
  {
    path: "/cobertura",
    title: "Cobertura de municipios y actividades | Locapto",
    description:
      "Consulta la cobertura inicial en desarrollo de Locapto para municipios, actividades y fuentes oficiales.",
    eyebrow: "Cobertura inicial",
    heading: "Empezamos con una cobertura limitada para poder hacerla bien.",
    intro:
      "La cobertura crece de forma progresiva según la demanda y la disponibilidad de fuentes oficiales verificables.",
    kind: "coverage",
    sections: [
      {
        title: "Municipios en desarrollo",
        blocks: [{ type: "bullets", items: ["Madrid", "Barcelona", "Mataró"] }],
      },
      {
        title: "Familias de actividad iniciales",
        blocks: [
          {
            type: "bullets",
            items: [
              "Comercio minorista.",
              "Peluquería y estética no sanitaria.",
              "Cafetería y restauración.",
            ],
          },
        ],
      },
      {
        title: "Qué significa cobertura",
        blocks: [
          {
            type: "paragraph",
            text: "La cobertura debe indicar qué municipio, actividad, procedimiento y variables han sido revisados, cuándo se revisaron las fuentes y qué elementos quedan fuera.",
          },
          {
            type: "callout",
            title: "Todavía en preparación",
            text: "Esta página describe la cobertura inicial que estamos desarrollando; no afirma que todas las combinaciones estén ya disponibles.",
          },
        ],
      },
    ],
    relatedPaths: ["/como-funciona", "/recursos", "/para-gestorias"],
    indexable: true,
  },
  {
    path: "/recursos",
    title: "Guías para abrir un negocio en un local | Locapto",
    description:
      "Recursos claros sobre licencias de actividad, declaraciones responsables y comprobaciones previas de locales.",
    eyebrow: "Recursos",
    heading: "Guías para investigar una apertura con mejores preguntas.",
    intro:
      "Conceptos y listas de comprobación para entender el proceso sin convertir orientaciones generales en certezas municipales.",
    kind: "resource-index",
    sections: [
      {
        title: "Trámites y conceptos",
        blocks: [
          {
            type: "bullets",
            items: [
              "Licencia de actividad",
              "Declaración responsable",
              "Licencia de apertura",
              "Licencia de actividad frente a declaración responsable",
            ],
          },
        ],
      },
      {
        title: "Decisiones sobre el local",
        blocks: [
          {
            type: "bullets",
            items: [
              "Qué comprobar antes de alquilar un local",
              "Cómo abrir un negocio en un local",
            ],
          },
        ],
      },
    ],
    relatedPaths: [
      "/recursos/licencia-de-actividad",
      "/recursos/declaracion-responsable",
      "/recursos/que-comprobar-antes-de-alquilar-un-local",
    ],
    indexable: true,
  },
  {
    path: "/recursos/licencia-de-actividad",
    title: "Licencia de actividad: qué es y qué revisar | Locapto",
    description:
      "Entiende qué suele implicar una licencia de actividad y qué factores conviene comprobar según municipio, actividad y local.",
    eyebrow: "Guía de aperturas",
    heading:
      "Licencia de actividad: una denominación común para trámites que pueden variar.",
    intro:
      "El nombre utilizado coloquialmente no siempre coincide con el procedimiento administrativo exacto. Conviene identificar el trámite aplicable antes de preparar documentación.",
    kind: "article",
    sections: [
      {
        title: "Qué suele describir",
        blocks: [
          {
            type: "paragraph",
            text: "Se usa para hablar de la habilitación o control municipal relacionado con el inicio o ejercicio de una actividad en un establecimiento. La forma concreta depende del municipio, la actividad, las obras y las características del local.",
          },
        ],
      },
      {
        title: "Factores que conviene revisar",
        blocks: [
          {
            type: "bullets",
            items: [
              "Clasificación y alcance real de la actividad.",
              "Compatibilidad del uso en la ubicación.",
              "Necesidad y alcance de las obras.",
              "Condiciones técnicas, accesibilidad, seguridad e instalaciones.",
              "Documentación y tasas definidas por la administración competente.",
            ],
          },
        ],
      },
      {
        title: "Antes de iniciar el expediente",
        blocks: [
          {
            type: "callout",
            title: "Comprueba el procedimiento oficial",
            text: "No asumas que el trámite se llama igual o exige lo mismo en todos los municipios. Consulta la sede y las fuentes oficiales vigentes.",
          },
        ],
      },
    ],
    relatedPaths: [
      "/recursos/declaracion-responsable",
      "/recursos/licencia-actividad-vs-declaracion-responsable",
      "/cobertura",
    ],
    indexable: true,
  },
  {
    path: "/recursos/declaracion-responsable",
    title: "Declaración responsable para una actividad | Locapto",
    description:
      "Conoce qué implica normalmente una declaración responsable y por qué no elimina las comprobaciones técnicas o municipales.",
    eyebrow: "Guía de aperturas",
    heading:
      "Declaración responsable: iniciar un trámite no elimina la obligación de cumplir.",
    intro:
      "Presentar una declaración responsable supone afirmar que se cumplen las condiciones exigibles y que se dispone de la documentación necesaria para acreditarlo.",
    kind: "article",
    sections: [
      {
        title: "Qué debe quedar claro",
        blocks: [
          {
            type: "bullets",
            items: [
              "Quién declara y para qué actividad.",
              "Qué documentación debe conservarse o adjuntarse.",
              "Desde cuándo permite actuar el procedimiento concreto.",
              "Qué controles posteriores puede realizar la administración.",
            ],
          },
        ],
      },
      {
        title: "No equivale a una aprobación previa",
        blocks: [
          {
            type: "paragraph",
            text: "La ausencia de una revisión previa no convierte en válida una actividad incompatible ni corrige deficiencias del local. Las consecuencias y requisitos dependen del procedimiento y de la administración competente.",
          },
        ],
      },
      {
        title: "Preparar la presentación",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Identifica el trámite",
                text: "Verifica que la actividad puede utilizar esa vía en el municipio.",
              },
              {
                title: "Reúne evidencias",
                text: "Prepara documentos, certificados o proyectos que correspondan.",
              },
              {
                title: "Conserva justificantes",
                text: "Guarda la presentación y la documentación disponible para posibles comprobaciones.",
              },
            ],
          },
        ],
      },
    ],
    relatedPaths: [
      "/recursos/licencia-de-actividad",
      "/recursos/licencia-actividad-vs-declaracion-responsable",
      "/cobertura",
    ],
    indexable: true,
  },
  {
    path: "/recursos/licencia-de-apertura",
    title: "Licencia de apertura: significado y comprobaciones | Locapto",
    description:
      "Aclara qué se suele llamar licencia de apertura y cómo distinguir el nombre coloquial del procedimiento municipal aplicable.",
    eyebrow: "Guía de aperturas",
    heading:
      "Licencia de apertura: empieza por identificar el trámite, no por el nombre popular.",
    intro:
      "La expresión se utiliza de manera amplia, pero cada ayuntamiento puede organizar sus procedimientos y denominaciones de forma distinta.",
    kind: "article",
    sections: [
      {
        title: "Actividad, obras y local",
        blocks: [
          {
            type: "paragraph",
            text: "La apertura puede relacionarse con controles sobre la actividad, las obras, el uso y las condiciones del establecimiento. Esos elementos pueden tramitarse conjuntamente o por vías diferentes.",
          },
          {
            type: "bullets",
            items: [
              "Actividad principal y servicios accesorios.",
              "Situación y antecedentes del local.",
              "Obras nuevas o previas.",
              "Necesidad de intervención técnica.",
              "Otros permisos sectoriales que puedan corresponder.",
            ],
          },
        ],
      },
      {
        title: "Evita una falsa equivalencia",
        blocks: [
          {
            type: "callout",
            title: "El nombre no determina el procedimiento",
            text: "Consulta el catálogo de trámites y la información oficial del municipio para conocer la vía aplicable.",
          },
        ],
      },
    ],
    relatedPaths: [
      "/recursos/licencia-de-actividad",
      "/recursos/declaracion-responsable",
      "/recursos/como-abrir-un-negocio-en-un-local",
    ],
    indexable: true,
  },
  {
    path: "/recursos/licencia-actividad-vs-declaracion-responsable",
    title: "Licencia de actividad vs declaración responsable | Locapto",
    description:
      "Compara licencia y declaración responsable sin asumir que el mismo procedimiento se aplica a todas las actividades o municipios.",
    eyebrow: "Comparativa",
    heading:
      "Licencia de actividad o declaración responsable: la diferencia depende del procedimiento aplicable.",
    intro:
      "No son dos etiquetas intercambiables. Representan formas de intervención administrativa distintas y deben interpretarse en el contexto de la actividad y el municipio.",
    kind: "article",
    sections: [
      {
        title: "La diferencia esencial",
        blocks: [
          {
            type: "paragraph",
            text: "Una licencia suele implicar una resolución administrativa previa. Una declaración responsable se apoya en la manifestación del interesado y en la disponibilidad de documentación, sin impedir controles posteriores. El alcance exacto debe comprobarse en el trámite oficial.",
          },
        ],
      },
      {
        title: "Lo que no cambia",
        blocks: [
          {
            type: "bullets",
            items: [
              "La actividad debe ser compatible con el emplazamiento.",
              "El local debe cumplir las condiciones exigibles.",
              "La documentación debe ser veraz y suficiente.",
              "Pueden existir controles, inspecciones y requerimientos posteriores.",
            ],
          },
        ],
      },
      {
        title: "Cómo decidir qué investigar",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Normaliza la actividad",
                text: "Evita nombres comerciales ambiguos.",
              },
              {
                title: "Localiza el trámite municipal",
                text: "Comprueba supuestos, exclusiones y documentación.",
              },
              {
                title: "Revisa el local",
                text: "Valida los condicionantes técnicos antes de asumir que una vía es suficiente.",
              },
            ],
          },
        ],
      },
    ],
    relatedPaths: [
      "/recursos/licencia-de-actividad",
      "/recursos/declaracion-responsable",
      "/cobertura",
    ],
    indexable: true,
  },
  {
    path: "/recursos/que-comprobar-antes-de-alquilar-un-local",
    title: "Qué comprobar antes de alquilar un local | Locapto",
    description:
      "Lista de preguntas para investigar actividad, uso, obras, instalaciones y trámites antes de comprometerte con un local.",
    eyebrow: "Antes de firmar",
    heading: "Qué comprobar antes de alquilar un local para tu negocio.",
    intro:
      "El contrato, la reforma y el calendario pueden verse afectados por condiciones que no se aprecian en una visita comercial.",
    kind: "article",
    sections: [
      {
        title: "Sobre la actividad",
        blocks: [
          {
            type: "bullets",
            items: [
              "Define con precisión qué se hará en el local.",
              "Incluye venta, elaboración, atención al público y servicios accesorios.",
              "Comprueba si existen requisitos sectoriales adicionales.",
            ],
          },
        ],
      },
      {
        title: "Sobre el inmueble",
        blocks: [
          {
            type: "bullets",
            items: [
              "Uso y antecedentes conocidos.",
              "Superficie, distribución, accesos y desniveles.",
              "Ventilación, salida de humos, potencia e instalaciones.",
              "Obras necesarias y autorizaciones relacionadas.",
              "Limitaciones del edificio, comunidad o contrato.",
            ],
          },
        ],
      },
      {
        title: "Antes de comprometer dinero",
        blocks: [
          {
            type: "callout",
            title: "Introduce condiciones en la decisión",
            text: "Cuando exista incertidumbre, busca asesoramiento técnico y jurídico para valorar plazos, condiciones contractuales y viabilidad.",
          },
        ],
      },
    ],
    relatedPaths: [
      "/recursos/como-abrir-un-negocio-en-un-local",
      "/para-empresas",
      "/cobertura",
    ],
    indexable: true,
  },
  {
    path: "/recursos/como-abrir-un-negocio-en-un-local",
    title: "Cómo abrir un negocio en un local: pasos iniciales | Locapto",
    description:
      "Ordena la investigación inicial de actividad, local, obras, trámites y documentación antes de abrir un negocio.",
    eyebrow: "Guía inicial",
    heading:
      "Cómo abrir un negocio en un local sin empezar por el formulario equivocado.",
    intro:
      "Una apertura combina decisiones comerciales, técnicas y administrativas. Ordenarlas reduce retrabajo y ayuda a detectar dependencias antes.",
    kind: "article",
    sections: [
      {
        title: "Secuencia de investigación",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "1. Define la actividad",
                text: "Describe el funcionamiento real, no sólo el nombre comercial.",
              },
              {
                title: "2. Comprueba la ubicación",
                text: "Investiga el uso, antecedentes y condicionantes conocidos.",
              },
              {
                title: "3. Delimita las obras",
                text: "Separa adecuación, instalaciones y cambios que requieran intervención.",
              },
              {
                title: "4. Identifica trámites",
                text: "Consulta las vías municipales y sectoriales aplicables.",
              },
              {
                title: "5. Prepara documentación",
                text: "Reúne la información y los documentos exigidos para el caso concreto.",
              },
            ],
          },
        ],
      },
      {
        title: "Coordina antes de ejecutar",
        blocks: [
          {
            type: "paragraph",
            text: "Los pasos no siempre son lineales. Una comprobación del local puede cambiar la obra prevista, y una actividad más precisa puede cambiar el procedimiento. Mantén visibles las dependencias y las preguntas pendientes.",
          },
        ],
      },
      {
        title: "Qué puede aportar una precalificación",
        blocks: [
          {
            type: "bullets",
            items: [
              "Un procedimiento probable para investigar.",
              "Una lista inicial de requisitos y documentos.",
              "Variables que pueden cambiar la respuesta.",
              "Fuentes oficiales para continuar la verificación.",
            ],
          },
        ],
      },
    ],
    relatedPaths: [
      "/recursos/que-comprobar-antes-de-alquilar-un-local",
      "/como-funciona",
      "/cobertura",
    ],
    indexable: true,
  },
  {
    path: "/aviso-legal",
    title: "Aviso legal | Locapto",
    description:
      "Información legal sobre el sitio web de Locapto y las condiciones generales de uso.",
    eyebrow: "Información legal",
    heading: "Aviso legal",
    intro:
      "Información general sobre la titularidad y el uso de este sitio web.",
    kind: "legal",
    sections: [
      {
        title: "Titular del sitio",
        blocks: [
          {
            type: "callout",
            title: "PENDIENTE DE CONFIRMACIÓN LEGAL",
            text: "Razón social o nombre del titular, NIF, domicilio, correo de contacto y datos registrales, cuando correspondan.",
          },
        ],
      },
      {
        title: "Finalidad y alcance",
        blocks: [
          {
            type: "paragraph",
            text: "Este sitio informa sobre el producto Locapto y permite solicitar acceso a una beta privada. El contenido es informativo y preliminar; no constituye una licencia, autorización municipal ni asesoramiento profesional individualizado.",
          },
        ],
      },
      {
        title: "Uso del contenido",
        blocks: [
          {
            type: "paragraph",
            text: "La persona usuaria debe contrastar la información aplicable a su actividad y ubicación y obtener la revisión profesional o administrativa necesaria.",
          },
        ],
      },
    ],
    relatedPaths: ["/privacidad", "/cookies", "/cobertura"],
    indexable: true,
  },
  {
    path: "/privacidad",
    title: "Política de privacidad | Locapto",
    description:
      "Consulta cómo se utilizan los datos enviados para gestionar solicitudes de acceso beta a Locapto.",
    eyebrow: "Privacidad",
    heading: "Política de privacidad",
    intro:
      "Esta política describe el tratamiento previsto para las solicitudes de acceso beta y el uso del sitio.",
    kind: "legal",
    sections: [
      {
        title: "Responsable",
        blocks: [
          {
            type: "callout",
            title: "PENDIENTE DE CONFIRMACIÓN LEGAL",
            text: "Identidad completa del responsable, NIF, domicilio y canal para ejercer derechos.",
          },
        ],
      },
      {
        title: "Datos y finalidad",
        blocks: [
          {
            type: "paragraph",
            text: "Tratamos el email profesional, perfil, datos opcionales de contacto y contexto de atribución para gestionar la solicitud, conocer el tipo de uso esperado y priorizar la beta. No solicitamos direcciones IP ni suscribimos automáticamente a comunicaciones comerciales.",
          },
        ],
      },
      {
        title: "Conservación, base jurídica y derechos",
        blocks: [
          {
            type: "callout",
            title: "PENDIENTE DE VALIDACIÓN LEGAL",
            text: "Confirmar base jurídica, plazo de conservación, destinatarios, transferencias y procedimiento de ejercicio de derechos antes del lanzamiento definitivo.",
          },
        ],
      },
      {
        title: "Proveedores",
        blocks: [
          {
            type: "paragraph",
            text: "La infraestructura prevista utiliza Vercel para alojar el sitio y Google Sheets/Apps Script como almacén inicial de solicitudes. Las herramientas de medición opcionales sólo se cargan según la preferencia de cookies.",
          },
        ],
      },
    ],
    relatedPaths: ["/cookies", "/aviso-legal", "/cobertura"],
    indexable: true,
  },
  {
    path: "/cookies",
    title: "Política de cookies | Locapto",
    description:
      "Información sobre almacenamiento necesario, analítica opcional y preferencias de cookies en Locapto.",
    eyebrow: "Cookies",
    heading: "Política de cookies",
    intro:
      "La medición y el marketing están desactivados hasta que la persona visitante elige su preferencia.",
    kind: "legal",
    sections: [
      {
        title: "Almacenamiento necesario",
        blocks: [
          {
            type: "paragraph",
            text: "Utilizamos almacenamiento local o de sesión para conservar la preferencia de cookies, la atribución inicial de la visita y el identificador temporal necesario para completar el formulario.",
          },
        ],
      },
      {
        title: "Analítica y marketing opcionales",
        blocks: [
          {
            type: "paragraph",
            text: "Google Analytics, Google Tag Manager, Google Ads o LinkedIn sólo se cargarán cuando exista el consentimiento correspondiente y sus identificadores estén configurados.",
          },
        ],
      },
      {
        title: "Cambiar la preferencia",
        blocks: [
          {
            type: "paragraph",
            text: "La configuración puede reabrirse desde el enlace “Configurar cookies” del pie de página.",
          },
          {
            type: "callout",
            title: "PENDIENTE DE VALIDACIÓN LEGAL",
            text: "Completar inventario, duraciones y terceros cuando se activen etiquetas reales.",
          },
        ],
      },
    ],
    relatedPaths: ["/privacidad", "/aviso-legal", "/recursos"],
    indexable: true,
  },
];

export const pageByPath = new Map(publicPages.map((page) => [page.path, page]));

export const pageLabel = (path: string) =>
  pageByPath.get(path)?.heading ?? path;
