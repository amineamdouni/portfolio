import { projects } from "../content/projects";
import { expect, test } from "./fixtures";

const backends = projects.map((p) => p.healthUrl).filter((u): u is string => !!u);

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
    // Hero and footer both link the English CV.
    const cv = page.getByRole("link", { name: "Download CV" });
    await expect(cv).toHaveCount(2);
    await expect(cv.first()).toHaveAttribute("href", "/Amine_Amdouni_CV_EN.pdf");
  });

  test("renders in French", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Développeur full-stack");
    await expect(page.getByRole("link", { name: "Télécharger le CV" }).first()).toHaveAttribute(
      "href",
      "/Amine_Amdouni_CV_FR.pdf",
    );
    const pdf = await page.request.get("/Amine_Amdouni_CV_FR.pdf");
    expect(pdf.headers()["content-type"]).toContain("application/pdf");
  });

  for (const path of ["/en", "/fr", "/en/projects", "/fr/projects"]) {
    test(`wakes no backend: ${path}`, async ({ page, external }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      // Any request to another origin already fails the test; check the backends by name too.
      expect(external.requests.filter((u) => backends.some((b) => u.startsWith(new URL(b).origin)))).toEqual([]);
      expect(external.requests).toEqual([]);
    });
  }

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

test.describe("every project page", () => {
  for (const project of projects) {
    for (const locale of ["en", "fr"] as const) {
      test(`${locale}: ${project.slug}`, async ({ page, external }) => {
        // Only this project's own demo and backend may be contacted.
        if (project.category === "mobile" && project.demoUrl) external.allow.push(project.demoUrl);
        if (project.healthUrl) external.allow.push(project.healthUrl);
        await page.goto(`/${locale}/projects/${project.slug}`);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title);
        await expect(page.locator(`[data-template="${project.category}"]`)).toBeVisible();
        await expect(page.getByText("TODO", { exact: true })).toHaveCount(0);
        await page.waitForLoadState("networkidle");
        for (const url of external.requests) {
          expect([project.healthUrl, project.demoUrl].some((own) => own && url.startsWith(own)), url).toBe(true);
        }
      });
    }
  }
});

test.describe("project templates", () => {
  for (const project of projects.filter((p) => p.category === "mobile")) {
    test(`mobile: phone frame loads the ${project.slug} demo`, async ({ page, external }) => {
      external.allow.push(project.demoUrl!);
      const request = page.waitForRequest((r) => r.url().startsWith(project.demoUrl!));
      await page.goto(`/en/projects/${project.slug}`);
      await expect(page.locator("figure").getByText("Sample data", { exact: true })).toBeVisible();
      const iframe = page.locator("figure iframe");
      await expect(iframe).toHaveAttribute("src", project.demoUrl!);
      await request;
      // Loaded: the spinner and the fallback are gone, the iframe stays.
      await expect(page.locator("figure").getByRole("status")).toHaveCount(0);
      await expect(iframe).toBeVisible();
      expect(external.requests.every((u) => u.startsWith(project.demoUrl!))).toBe(true);
    });
  }

  test("mobile: try-this steps", async ({ page, external }) => {
    external.allow.push("https://delivair-demo.vercel.app");
    await page.goto("/en/projects/delivair");
    await expect(page.getByRole("heading", { name: "Try this" })).toBeVisible();
    await expect(page.locator('[data-template="mobile"] ol li')).toHaveCount(3);
  });

  for (const project of projects.filter((p) => p.category === "fullstack")) {
    test(`full-stack: ${project.slug} wakes only its own backend`, async ({ page, external }) => {
      external.allow.push(project.healthUrl!);
      // Hold the answer so the waking state is visible.
      let release!: () => void;
      const held = new Promise<void>((r) => (release = r));
      await page.route(project.healthUrl!, async (route) => {
        await held;
        await route.fallback();
      });
      const ping = page.waitForRequest(project.healthUrl!);
      await page.goto(`/en/projects/${project.slug}`);
      await ping;
      const minutes = project.wakeMinutes ?? 1;
      await expect(page.getByText(`the first load can take up to ${minutes} min`)).toBeVisible();
      // The link is usable while the server wakes.
      const open = page.getByTestId("live-demo").getByRole("link", { name: "Open live demo" });
      await expect(open).toHaveAttribute("href", project.demoUrl!);
      release();
      await expect(page.getByTestId("live-demo")).toHaveAttribute("data-state", "ready");
      await page.waitForLoadState("networkidle");
      // Only its own /health: the fetch probe and the image ping (?wake=...).
      for (const url of external.requests) expect(url.startsWith(project.healthUrl!), url).toBe(true);
    });
  }

  test("full-stack: demo notice, live demo button, diagram", async ({ page, external }) => {
    external.allow.push("https://trustit-api.onrender.com/health");
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
  await expect(page.getByRole("main").getByRole("link", { name: "Download CV" })).toHaveAttribute(
    "href",
    "/Amine_Amdouni_CV_EN.pdf",
  );
});

test("contact details live in the footer; /contact redirects home", async ({ page }) => {
  await page.goto("/en/contact");
  await expect(page).toHaveURL(/\/en(#contact)?$/);
  const footer = page.getByTestId("footer-contact");
  await expect(footer.getByRole("link", { name: "amineamdouni24@gmail.com" })).toHaveAttribute("href", "mailto:amineamdouni24@gmail.com");
  await expect(footer.getByRole("link", { name: "+216 52 079 640" })).toHaveAttribute("href", "tel:+21652079640");
  await expect(footer.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/amineamdouni");
  await expect(footer.getByText("Tunis, Tunisia")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" })).toHaveCount(0);
});

test("404 inside a locale", async ({ page, consoleErrors }) => {
  const res = await page.goto("/en/this-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page doesn't exist");
  await expect(page.getByRole("link", { name: "Go to the home page" })).toBeVisible();
  await expect(page).toHaveTitle("This page doesn't exist · Amine Amdouni");
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

test("language toggle: name contains its visible text, filter is kept", async ({ page }) => {
  await page.goto("/en/projects?type=mobile");
  const toggle = page.getByTestId("locale-switch");
  await expect(toggle).toHaveAccessibleName(/^FR\b.*Français/);
  await expect(toggle).toHaveAttribute("href", "/fr/projects?type=mobile");
  await toggle.click();
  await expect(page).toHaveURL(/\/fr\/projects\?type=mobile$/);
  await expect(page.getByTestId("project-card")).toHaveCount(3);
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
  const og = await request.get("/en/projects/delivair/opengraph-image/card");
  expect(og.headers()["content-type"]).toContain("image/png");
  for (const icon of ["/icon.svg", "/apple-icon"]) expect((await request.get(icon)).ok(), icon).toBe(true);
});
