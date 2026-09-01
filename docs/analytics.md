# Analytics y atribución

## Configuración

La landing admite un contenedor mediante `NEXT_PUBLIC_GTM_ID` o, como fallback,
Google Analytics mediante `NEXT_PUBLIC_GA_ID`. Si ambos existen, GTM tiene
precedencia para evitar medición duplicada. LinkedIn usa
`NEXT_PUBLIC_LINKEDIN_PARTNER_ID` y pertenece a la categoría Marketing.

No añadas GTM mientras siga activa la integración directa de GA salvo que sea
una migración intencionada y validada.

## Consent Mode v2

La implementación usa modo básico. El `consent default` se define en el layout
raíz, antes de las etiquetas, con estos cuatro valores denegados:

- `analytics_storage`
- `ad_storage`
- `ad_user_data`
- `ad_personalization`

El gestor de consentimiento realiza `consent update` al restaurar o guardar una
decisión. Analítica controla `analytics_storage`; Marketing controla las tres
señales publicitarias. No se descarga ni se contacta con Google hasta que el
usuario concede la categoría correspondiente. La preferencia se guarda en
`localStorage` bajo `locapto_consent_v1`.

## Eventos

- `cta_click`: clic en el CTA de aviso.
- `form_start`: primera interacción con el formulario.
- `generate_lead`: conversión principal; solo tras confirmar el guardado del
  lead inicial y una vez por `leadId`.
- `form_error`: error de validación o almacenamiento.
- `persona_selected`, `activity_selected`, `municipality_selected`: señales
  opcionales y sin texto libre.

Los parámetros admitidos incluyen `lead_type=launch_interest`, `persona`,
`landing_page_type`, UTMs y, únicamente si están normalizados, actividad y
municipio. Nunca se envían email, nombre, empresa, teléfono, web ni contenido
libre.

## Atribución

La primera visita de la sesión conserva `utm_source`, `utm_medium`,
`utm_campaign`, `utm_content`, `utm_term`, `gclid`, `gbraid`, `wbraid`,
`msclkid`, `li_fat_id`, landing inicial y referrer. La navegación interna no
sobrescribe ese origen. Estos campos se guardan junto al lead, no como PII en
Google Analytics.

## Verificación

1. Abre Google Tag Assistant y conecta la URL de Preview/Production.
2. Antes de decidir, verifica los cuatro consentimientos como `denied` y que no
   existen peticiones a Google.
3. Acepta solo Analítica y confirma `analytics_storage=granted`; las señales de
   Ads deben seguir denegadas.
4. Acepta Marketing y confirma las tres señales publicitarias como `granted`.
5. Envía un lead de prueba. `generate_lead` debe aparecer una sola vez y solo
   después del 200 de `/api/beta`.
6. Activa DebugView en GA4 para revisar evento y parámetros. Marca
   `generate_lead` como evento clave/conversión en la propiedad de GA4.

Repite la prueba con rechazo, error de validación, error 5xx y doble clic. En
ningún caso debe enviarse `generate_lead`.
