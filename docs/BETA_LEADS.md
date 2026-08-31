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

Never commit the spreadsheet ID, webhook URL, or secret.
