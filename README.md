# Locapto landing

Public Spanish website for Locapto: SEO, demand validation, campaign landing pages and qualified beta-lead capture. This repository is independent from the regulatory platform and product application.

It does **not** contain authentication, a customer dashboard, regulatory evaluation, billing, Stripe, a CRM or a database.

## Local development

Requirements: Node.js 20.9 or newer and pnpm.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Quality commands:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test
pnpm build
```

`pnpm test` runs Vitest and the Playwright smoke suite. Playwright starts the site on port 3000 and mocks `/api/beta` so tests never write to the real Sheet.

## Environment variables

| Variable                          | Required          | Purpose                                                  |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`            | Yes in production | Canonical origin; use `https://locapto.com`.             |
| `INDEX_MUNICIPALITY_ACTIVITIES`   | Optional          | Set `false` to noindex and desitemap final combinations. |
| `GOOGLE_SHEETS_WEBHOOK_URL`       | For live form     | Server-only Apps Script deployment URL.                  |
| `GOOGLE_SHEETS_WEBHOOK_SECRET`    | For live form     | Server-only shared webhook secret.                       |
| `ZOHO_SMTP_HOST`                  | For confirmation  | Account-specific Zoho SMTP server.                       |
| `ZOHO_SMTP_PORT`                  | Optional          | SMTP port; defaults to `465` with SSL.                   |
| `ZOHO_SMTP_USER`                  | For confirmation  | Zoho mailbox; use `victor@locapto.com`.                  |
| `ZOHO_SMTP_PASSWORD`              | For confirmation  | Server-only Zoho password or app password.               |
| `ZOHO_FROM_EMAIL`                 | Optional          | Sender; defaults to `Locapto <ZOHO_SMTP_USER>`.          |
| `ZOHO_REPLY_TO`                   | Optional          | Reply address; defaults to `ZOHO_SMTP_USER`.             |
| `EMAIL_CONFIRMATION_SECRET`       | For confirmation  | Random secret used to sign 30-day confirmation links.    |
| `NEXT_PUBLIC_GTM_ID`              | Optional          | Google Tag Manager container.                            |
| `NEXT_PUBLIC_GA_ID`               | Optional          | Direct Google Analytics fallback when GTM is absent.     |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | Optional          | LinkedIn Insight Tag.                                    |

Never prefix the webhook URL or secret with `NEXT_PUBLIC_`.

## Beta form

Step 1 sends email, persona and first-touch attribution to `POST /api/beta`. The server generates a UUID, writes a `partial` lead immediately and schedules an idempotent confirmation email after the response. Step 2 reuses that UUID and updates the same row to `complete`.

The route validates with Zod, enforces same-origin requests, caps values, escapes spreadsheet formulas, uses an eight-second webhook timeout and logs no form PII. Apps Script repeats validation and sanitization and uses `LockService` for concurrent upserts.

Confirmation links open `/confirmar-email` and require a POST from that page, so mail security scanners cannot confirm an address merely by following the link. Zoho SMTP acceptance and immediate failures are written to the same lead row. Open tracking is intentionally disabled.

See [docs/BETA_LEADS.md](docs/BETA_LEADS.md) for the operating workflow and [docs/google-apps-script.gs](docs/google-apps-script.gs) for the copy-ready webhook.

## Google Sheet and Apps Script

1. Create a Google Spreadsheet named `Locapto — Beta Leads` with a `Beta Leads` tab.
2. Use the exact headers documented in `docs/google-apps-script.gs`.
3. Open **Extensions → Apps Script** and paste that file.
4. Add Script Properties `SPREADSHEET_ID` and `WEBHOOK_SECRET`.
5. Run `setup()` and authorize it.
6. Deploy as a Web app, execute as owner and allow webhook invocation.
7. Copy its deployment URL and secret into Vercel's server environment.
8. Submit a real test through the deployed website and verify a single row is updated from `partial` to `complete`.

For confirmation email setup, configure the Zoho SMTP variables and `EMAIL_CONFIRMATION_SECRET` in Vercel Production. Use the exact outgoing server shown in Zoho Mail account settings; this project defaults to port `465` with SSL. Standard Zoho Mail SMTP records provider acceptance or an immediate failure, but does not provide delivery webhooks.

## Attribution and advertising

The first page load stores UTMs, landing variant, initial path and referrer in session storage. Internal navigation never overwrites first-touch data. Suggested campaigns include:

- `utm_source=google&utm_campaign=google_apertura_espana`
- `utm_source=linkedin&utm_campaign=linkedin_gestorias`
- `utm_source=linkedin&utm_campaign=linkedin_tecnicos`
- `utm_source=linkedin&utm_campaign=linkedin_empresas`

Analytics and marketing scripts remain disabled until the corresponding consent. GTM takes precedence over direct GA to prevent duplicate Google measurement. Event payloads accept no email, name or company.

Events: `page_view`, `cta_beta_click`, `example_result_view`, `beta_form_view`, `beta_step1_submit`, `beta_step1_success`, `beta_step2_submit`, `beta_complete`, `pricing_view`, `pricing_cta_click`.

## SEO content

`src/content/pages.ts` is the source of truth for public editorial pages. The typed territorial and activity catalogs are exported by `src/content/programmatic.ts`; route resolution lives under `src/content/seo/`.

The national, community, province and activity hierarchy is pre-rendered. Municipality pages are generated on first request and cached until the next deployment. Builds and visits read only the committed INE catalog and never download official data or call the regulatory platform.

The root sitemap contains editorial and territorial directory URLs. Each activity has a separate XML sitemap under `/sitemaps/{actividad}`. Set `INDEX_MUNICIPALITY_ACTIVITIES=false` to remove final municipality × activity combinations from those sitemaps and apply `noindex,follow` in one deployment.

See [docs/TERRITORIAL_SEO.md](docs/TERRITORIAL_SEO.md) for activity selection status, annual INE updates, editorial rules, sitemap operation and Search Console review.

Campaign pages under `/lp/` and `/gracias` are always noindex and excluded from the sitemap.

## User-facing copy

Lead with the user's goal and use plain Spanish. Describe the product as a way to understand the likely process, requirements, missing information and official sources before opening a business. Benefit lists near conversion forms should describe product outputs rather than form mechanics. Avoid internal labels such as “beta privada”, “lead”, “validación” or “priorización” in visible copy. Until the product launches, conversion messages must say that the visitor is requesting a future availability notice, not immediate access.

The header, footer and app icons use the official high-resolution PNG assets from the Locapto “Logos” database in Notion. Keep the supplied lettering intact: use `public/brand/full-logo-colors.png` on light surfaces, `public/brand/full-logo-white.png` on dark surfaces and the standalone official icon for favicons. The tab icon is available as both `src/app/favicon.ico` and `src/app/icon.png`; update the version in root metadata when replacing either asset so browsers do not keep a stale favicon.

## Product preview

The hero preview tells a one-time CSS animation story: Locapto consults official sources, identifies the likely process, shows what the premises must comply with, reveals the recommended steps and finishes with the sources used. Its “Revisar fuente oficial” labels are intentionally non-interactive in the marketing demonstration: keep them as plain text with the default cursor until real result URLs exist. The final state remains visible and all content exists in the HTML. Keep the reduced-motion fallback immediate and complete when changing this component.

The three professional audience pages use tailored two-column heroes. Keep their preview-card content specific to each audience in `src/components/ContentPage.tsx`, while preserving the shared layout and future-availability CTA.

Related-resource cards use short editorial labels and categories defined in `src/components/ContentPage.tsx`; do not fall back to full page headings when a concise card title is available.

Article sidebars use a dedicated full-width CTA layout with a balanced label and a separate arrow container. Keep this treatment instead of applying the generic horizontal button unchanged inside narrow cards.

The shared footer closes every page with the future-availability CTA, grouped navigation and legal controls. Preserve its dark treatment, white brand asset and nationwide availability wording.

## Pricing experiment

The professional price test lives in `src/config/marketing.ts`:

```ts
professionalPricingExperimentEnabled: false,
professionalBetaPrice: 149,
```

Enable it only for an intentional experiment. It appears solely on `/lp/gestorias`, never charges a user, and records view and click context with the lead.

## Deploy to Vercel

Import the private `Locapto/landing` repository in Vercel, configure all production environment variables, validate the preview, then attach `locapto.com`. Use the DNS records shown by Vercel, redirect `www` to the apex and preserve unrelated MX/TXT records.

Vercel's Git integration should create previews for branches and publish `main` to production.

## Legal and brand placeholders

Official logo assets are reused from the existing Locapto web repository. The legal pages explain in user-facing language that controller identity, NIF, address, legal basis, retention and the detailed cookie inventory are still being prepared. Complete and validate those details before treating the legal text as final advice.
