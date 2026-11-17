import { expect, test } from "./fixtures";

const filters = [
  { key: "all", count: 18 },
  { key: "mobile", count: 3 },
  { key: "fullstack", count: 4 },
  { key: "ecommerce", count: 2 },
  { key: "client", count: 9 },
] as const;

test.describe("home", () => {
  test("renders in English", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/Amine Amdouni/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Full-stack developer");
    await expect(page.getByTestId("project-card")).toHaveCount(4);
    // The CV button is hidden until the final CV arrives (Gate C).
    await expect(page.getByRole("link", { name: "Download CV" })).toHaveCount(0);
  });

  test("renders in French", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Développeur full-stack");
  });

  test("redirects / to a locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(en|fr)$/);
  });
});

test.describe("projects", () => {
  for (const f of filters) {
    test(`filter: ${f.key}`, async ({ page }) => {
      await page.goto("/en/projects");
      await page.locator(`[data-filter="${f.key}"]`).click();
      if (f.key !== "all") await expect(page).toHaveURL(new RegExp(`type=${f.key}`));
      await expect(page.getByTestId("project-card")).toHaveCount(f.count);
      await expect(page.locator(`[data-filter="${f.key}"]`)).toHaveAttribute("aria-current", "page");
      if (f.key !== "all") {
        const cats = await page.getByTestId("project-card").evaluateAll((els) =>
          els.map((e) => e.getAttribute("data-category")),
        );
        expect(new Set(cats)).toEqual(new Set([f.key]));
      }
    });
  }

  test("unknown filter shows the empty state", async ({ page }) => {
    await page.goto("/en/projects?type=games");
    await expect(page.getByText("No projects in this category yet")).toBeVisible();
    await page.getByRole("link", { name: "Show all projects" }).click();
    await expect(page.getByTestId("project-card")).toHaveCount(18);
  });
});

test.describe("project templates", () => {
  test("mobile: phone frame with sample data badge", async ({ page }) => {
    await page.goto("/en/projects/delivair");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("DelivAir");
    await expect(page.locator('[data-template="mobile"]')).toBeVisible();
    await expect(page.locator("figure").getByText("Sample data", { exact: true })).toBeVisible();
    await expect(page.getByText("TODO").first()).toBeVisible();
  });

  test("full-stack: demo notice, live demo button, diagram", async ({ page }) => {
    await page.goto("/en/projects/trustit");
    await expect(page.locator('[data-template="fullstack"]')).toBeVisible();
    await expect(page.getByTestId("demo-notice")).toContainText("deleted every night");
    await expect(page.getByTestId("live-demo")).toBeVisible();
    await expect(page.getByRole("group", { name: /Architecture diagram/ })).toBeVisible();
  });

  test("e-commerce: gallery lightbox with keyboard", async ({ page }) => {
    await page.goto("/en/projects/mangadana");
    await expect(page.locator('[data-template="ecommerce"]')).toBeVisible();
    const thumbs = page.getByTestId("gallery").getByRole("button", { name: /Enlarge screenshot/ });
    await thumbs.first().click();
    const dialog = page.getByRole("dialog", { name: "Screenshot viewer" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/^1 \/ 4/)).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByText(/^2 \/ 4/)).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByText(/^4 \/ 4/)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(thumbs.first()).toBeFocused();
  });

  test("client site: visit link and screenshot", async ({ page }) => {
    await page.goto("/en/projects/smilescan");
    await expect(page.locator('[data-template="client"]')).toBeVisible();
    const visit = page.getByRole("link", { name: "Visit live site" });
    await expect(visit).toHaveAttribute("href", "https://www.smilescansolution.site/");
    await expect(visit).toHaveAttribute("target", "_blank");
  });
});

test("about", async ({ page }) => {
  await page.goto("/en/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
  await expect(page.getByRole("heading", { name: "Agile team lead" })).toBeVisible();
  await expect(page.getByText("TED University, Tunisia", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "Download CV" })).toHaveCount(0);
});

test("contact", async ({ page }) => {
  await page.goto("/en/contact");
  await expect(page.getByTestId("contact-email")).toHaveAttribute("href", "mailto:amineamdouni24@gmail.com");
  await expect(page.getByTestId("contact-phone")).toHaveAttribute("href", "tel:+21650917560");
  await expect(page.getByTestId("contact-linkedin")).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/amine-amdouni",
  );
  // Validation: empty submit shows field errors, nothing is opened.
  await page.getByRole("button", { name: "Open in my email app" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Some fields need a fix" })).toBeVisible();
  await expect(page.getByText("Enter a valid email address, like name@example.com.")).toBeVisible();
});

test("404 inside a locale", async ({ page, consoleErrors }) => {
  const res = await page.goto("/en/this-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page doesn't exist");
  await expect(page.getByRole("link", { name: "Go to the home page" })).toBeVisible();
  // The browser logs the document's own 404 status; that one is expected.
  const unexpected = consoleErrors.filter((e) => !/status of 404/.test(e));
  expect(unexpected).toEqual([]);
  consoleErrors.length = 0;
});

test("language toggle keeps the page", async ({ page }) => {
  await page.goto("/en/about");
  await page.getByTestId("locale-switch").click();
  await expect(page).toHaveURL(/\/fr\/about$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("À propos");
  await page.getByTestId("locale-switch").click();
  await expect(page).toHaveURL(/\/en\/about$/);
});

test("theme toggle switches and persists", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/en");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);
  await page.getByTestId("theme-toggle").click();
  await expect(html).toHaveClass(/dark/);
  await page.reload();
  await expect(html).toHaveClass(/dark/);
  await page.getByTestId("theme-toggle").click();
  await expect(html).not.toHaveClass(/dark/);
});

test("follows the system theme by default", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/en");
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("sitemap, robots and Open Graph image", async ({ request }) => {
  expect((await request.get("/sitemap.xml")).ok()).toBe(true);
  expect((await request.get("/robots.txt")).ok()).toBe(true);
  const og = await request.get("/en/projects/delivair/opengraph-image");
  expect(og.headers()["content-type"]).toContain("image/png");
});
