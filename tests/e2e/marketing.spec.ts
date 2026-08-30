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
      name: "Precalifica aperturas de negocio con fuentes oficiales.",
    }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Cómo funciona", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/como-funciona$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "precalificación trazable",
  );
});

test("beta CTA reaches form and validates Step 1", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Solicitar acceso beta/ })
    .first()
    .click();
  await expect(page.locator("#acceso-beta")).toBeInViewport();
  await page.getByRole("button", { name: "Solicitar acceso beta" }).click();
  await expect(page.locator("#form-error-home")).toContainText(
    "Completa el email profesional",
  );
});

test("Step 1 saves before optional Step 2 and can be abandoned", async ({
  page,
}) => {
  await mockBeta(page);
  await page.goto("/#acceso-beta");
  await page.getByLabel(/Email profesional/).fill("qa@example.com");
  await page.getByLabel(/Persona/).selectOption("gestoria");
  await page.getByRole("button", { name: "Solicitar acceso beta" }).click();
  await expect(page.getByText("Solicitud guardada")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Dos preguntas para priorizar tu acceso",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ahora no" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Gracias. Hemos recibido tu solicitud.",
    }),
  ).toBeVisible();
});

test("full beta form completes", async ({ page }) => {
  await mockBeta(page);
  await page.goto("/lp/gestorias#acceso-beta");
  await page.getByLabel(/Email profesional/).fill("qa@example.com");
  await page.getByLabel(/Persona/).selectOption("gestoria");
  await page.getByRole("button", { name: "Solicitar acceso beta" }).click();
  await page.getByLabel("Nombre").fill("Prueba QA");
  await page.getByLabel("Empresa").fill("Locapto QA");
  await page.getByLabel(/Cuántos expedientes/).selectOption("3-5");
  await page.getByLabel(/Dónde trabajáis/).fill("Madrid");
  await page.getByLabel("Precalificar actividades").check();
  await page.getByRole("button", { name: "Terminar" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Gracias. Hemos recibido tu solicitud.",
    }),
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
  await expect(page.getByText(/Cuando abramos nuevas plazas/)).toBeVisible();
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
    .getByRole("link", { name: "Cobertura" })
    .click();
  await expect(page).toHaveURL(/\/cobertura$/);
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
