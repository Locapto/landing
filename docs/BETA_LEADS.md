# Beta leads

Google Sheets is the initial lightweight lead store. It is deliberately not a CRM or product database.

## Workbook

- Spreadsheet: `Locapto — Beta Leads`
- Tab: `Beta Leads`
- The header order must remain aligned with `docs/google-apps-script.gs`.
- Do not store IP addresses or copy personal data into analytics platforms.

## Recommended workflow

Filter `persona = Gestoría / asesoría`, then sort `lead_score` descending. This surfaces the most relevant professional prospects first.

Recommended filter views:

- Gestorías
- Arquitectura / ingeniería
- Otros perfiles
- 3+ expedientes
- 10+ expedientes
- Google Ads
- LinkedIn Ads
- Pricing test
- Qualified

`partial` means Step 1 was saved. `complete` means the visitor submitted the optional Step 2. A partial lead must not be discarded merely because Step 2 is empty.

Email columns record the SMTP message ID, the latest status and timestamps for sent, confirmed or immediately failed messages. `confirmed` is an explicit action on `locapto.com`; the system does not use an invisible open-tracking pixel. Standard Zoho Mail SMTP does not populate `email_delivered_at`.

## Scoring

Scoring is calculated by the Vercel server in `src/lib/leads/scoring.ts`. A lead is qualified only when it is complete, belongs to a professional persona, and reports at least 3 cases per month.

## Sheet and Apps Script setup

1. Create or open `Locapto — Beta Leads`.
2. Confirm the tab is named `Beta Leads` and contains the documented headers.
3. Open **Extensions → Apps Script**.
4. Paste `docs/google-apps-script.gs`.
5. Open **Project Settings → Script Properties** and set `SPREADSHEET_ID` and a generated `WEBHOOK_SECRET`.
6. Run `setup()` once and authorize the script.
7. Choose **Deploy → New deployment → Web app**.
8. Execute as the owner and allow webhook invocation by anyone; the shared secret protects the endpoint.
9. Copy the deployment URL to Vercel as `GOOGLE_SHEETS_WEBHOOK_URL` and the same secret as `GOOGLE_SHEETS_WEBHOOK_SECRET`.
10. Submit a synthetic test lead and verify that Step 2 updates the same row.

Run `setup()` again whenever the documented header list changes. It expands the
sheet when new columns are required and keeps existing rows intact. The email
confirmation version adds `email_provider_id`, `email_status`, `email_sent_at`,
`email_delivered_at`, `email_confirmed_at` and `email_failed_at`.

The browser keeps a UUID only while an unfinished lead is in progress. Invalid
identifiers left by an older session are discarded before the first save.
Legacy first-touch attribution using `pagePath` is migrated to `landingPage`
without discarding its UTMs or click IDs. The API also accepts that legacy field
and defaults a missing landing path to `/` for tabs opened before a deployment.

The launch-interest version also stores activity, municipality, optional company
website, lead type/source, first-touch UTMs, Google/Microsoft/LinkedIn click IDs,
landing page and referrer. Publish a new Apps Script deployment after updating
the headers; changing the repository file does not update the live script.

## Confirmation email

1. Confirm the exact outgoing server in **Zoho Mail → Settings → Mail Accounts → Server Configuration Details**.
2. Set `ZOHO_SMTP_HOST`, `ZOHO_SMTP_PORT`, `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASSWORD`, `ZOHO_FROM_EMAIL`, `ZOHO_REPLY_TO` and `EMAIL_CONFIRMATION_SECRET` in Vercel Production.
3. Use port `465` with SSL or port `587` with TLS. The code selects SSL automatically for port `465`.
4. The signed email link confirms idempotently and redirects to a noindex Locapto result page without requiring a second click.
5. Send one real test and verify the row progresses from `sent` to `confirmed`. An SMTP authentication or recipient rejection is recorded as `failed`.

The transactional template uses the public PNG at `/brand/full-logo-colors.png` for broad email-client compatibility. Keep that path stable or update the template before replacing the asset.

Never commit the spreadsheet ID, webhook URL, or secret.
