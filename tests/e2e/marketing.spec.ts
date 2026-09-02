import { expect, test } from "@playwright/test";

async function mockBeta(page: import("@playwright/test").Page) {
  await page.route("**/api/beta", async (route) => {
    const body = route.request().postDataJSON() as { stage: string };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        leadId: "123e4567-e89b-42d3-a456-426614174000",
        status: body.stage,
        qualified: body.stage === "complete",
      }),
    });
  });
}

test("homepage loads and navigation works", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Descubre qué necesitas para abrir un negocio/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Locapto, inicio" }).first().locator("img"),
  ).toHaveAttribute("src", /full-logo-colors\.png/);
  await expect(page.locator('link[rel="shortcut icon"]')).toHaveAttribute(
    "href",
    "/favicon.ico?v=3",
  );
  await expect(page.getByText("Pasos para avanzar")).toBeVisible();
  await expect(page.getByText("Qué debe cumplir el local")).toBeVisible();
  await expect(page.getByText("Protección contra incendios")).toBeVisible();
  await expect(
    page
      .getByLabel(/Vista ilustrativa del formato futuro de Locapto/)
      .getByText("Fuentes oficiales relevantes"),
  ).toBeVisible();
  await expect(
    page.getByText("Revisar fuente oficial ↗", { exact: true }),
  ).toHaveCount(2);
  await expect(
    page.getByRole("link", { name: /Revisar fuente oficial/ }),
  ).toHaveCount(0);
  await expect(page.getByText("Ejemplo ilustrativo")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(
    /ámbito nacional|toda España|cobertura nacional|cualquier municipio|disponible en todos los municipios/i,
  );
  await expect(
    page.getByRole("heading", { level: 2, name: "¿Quieres que te avisemos?" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Enlaces del pie de página" }),
  ).toBeVisible();
  await expect(page.getByText("Pasos y documentos necesarios")).toBeVisible();
  await page
    .getByRole("link", { name: "Cómo funciona", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/como-funciona$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "primera revisión con fuentes oficiales",
  );
  const asideCta = page.locator(".aside-cta");
  await expect(asideCta).toBeVisible();
  await expect(asideCta).toContainText("Avísame cuando esté disponible");
});

test("professional pages have tailored product heroes", async ({ page }) => {
  const pages = [
    ["/para-gestorias", "Expediente organizado"],
    ["/para-arquitectos-ingenieros", "Revisión inicial del local"],
    ["/para-empresas", "Comparación inicial"],
  ] as const;

  for (const [path, cardLabel] of pages) {
    await page.goto(path);
    await expect(page.locator(".audience-page-hero")).toBeVisible();
    await expect(page.getByText(cardLabel)).toBeVisible();
    await expect(
      page
        .locator(".audience-page-hero")
        .getByRole("link", { name: /Avísame cuando esté disponible/ }),
    ).toBeVisible();
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/para-gestorias");
  await expect(
    page.getByRole("heading", { level: 3, name: "Cómo funciona Locapto" }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("availability CTA reaches form and validates Step 1", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Avísame cuando esté disponible/ })
    .first()
    .click();
  await expect(page.locator("#acceso-beta")).toBeInViewport();
  await page
    .getByRole("button", { name: "Avísame cuando esté disponible" })
    .click();
  await expect(page.locator("#email-error-home")).toContainText(
    "Introduce un email válido",
  );
  await expect(page.locator("#persona-error-home")).toContainText(
    "Selecciona tu perfil",
  );
});

test("other professional profile asks for an explanation", async ({ page }) => {
  await page.goto("/#acceso-beta");
  await page.getByLabel(/^Email/).fill("qa@example.com");
  await page.getByLabel(/Cuál es tu perfil/).selectOption("otro");
  const explanation = page.getByLabel(/Describe tu perfil/);
  await expect(explanation).toBeVisible();
  await page
    .getByRole("button", { name: "Avísame cuando esté disponible" })
    .click();
  await expect(page.locator("#other-persona-error-home")).toContainText(
    "Describe brevemente tu perfil",
  );
});

test("Step 1 saves before optional Step 2 and can be abandoned", async ({
  page,
}) => {
  await mockBeta(page);
  await page.goto("/#acceso-beta");
  await page.getByLabel(/^Email/).fill("qa@example.com");
  await page.getByLabel(/Cuál es tu perfil/).selectOption("gestoria");
  await page
    .getByRole("button", { name: "Avísame cuando esté disponible" })
    .click();
  await expect(page.getByText("El aviso ya está guardado")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Cuéntanos un poco más",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Omitir" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Gracias. Te avisaremos cuando Locapto esté disponible.",
    }),
  ).toBeVisible();
});

test("full availability form completes", async ({ page }) => {
  await mockBeta(page);
  await page.goto("/lp/gestorias#acceso-beta");
  await page.getByLabel(/^Email/).fill("qa@example.com");
  await page.getByLabel(/Cuál es tu perfil/).selectOption("gestoria");
  await page
    .getByRole("button", { name: "Avísame cuando esté disponible" })
    .click();
  await page.getByLabel("Nombre").fill("Prueba QA");
  await page.getByLabel("Empresa", { exact: true }).fill("Locapto QA");
  await page.getByLabel(/Cuántas aperturas/).selectOption("3-5");
  await page.getByLabel(/En qué ubicaciones/).fill("Madrid");
  await page.getByLabel("Revisar los requisitos de una actividad").check();
  await page.getByRole("button", { name: "Guardar respuestas" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Gracias. Te avisaremos cuando Locapto esté disponible.",
    }),
  ).toBeVisible();
});

test("slow lead storage blocks transition and duplicate submission", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const [input, init] = args;
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      if (!url.includes("/api/beta")) return originalFetch(...args);
      const body = JSON.parse(String(init?.body ?? "{}")) as {
        stage: string;
      };
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      return new Response(
        JSON.stringify({
          ok: true,
          leadId: "123e4567-e89b-42d3-a456-426614174000",
          status: body.stage,
          qualified: body.stage === "complete",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    };
  });
  await page.goto("/#acceso-beta");
  await page.getByLabel(/^Email/).fill("qa@example.com");
  await page.getByLabel(/Cuál es tu perfil/).selectOption("gestoria");
  await page
    .getByRole("button", { name: "Avísame cuando esté disponible" })
    .click();

  await expect(page.getByRole("button", { name: "Guardando…" })).toBeDisabled();
  await expect(
    page.getByRole("heading", { name: "Cuéntanos un poco más" }),
  ).not.toBeVisible({ timeout: 500 });
  await expect(
    page.getByRole("heading", { name: "Cuéntanos un poco más" }),
  ).toBeVisible();
  const save = page.getByRole("button", { name: "Guardar respuestas" });
  await expect(save).toBeEnabled();
  await save.click();

  await expect(page.getByRole("button", { name: "Guardando…" })).toBeDisabled();
  await expect(
    page.getByRole("heading", {
      name: "Gracias. Te avisaremos cuando Locapto esté disponible.",
    }),
  ).toBeVisible();
});

test("basic consent sends no Google request before an explicit choice", async ({
  page,
}) => {
  const googleRequests: string[] = [];
  page.on("request", (request) => {
    if (/googletagmanager\.com|google-analytics\.com/.test(request.url()))
      googleRequests.push(request.url());
  });

  await page.goto("/");
  await expect(
    page.getByRole("complementary", { name: "Preferencias de cookies" }),
  ).toBeVisible();
  expect(googleRequests).toHaveLength(0);
  expect(
    await page.evaluate(() =>
      (window.dataLayer ?? []).some((entry) => {
        const command = entry as unknown as ArrayLike<unknown>;
        return command[0] === "consent" && command[1] === "default";
      }),
    ),
  ).toBe(true);

  await page.getByRole("button", { name: "Configurar", exact: true }).click();
  await page.getByLabel("Analítica").check();
  expect(googleRequests).toHaveLength(0);
  await page.getByRole("button", { name: "Guardar configuración" }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem("locapto_consent_v1") ?? "{}"),
      ),
    )
    .toMatchObject({ analytics: true, marketing: false, decided: true });
});

test("generate_lead is emitted once and optional details do not repeat it", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "locapto_consent_v1",
      JSON.stringify({ analytics: true, marketing: false, decided: true }),
    );
    const events: Array<{ event: string }> = [];
    Object.assign(window, { __analyticsEvents: events });
    window.gtag = (command, event) => {
      if (command === "event") events.push({ event: String(event) });
    };
  });
  await mockBeta(page);
  await page.goto("/#acceso-beta");
  await page.getByLabel(/^Email/).fill("qa@example.com");
  await page.getByLabel(/Cuál es tu perfil/).selectOption("gestoria");
  await page
    .getByRole("button", { name: "Avísame cuando esté disponible" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Cuéntanos un poco más" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Guardar respuestas" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Gracias. Te avisaremos cuando Locapto esté disponible.",
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        (
          window as typeof window & {
            __analyticsEvents: Array<{ event: string }>;
          }
        ).__analyticsEvents.filter(({ event }) => event === "generate_lead")
          .length,
    ),
  ).toBe(1);
});

test("legacy attribution is migrated before submitting the lead", async ({
  page,
}) => {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      "locapto_first_touch_v1",
      JSON.stringify({
        utmSource: "linkedin",
        utmMedium: "referral",
        utmCampaign: "legacy-campaign",
        landingVariant: "home",
        pagePath: "/para-gestorias",
        referrer: "",
      }),
    );
  });
  let submittedLandingPage = "";
  await page.route("**/api/beta", async (route) => {
    const body = route.request().postDataJSON() as {
      landingPage: string;
      stage: string;
    };
    submittedLandingPage = body.landingPage;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        leadId: "123e4567-e89b-42d3-a456-426614174000",
        status: body.stage,
        qualified: false,
      }),
    });
  });
  await page.goto("/#acceso-beta");
  await page.getByLabel(/^Email/).fill("qa@example.com");
  await page.getByLabel(/Cuál es tu perfil/).selectOption("emprendedor");
  await page
    .getByRole("button", { name: "Avísame cuando esté disponible" })
    .click();

  await expect(
    page.getByRole("heading", {
      name: "Gracias. Te avisaremos cuando Locapto esté disponible.",
    }),
  ).toBeVisible();
  expect(submittedLandingPage).toBe("/para-gestorias");
});

test("activity and municipality context is prefilled and kept in session", async ({
  page,
}) => {
  await page.goto(
    "/?activity=Abrir%20un%20bar&activity_key=bar&municipality=Madrid&municipality_code=28079#acceso-beta",
  );
  await expect(page.getByLabel("¿Qué quieres abrir? (opcional)")).toHaveValue(
    "Abrir un bar",
  );
  await expect(page.getByLabel("¿Dónde? (opcional)")).toHaveValue("Madrid");
  await page
    .getByLabel("¿Qué quieres abrir? (opcional)")
    .fill("Abrir una cafetería");
  await page.goto("/#acceso-beta");
  await expect(page.getByLabel("¿Qué quieres abrir? (opcional)")).toHaveValue(
    "Abrir una cafetería",
  );
  await expect(page.getByLabel("¿Dónde? (opcional)")).toHaveValue("Madrid");
});

test("thank-you page is honest", async ({ page }) => {
  await page.goto("/gracias");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Gracias por tu interés en Locapto.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/en cuanto Locapto esté disponible/i),
  ).toBeVisible();
});

test("mobile menu is usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByLabel("Abrir menú").click();
  await expect(
    page.getByRole("navigation", { name: "Navegación móvil" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Navegación móvil" })
    .getByRole("link", { name: "Recursos" })
    .click();
  await expect(page).toHaveURL(/\/recursos$/);
});

test("representative viewports have no horizontal overflow", async ({
  page,
}) => {
  for (const width of [375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(1);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("home hero fits desktop and keeps the mobile CTA above the fold", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  const desktopHero = await page.locator(".hero-section").boundingBox();
  expect(desktopHero).not.toBeNull();
  expect(desktopHero!.y + desktopHero!.height).toBeLessThanOrEqual(721);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const mobileActions = await page.locator(".hero-actions").boundingBox();
  expect(mobileActions).not.toBeNull();
  expect(mobileActions!.y + mobileActions!.height).toBeLessThanOrEqual(844);
});

test("footer directory reaches a municipality activity page", async ({
  page,
}) => {
  await page.goto("/");
  const directory = page.getByRole("navigation", {
    name: "Directorios de actividades y comunidades",
  });
  await directory.getByRole("link", { name: "Madrid, Comunidad de" }).click();
  await expect(page).toHaveURL(/\/municipios\/comunidad-de-madrid$/, {
    timeout: 15_000,
  });
  await page
    .getByRole("link", { name: "Madrid 179 municipios", exact: true })
    .click();
  await expect(page).toHaveURL(/\/municipios\/comunidad-de-madrid\/madrid$/, {
    timeout: 15_000,
  });
  await page
    .getByRole("link", { name: "Madrid Código INE 28079", exact: true })
    .click();
  await expect(page).toHaveURL(
    /\/municipios\/comunidad-de-madrid\/madrid\/madrid-28079$/,
    { timeout: 15_000 },
  );
  await page
    .locator("main")
    .getByRole("link", {
      name: "Abrir un bar Requisitos, pasos y fuentes",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(
    /\/abrir-negocio\/bar\/comunidad-de-madrid\/madrid\/madrid-28079$/,
    { timeout: 15_000 },
  );
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Cómo abrir un bar en Madrid.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Fuentes oficiales consultadas")).toBeVisible();
  await expect(
    page
      .locator("main")
      .getByRole("link", { name: /Avísame cuando esté disponible/ }),
  ).toBeVisible();
});

test("municipality activity content renders without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const path = "/abrir-negocio/bar/comunidad-de-madrid/madrid/madrid-28079";
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    new URL(path, page.url()).toString(),
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex.*follow/,
  );
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Cómo abrir un bar en Madrid.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Información preliminar", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Fuentes oficiales consultadas")).toBeVisible();
  await context.close();
});

test("sitemap index exposes valid indexable sitemap partitions", async ({
  request,
}) => {
  const index = await request.get("/sitemap.xml");
  expect(index.status()).toBe(200);
  expect(index.headers()["content-type"]).toContain("application/xml");
  const indexXml = await index.text();
  expect(indexXml).toContain("<sitemapindex");
  expect(indexXml).toContain(
    `${new URL(index.url()).origin}/sitemaps/static.xml`,
  );

  for (const path of [
    "/sitemaps/static.xml",
    "/sitemaps/resources.xml",
    "/sitemaps/activities.xml",
    "/sitemaps/territorial-hubs.xml",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const xml = await response.text();
    expect(xml).toContain("<urlset");
    expect(xml).not.toContain("<changefreq>");
    expect(xml).not.toContain("<priority>");
    expect(xml).not.toContain(
      "/abrir-negocio/bar/comunidad-de-madrid/madrid/madrid-28079",
    );
  }
});

test("invalid hierarchy is 404 and stale municipality slug is permanent", async ({
  request,
}) => {
  const invalid = await request.get(
    "/municipios/andalucia/almeria/madrid-28079",
  );
  expect(invalid.status()).toBe(404);
  const stale = await request.get(
    "/municipios/comunidad-de-madrid/madrid/nombre-antiguo-28079",
    { maxRedirects: 0 },
  );
  expect(stale.status()).toBe(308);
  expect(stale.headers().location).toBe(
    "/municipios/comunidad-de-madrid/madrid/madrid-28079",
  );
});

test("municipality activity page has no mobile overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/abrir-negocio/bar/comunidad-de-madrid/madrid/madrid-28079");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
