# Territorial SEO directory

This feature belongs only to the public `landing` repository. It does not call, change or expand the regulatory platform.

## Activity selection

Selection date: 2026-08-31.

Current result: restaurant, bar, hotel, tobacconist, pharmacy, clothing shop, gym, nightclub, supermarket and estate agency (`restaurante`, `bar`, `hotel`, `estanco`, `farmacia`, `tienda-de-ropa`, `gimnasio`, `discoteca`, `supermercado`, `inmobiliaria`).

The selection uses [Google Trends for Spain](https://trends.google.com/trends/explore?date=today%205-y&geo=ES), web search and the last five years. It compares explicit physical-business opening queries in batches with a shared anchor. Trends scores are relative within each comparison, so values from unrelated batches must not be compared as absolute search volumes.

Recorded evidence:

| Comparison                 | Relative averages                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Main food and retail batch | `abrir un bar` 19; `abrir restaurante` 34; `abrir farmacia` 5; `abrir supermercado` 1; `abrir tienda de ropa` 2        |
| Services and leisure batch | `abrir un bar` 19; `abrir gimnasio` 4; `abrir discoteca` 2; `abrir inmobiliaria` 1; `abrir estanco` 4                  |
| Exact-phrase validation    | `abrir un bar` 19; `abrir un hotel` 1; `abrir un supermercado` 1; `abrir una farmacia` 1; `abrir una tienda de ropa` 1 |
| Twelve-month tie-break     | `abrir academia` 1; `abrir inmobiliaria` 3; `abrir cafetería` 1; `abrir clínica dental` 0; `abrir taller mecánico` 0   |

Generic `abrir tienda` was excluded because its related searches were dominated by Shopify and Etsy. The article-free `abrir bar` was excluded because of Xbox Game Bar, and broad `abrir hotel` because its related searches were unrelated; only the explicit `abrir un hotel` signal was accepted. Café, hairdresser, beauty centre, dental clinic, mechanical workshop, bakery, nursery and veterinary clinic had zero or weaker comparable signal.

Search Console should validate or revise this selection once the site has enough first-party traffic. Do not commit a Search Console export; record only the aggregated decision, date, sources and test update.

## Annual INE update

The committed catalog is the INE list effective 2026-01-01, published 2026-02-04. It contains 19 autonomous communities/cities, 52 provinces and 8,132 municipalities with five-digit codes.

Run the manual updater from this repository:

```bash
pnpm data:geography
```

The Python script uses only the standard library, downloads the official municipality workbook and community/province table into a temporary directory, validates the hierarchy and writes `src/data/geography-catalog.json`. Update the version, publication date and official workbook URL in the script for a new annual release. Review INE in-year name changes before deployment. The application build never runs this updater.

After regeneration, run the full quality suite and manually inspect an accent, `ñ`, inverted article, homonym and renamed municipality. A URL with a valid code and stale name must redirect permanently to the current canonical slug.

## Editorial rules

- Start final pages with a direct, self-contained answer.
- State only general requirements supported by the visible official sources.
- Never invent a municipal procedure or imply that a generic page resolves a case.
- If no municipal source has been reviewed, say so and link to the official public-administration directory.
- Keep compatibility of a specific address, premises conditions, personalized documents, traceable reports and change monitoring reserved for Locapto.
- Show the municipality, province, community, INE code, review date, preliminary-information notice and future-availability CTA.
- Do not add `HowTo` or `FAQPage` structured data. Programmatic pages use `WebPage`, `BreadcrumbList` and, for directories, `ItemList`.

## Sitemaps and crawl controls

`/sitemap.xml` is the stable sitemap index. It separates static pages, resources, activity hubs and territorial hubs. Activity + municipality URLs remain available but are excluded while they return `noindex,follow`; reviewed local guides will use paginated sitemaps when any exist.

`robots.txt` lists only `/sitemap.xml`, allows public crawlers through the general rule and explicitly allows `OAI-SearchBot`. Do not add `llms.txt` in this version.

Indexability is editorial, not environment-controlled. Add a route to the reviewed local evidence registry only after validating a differential local fact and an official territorial source.

## Search Console operation

After deployment, submit only `/sitemap.xml`. Inspect `/abrir-negocio`, one activity page, one community page, one province page and several final municipality pages.

Review at 2, 4 and 8 weeks:

- indexed URLs and sitemap processing;
- “Crawled — currently not indexed” and “Discovered — currently not indexed”;
- duplicate/canonical reports;
- impressions, clicks and CTR by activity and territory;
- organic `generate_lead` conversions using the stored landing attribution;
- referrals from `chatgpt.com`;
- signs of scaled-content classification.

If quality or indexing deteriorates, revise the central policy, activity content and source coverage without deleting routes.
