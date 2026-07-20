import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/agb",
  "/datenschutz",
  "/hinweise-disclaimer",
  "/impressum",
  "/ki-hinweise",
  "/kontakt",
  "/konto-loeschen",
  "/recipe-share?token=test-token",
  "/404",
  "/.well-known/assetlinks.json",
  "/favicon.ico",
  "/favicon-32x32.png",
  "/favicon-16x16.png",
  "/favicon-192x192.png",
  "/favicon-512x512.png",
  "/apple-touch-icon.png",
  "/robots.txt",
  "/sitemap.xml",
];

test("alle öffentlichen Routen sind erreichbar", async ({ request }) => {
  for (const route of publicRoutes) {
    const response = await request.get(route);
    expect(response.ok(), `${route} sollte erreichbar sein`).toBeTruthy();
  }
});

test("Typografie bleibt in allen Viewports identisch", async ({ page }) => {
  await page.goto("/");
  const fonts = await page.locator("body").evaluate((body) => ({
    body: getComputedStyle(body).fontFamily,
    brand: getComputedStyle(body.querySelector<HTMLElement>(".brand-heading")!)
      .fontFamily,
  }));

  expect(fonts.body).not.toMatch(/Manrope|Rosehot/i);
  expect(fonts.brand).toMatch(/^Baskerville/i);
});

test("Favicon bleibt klein, kontrastreich und browserkompatibel", async ({
  page,
  request,
}) => {
  await page.goto("/");

  const favicon = await request.get("/favicon.ico");
  expect(favicon.headers()["content-type"]).toContain("image/x-icon");
  await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute(
    "href",
    "/favicon.ico?v=3",
  );
  await expect(page.locator('link[rel="icon"][type="image/png"]')).toHaveCount(
    2,
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/apple-touch-icon.png?v=3",
  );
});

test("Google-Play-Badge kennzeichnet die Android-Verfügbarkeit", async ({
  page,
}) => {
  await page.goto("/");

  const badge = page.locator("[data-google-play-badge]");
  await expect(badge).toBeVisible();
  await expect(badge).toHaveAttribute("href", "/kontakt?anliegen=beta");
  await expect(badge.locator("img")).toHaveAttribute(
    "alt",
    "Vorregistrierung bei Google Play",
  );
  await expect(page.locator("[data-android-availability]")).toContainText(
    "Aktuell ausschließlich für Android",
  );
});

test("Theme, Logo und Einstellung wechseln gemeinsam", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  await expect(header.locator(".brand-heading")).toHaveText("PlanTeller");
  await expect(header.locator('[data-logo-theme="adaptive"]')).toHaveCount(0);
  const logo = page.locator('footer [data-logo-theme="adaptive"]');
  await expect(logo).toBeVisible();
  await expect(
    page.locator('[data-theme-picture="adaptive"] img').first(),
  ).toBeVisible();
  const lightLogoColor = await logo.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page
    .getByRole("button", { name: "Anzeige-Einstellungen öffnen" })
    .click();
  await page.getByLabel("Dunkel").check();
  await expect(page.locator("html")).toHaveAttribute(
    "data-resolved-theme",
    "dark",
  );
  const darkLogoColor = await logo.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(darkLogoColor).not.toBe(lightLogoColor);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-resolved-theme",
    "dark",
  );
});

test("Kontaktanliegen werden sicher vorausgewählt", async ({ page }) => {
  await page.goto("/kontakt?anliegen=beta");
  await expect(page.locator("#anliegen")).toHaveValue("beta");
  await expect(page.locator("[data-contact-subject]")).toHaveValue(
    "PlanTeller Website – Beta-Anfrage",
  );

  await page.goto("/kontakt?anliegen=ungueltig");
  await expect(page.locator("#anliegen")).toHaveValue("allgemein");
});

test("Kontaktformular sendet zugänglich und ohne echten Formspree-Aufruf", async ({
  page,
}) => {
  await page.route("https://formspree.io/f/mojgjzlv", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ next: "/" }),
    }),
  );
  await page.goto("/kontakt?anliegen=fehler");
  await page.getByLabel("E-Mail-Adresse *").fill("test@example.com");
  await page
    .getByLabel("Nachricht *")
    .fill("Eine ausreichend lange Testnachricht.");
  await page.getByLabel(/Ich habe die/).check();
  await page.getByRole("button", { name: "Nachricht senden" }).click();
  await expect(
    page.getByText("Danke! Deine Nachricht wurde gesendet."),
  ).toBeVisible();
});

test("Rezeptfreigabe erzeugt den unveränderten App-Link", async ({ page }) => {
  await page.goto("/recipe-share?token=test-token");
  await expect(page.locator("[data-share-token]")).toHaveText("test-token");
  await expect(page.locator("[data-open-app]")).toHaveAttribute(
    "href",
    "planteller://recipe-share?token=test-token",
  );
});

test("mobile Navigation ist per Tastatur bedienbar", async ({ page }) => {
  test.skip(
    (page.viewportSize()?.width ?? 0) >= 1024,
    "Desktop-Navigation ist direkt sichtbar",
  );
  await page.goto("/");
  const toggle = page.locator("[data-menu-toggle]");
  await expect(toggle).toHaveAccessibleName("Navigation öffnen");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(toggle).toHaveAccessibleName("Navigation schließen");
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("@a11y zentrale Seiten haben keine kritischen axe-Verstöße", async ({
  page,
}) => {
  test.slow();
  for (const route of ["/", "/kontakt", "/datenschutz"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(
      (violation) => violation.impact === "critical",
    );
    expect(
      critical,
      `${route}: ${critical.map((item) => item.id).join(", ")}`,
    ).toEqual([]);
  }
});
