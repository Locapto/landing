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

| Variable                          | Required          | Purpose                                              |
| --------------------------------- | ----------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`            | Yes in production | Canonical origin; use `https://locapto.com`.         |
| `GOOGLE_SHEETS_WEBHOOK_URL`       | For live form     | Server-only Apps Script deployment URL.              |
| `GOOGLE_SHEETS_WEBHOOK_SECRET`    | For live form     | Server-only shared webhook secret.                   |
| `NEXT_PUBLIC_GTM_ID`              | Optional          | Google Tag Manager container.                        |
| `NEXT_PUBLIC_GA_ID`               | Optional          | Direct Google Analytics fallback when GTM is absent. |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | Optional          | LinkedIn Insight Tag.                                |

Never prefix the webhook URL or secret with `NEXT_PUBLIC_`.

## Beta form

Step 1 sends email, persona and first-touch attribution to `POST /api/beta`. The server generates a UUID and writes a `partial` lead immediately. Step 2 reuses that UUID and updates the same row to `complete`.

The route validates with Zod, enforces same-origin requests, caps values, escapes spreadsheet formulas, uses an eight-second webhook timeout and logs no form PII. Apps Script repeats validation and sanitization and uses `LockService` for concurrent upserts.

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

## Attribution and advertising

The first page load stores UTMs, landing variant, initial path and referrer in session storage. Internal navigation never overwrites first-touch data. Suggested campaigns include:

- `utm_source=google&utm_campaign=google_madrid_apertura`
- `utm_source=linkedin&utm_campaign=linkedin_gestorias`
- `utm_source=linkedin&utm_campaign=linkedin_tecnicos`
- `utm_source=linkedin&utm_campaign=linkedin_empresas`

Analytics and marketing scripts remain disabled until the corresponding consent. GTM takes precedence over direct GA to prevent duplicate Google measurement. Event payloads accept no email, name or company.

Events: `page_view`, `cta_beta_click`, `example_result_view`, `beta_form_view`, `beta_step1_submit`, `beta_step1_success`, `beta_step2_submit`, `beta_complete`, `pricing_view`, `pricing_cta_click`.

## SEO content

`src/content/pages.ts` is the source of truth for public editorial pages and the sitemap. Each page has unique metadata, one H1, related links and typed content blocks.

Future municipality/activity pages use `src/content/programmatic.ts`. Only entries with `indexable: true` may be generated, linked or included in the sitemap. Do not enable a page until its municipality-specific content, official sources and review date are complete.

Campaign pages under `/lp/` and `/gracias` are always noindex and excluded from the sitemap.

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

Official logo assets are reused from the existing Locapto web repository. The legal pages intentionally mark controller identity, NIF, address, legal basis, retention and detailed cookie inventory as pending founder/legal confirmation. Resolve those markers before treating the legal text as final advice.
