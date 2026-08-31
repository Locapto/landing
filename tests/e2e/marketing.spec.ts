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
      .getByLabel("Demostración de un resultado de Locapto")
      .getByText("Fuentes oficiales consultadas"),
  ).toBeVisible();
  await expect(
    page.getByText("Revisar fuente oficial ↗", { exact: true }),
  ).toHaveCount(2);
  await expect(
    page.getByRole("link", { name: /Revisar fuente oficial/ }),
  ).toHaveCount(0);
  await expect(page.getByText("Ejemplo ilustrativo de resultado")).toHaveCount(
    0,
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
  await expect(asideCta).toContainText("Avisadme cuando esté disponible");
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
        .getByRole("link", { name: /Avisadme cuando esté disponible/ }),
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

test("beta CTA reaches form and validates Step 1", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Avisadme cuando esté disponible/ })
    .first()
    .click();
  await expect(page.locator("#acceso-beta")).toBeInViewport();
  await page
    .getByRole("button", { name: "Avisadme cuando esté disponible" })
    .click();
  await expect(page.locator("#form-error-home")).toContainText(
    "Completa el email profesional",
  );
});

test("other professional profile asks for an explanation", async ({ page }) => {
  await page.goto("/#acceso-beta");
  await page.getByLabel(/Email profesional/).fill("qa@example.com");
  await page.getByLabel(/Perfil profesional/).selectOption("otro");
  const explanation = page.getByLabel(
    /Cuéntanos cuál es tu perfil profesional/,
  );
  await expect(explanation).toBeVisible();
  await page
    .getByRole("button", { name: "Avisadme cuando esté disponible" })
    .click();
  await expect(page.locator("#form-error-home")).toContainText(
    "Cuéntanos cuál es tu perfil profesional",
  );
});

test("Step 1 saves before optional Step 2 and can be abandoned", async ({
  page,
}) => {
  await mockBeta(page);
  await page.goto("/#acceso-beta");
  await page.getByLabel(/Email profesional/).fill("qa@example.com");
  await page.getByLabel(/Perfil profesional/).selectOption("gestoria");
  await page
    .getByRole("button", { name: "Avisadme cuando esté disponible" })
    .click();
  await expect(page.getByText("Ya estás en la lista")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Cuéntanos un poco más",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Omitir" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Ya estás en la lista de avisos.",
    }),
  ).toBeVisible();
});

test("full beta form completes", async ({ page }) => {
  await mockBeta(page);
  await page.goto("/lp/gestorias#acceso-beta");
  await page.getByLabel(/Email profesional/).fill("qa@example.com");
  await page.getByLabel(/Perfil profesional/).selectOption("gestoria");
  await page
    .getByRole("button", { name: "Avisadme cuando esté disponible" })
    .click();
  await page.getByLabel("Nombre").fill("Prueba QA");
  await page.getByLabel("Empresa").fill("Locapto QA");
  await page.getByLabel(/Cuántas aperturas/).selectOption("3-5");
  await page.getByLabel(/En qué municipios/).fill("Madrid");
  await page.getByLabel("Revisar los requisitos de una actividad").check();
  await page.getByRole("button", { name: "Guardar respuestas" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Ya estás en la lista de avisos.",
    }),
  ).toBeVisible();
});

test("slow lead storage does not block form step transitions", async ({
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
  await page.getByLabel(/Email profesional/).fill("qa@example.com");
  await page.getByLabel(/Perfil profesional/).selectOption("gestoria");
  await page
    .getByRole("button", { name: "Avisadme cuando esté disponible" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Cuéntanos un poco más" }),
  ).toBeVisible({ timeout: 500 });
  await expect(
    page.getByRole("button", { name: "Confirmando alta…" }),
  ).toBeDisabled();
  const save = page.getByRole("button", { name: "Guardar respuestas" });
  await expect(save).toBeEnabled();
  await save.click();

  await expect(
    page.getByRole("heading", { name: "Guardando tus respuestas…" }),
  ).toBeVisible({ timeout: 500 });
  await expect(
    page.getByRole("heading", { name: "Ya estás en la lista de avisos." }),
  ).toBeVisible();
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
  await expect(page).toHaveURL(/\/municipios\/comunidad-de-madrid$/);
  await page
    .getByRole("link", { name: "Madrid 179 municipios", exact: true })
    .click();
  await expect(page).toHaveURL(/\/municipios\/comunidad-de-madrid\/madrid$/);
  await page
    .getByRole("link", { name: "Madrid Código INE 28079", exact: true })
    .click();
  await expect(page).toHaveURL(
    /\/municipios\/comunidad-de-madrid\/madrid\/madrid-28079$/,
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
  );
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Cómo abrir un bar en Madrid.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Fuentes oficiales consultadas")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Avísame cuando esté disponible/ }),
  ).toBeVisible();
});

test("municipality activity content renders without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/abrir-negocio/bar/comunidad-de-madrid/madrid/madrid-28079");
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
