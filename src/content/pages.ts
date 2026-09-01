import type { PublicPageDefinition } from "./types";

export const publicPages: PublicPageDefinition[] = [
  {
    path: "/para-gestorias",
    title: "Locapto para gestorías | Prepara aperturas con fuentes oficiales",
    description:
      "Reduce búsquedas repetitivas en expedientes de apertura. Organiza trámites, requisitos y fuentes oficiales con Locapto.",
    eyebrow: "Para gestorías y asesorías",
    heading: "Empieza cada expediente con la información ya ordenada.",
    intro:
      "Locapto reunirá el procedimiento probable, los documentos habituales y las fuentes oficiales para evitar reconstruir la misma investigación en cada apertura.",
    kind: "audience",
    sections: [
      {
        title: "Una primera revisión más ordenada",
        blocks: [
          {
            type: "paragraph",
            text: "Los requisitos de una apertura suelen estar repartidos entre trámites, ordenanzas, formularios y sedes electrónicas. Locapto los organizará alrededor de una actividad y una ubicación concretas.",
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
                title: "Conserva las fuentes",
                text: "Localiza la fuente oficial que respalda cada orientación inicial.",
              },
            ],
          },
          {
            type: "callout",
            title: "Información inicial",
            text: "Locapto no concede licencias ni sustituye la revisión profesional o administrativa que corresponda.",
          },
        ],
      },
    ],
    relatedPaths: [
      "/como-funciona",
      "/recursos",
      "/recursos/licencia-actividad-vs-declaracion-responsable",
    ],
    indexable: true,
  },
  {
    path: "/para-arquitectos-ingenieros",
    title:
      "Locapto para arquitectos e ingenieros | Revisión inicial de locales",
    description:
      "Detecta posibles obstáculos de la actividad y el local antes de dedicar horas a un estudio o proyecto completo.",
    eyebrow: "Para arquitectura e ingeniería",
    heading: "Detecta antes qué puede cambiar la viabilidad del local.",
    intro:
      "Revisa el trámite probable, las obras, las instalaciones y los puntos técnicos pendientes antes de entrar en el estudio completo.",
    kind: "audience",
    sections: [
      {
        title: "Llegar antes a las preguntas importantes",
        blocks: [
          {
            type: "paragraph",
            text: "Una dirección y una actividad no bastan para concluir la viabilidad. Locapto separará lo que pueda orientarse con fuentes oficiales de aquello que necesite comprobación técnica o municipal.",
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
            text: "La revisión inicial ayuda a ordenar la primera fase y a explicar riesgos al cliente. El estudio técnico, las visitas, mediciones y verificaciones exigibles siguen correspondiendo al profesional competente.",
          },
          {
            type: "callout",
            title: "Qué incluye el resultado",
            text: "La orientación identificará la ubicación, la actividad y las fuentes revisadas, además de los elementos que requieran comprobación profesional.",
          },
        ],
      },
    ],
    relatedPaths: [
      "/como-funciona",
      "/recursos",
      "/recursos/que-comprobar-antes-de-alquilar-un-local",
    ],
    indexable: true,
  },
  {
    path: "/para-empresas",
    title: "Locapto para empresas y cadenas | Evalúa locales antes de invertir",
    description:
      "Compara ubicaciones y detecta posibles obstáculos antes de alquilar, reformar o comprometer capital.",
    eyebrow: "Para empresas, cadenas y emprendedores",
    heading: "Compara locales con mejores datos antes de decidir.",
    intro:
      "Detecta riesgos, información pendiente y fuentes oficiales antes de alquilar, reformar o comprometer capital.",
    kind: "audience",
    sections: [
      {
        title: "Comparar con criterios consistentes",
        blocks: [
          {
            type: "paragraph",
            text: "Dos locales parecidos pueden conducir a trámites y necesidades diferentes. Una revisión inicial común facilita comparar ubicaciones sin confundir una orientación con una aprobación.",
          },
          {
            type: "bullets",
            items: [
              "Trámite probable por actividad y municipio.",
              "Factores que pueden cambiar la respuesta.",
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
      "/como-funciona",
      "/recursos/como-abrir-un-negocio-en-un-local",
      "/recursos/que-comprobar-antes-de-alquilar-un-local",
    ],
    indexable: true,
  },
  {
    path: "/como-funciona",
    title: "Cómo funciona Locapto | Revisión inicial de aperturas",
    description:
      "Conoce cómo Locapto estructura actividad, ubicación, requisitos, preguntas pendientes y fuentes oficiales.",
    eyebrow: "Cómo funciona",
    heading:
      "De una idea y una ubicación a una primera revisión con fuentes oficiales.",
    intro:
      "Locapto organizará la información inicial para mostrar qué parece aplicable, qué falta por saber y qué fuente oficial respalda cada orientación.",
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
                title: "3. Revisa la orientación",
                text: "Revisa el procedimiento probable, los requisitos, los documentos, las dudas pendientes y las fuentes oficiales.",
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
              "Actividad y servicios incluidos.",
              "Trámite administrativo más probable.",
              "Requisitos y documentación habituales.",
              "Administraciones y fuentes oficiales implicadas.",
              "Puntos clave, posibles obstáculos y datos no evaluados.",
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
      "/para-gestorias",
      "/recursos",
      "/recursos/licencia-de-actividad",
    ],
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
      "/como-funciona",
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
                title: "Guarda la documentación",
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
      "/para-gestorias",
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
                text: "Valida los factores técnicos antes de asumir que una vía es suficiente.",
              },
            ],
          },
        ],
      },
    ],
    relatedPaths: [
      "/recursos/licencia-de-actividad",
      "/recursos/declaracion-responsable",
      "/como-funciona",
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
      "/recursos/licencia-de-actividad",
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
                text: "Investiga el uso, los antecedentes y las condiciones conocidas.",
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
        title: "Qué puede aportar una primera revisión",
        blocks: [
          {
            type: "bullets",
            items: [
              "Un trámite probable para investigar.",
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
      "/recursos/licencia-de-actividad",
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
            type: "bullets",
            items: [
              "Titular: Víctor Saavedra.",
              "NIF: ES38872240D.",
              "Domicilio: Avinguda Jaume Recoder, 53, 08301 Mataró, Barcelona, España.",
              "Correo electrónico: victor@locapto.com.",
            ],
          },
        ],
      },
      {
        title: "Finalidad y alcance",
        blocks: [
          {
            type: "paragraph",
            text: "Este sitio informa sobre Locapto y permite apuntarse para recibir un aviso cuando el producto esté disponible. El contenido es informativo e inicial; no constituye una licencia, autorización municipal ni asesoramiento profesional individualizado.",
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
    relatedPaths: ["/privacidad", "/cookies", "/recursos"],
    indexable: true,
  },
  {
    path: "/privacidad",
    title: "Política de privacidad | Locapto",
    description:
      "Consulta cómo se utilizan los datos enviados para avisarte cuando Locapto esté disponible.",
    eyebrow: "Privacidad",
    heading: "Política de privacidad",
    intro:
      "Esta política explica cómo trataremos tus datos si solicitas que te avisemos cuando Locapto esté disponible.",
    kind: "legal",
    sections: [
      {
        title: "Responsable",
        blocks: [
          {
            type: "bullets",
            items: [
              "Responsable del tratamiento: Víctor Saavedra.",
              "NIF: ES38872240D.",
              "Domicilio: Avinguda Jaume Recoder, 53, 08301 Mataró, Barcelona, España.",
              "Contacto y ejercicio de derechos: victor@locapto.com.",
            ],
          },
        ],
      },
      {
        title: "Datos y finalidad",
        blocks: [
          {
            type: "paragraph",
            text: "Tratamos el email, el perfil, la actividad y ubicación opcionales, los datos profesionales que decidas añadir y la atribución de la primera visita —incluidos UTMs o identificadores publicitarios cuando existan— para gestionar el aviso, confirmar el correo y entender qué necesitas. Registramos el envío, los errores inmediatos y la confirmación del correo; no utilizamos píxeles de apertura, no solicitamos direcciones IP ni te suscribimos automáticamente a comunicaciones comerciales.",
          },
        ],
      },
      {
        title: "Conservación, base jurídica y derechos",
        blocks: [
          {
            type: "paragraph",
            text: "La base jurídica es el consentimiento que prestas al solicitar el aviso de disponibilidad. Conservaremos los datos mientras gestionemos la lista de espera y, como máximo, durante 24 meses desde la solicitud. Después los eliminaremos o anonimizaremos, salvo que exista otra relación o una obligación legal que justifique su conservación.",
          },
          {
            type: "bullets",
            items: [
              "Puedes retirar el consentimiento o solicitar el acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a victor@locapto.com.",
              "Los datos se utilizarán para gestionar la lista de avisos, confirmar el correo y comunicar la disponibilidad de Locapto; no se usarán para marketing general sin un consentimiento separado.",
              "Puedes presentar una reclamación ante la Agencia Española de Protección de Datos si consideras que el tratamiento no respeta la normativa aplicable.",
            ],
          },
        ],
      },
      {
        title: "Proveedores",
        blocks: [
          {
            type: "paragraph",
            text: "Utilizamos Vercel para alojar el sitio, Google Sheets y Apps Script para guardar inicialmente las solicitudes y Zoho Mail para enviar el correo de confirmación. Estos proveedores actúan como encargados del tratamiento y pueden realizar transferencias internacionales con las garantías previstas en sus condiciones y acuerdos de tratamiento. Las herramientas de medición opcionales solo se cargan según tu preferencia de cookies.",
          },
        ],
      },
    ],
    relatedPaths: ["/cookies", "/aviso-legal", "/recursos"],
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
      "Las estadísticas de uso y las herramientas de marketing están desactivadas hasta que eliges tus preferencias.",
    kind: "legal",
    sections: [
      {
        title: "Almacenamiento necesario",
        blocks: [
          {
            type: "paragraph",
            text: "Utilizamos almacenamiento local o de sesión para recordar tus preferencias de cookies, cómo llegaste al sitio y los datos temporales necesarios para completar el formulario.",
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
            title: "Información que completaremos antes del lanzamiento",
            text: "Publicaremos el inventario de cookies, su duración y los terceros implicados cuando se activen estas herramientas.",
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
