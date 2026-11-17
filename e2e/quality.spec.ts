import AxeBuilder from "@axe-core/playwright";
import { projects } from "../content/projects";
import { expect, test } from "./fixtures";

const trustit = projects.find((p) => p.slug === "trustit")!;

/** One page per page type: static pages, each project template, every full-stack page, the 404. */
const pageTypes = [
  "/en",
  "/fr/projects",
  "/en/about",
  "/en/projects/delivair",
  "/fr/projects/depogro",
  "/en/projects/mangadana",
  "/fr/projects/smilescan",
  ...projects.filter((p) => p.category === "fullstack").flatMap((p) => [`/en/projects/${p.slug}`, `/fr/projects/${p.slug}`]),
];

/** Let each page reach only its own demo or backend (stubbed). */
function allowOwn(path: string, allow: Array<string | RegExp>) {
  const project = projects.find((p) => path.endsWith(`/projects/${p.slug}`));
  if (project?.healthUrl) allow.push(project.healthUrl);
  if (project?.category === "mobile" && project.demoUrl) allow.push(project.demoUrl);
}

test.describe("no sideways scroll", () => {
  for (const width of [360, 390, 768]) {
    test(`at ${width}px`, async ({ page, external, consoleErrors }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const path of [...pageTypes, "/en/does-not-exist"]) {
        allowOwn(path, external.allow);
        await page.goto(path);
        const [scroll, client] = await page.evaluate(() => [
          document.documentElement.scrollWidth,
          document.documentElement.clientWidth,
        ]);
        expect(scroll, `${path} at ${width}px`).toBeLessThanOrEqual(client);
      }
      // The 404 document logs its own status; that one is expected.
      const unexpected = consoleErrors.filter((e) => !/status of 404/.test(e));
      expect(unexpected).toEqual([]);
      consoleErrors.length = 0;
    });
  }
});

test.describe("axe: no serious or critical violations", () => {
  for (const path of [...pageTypes, "/fr/does-not-exist"]) {
    for (const scheme of ["light", "dark"] as const) {
      test(`${path} (${scheme})`, async ({ page, external, consoleErrors }) => {
        allowOwn(path, external.allow);
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const { violations } = await new AxeBuilder({ page }).analyze();
        const bad = violations
          .filter((v) => v.impact === "serious" || v.impact === "critical")
          .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
        expect(bad).toEqual([]);
        if (path.includes("does-not-exist")) consoleErrors.length = 0;
      });
    }
  }
});

test.describe("live demo button", () => {
  const status = (page: import("@playwright/test").Page) => page.getByTestId("live-demo");
  const health = (url: string) => (u: URL) => u.href.startsWith(url);

  test("the link is usable while the server wakes, and the status turns ready", async ({ page, external, consoleErrors }) => {
    external.allow.push(trustit.healthUrl!);
    let calls = 0;
    await page.route(health(trustit.healthUrl!), (route) => {
      if (route.request().resourceType() === "image") return route.fulfill({ status: 200, body: "" });
      calls++;
      return route.fulfill({
        status: calls === 1 ? 503 : 200,
        contentType: "application/json",
        headers: { "access-control-allow-origin": new URL(page.url()).origin },
        body: calls === 1 ? '{"ok":false}' : '{"ok":true}',
      });
    });
    await page.goto("/en/projects/trustit");
    await expect(status(page).getByRole("link", { name: "Open live demo" })).toBeVisible();
    await expect(status(page)).toHaveAttribute("data-state", "waking");
    await expect(status(page)).toHaveAttribute("data-state", "ready", { timeout: 10_000 });
    await expect(page.getByText("Server is up.")).toBeVisible();
    expect(consoleErrors.filter((e) => !/status of 503/.test(e))).toEqual([]);
    consoleErrors.length = 0;
  });

  test("a probe that never answers does not stall the check", async ({ page, external, consoleErrors }) => {
    external.allow.push(trustit.healthUrl!);
    let calls = 0;
    await page.route(health(trustit.healthUrl!), async (route) => {
      if (route.request().resourceType() === "image") return route.fulfill({ status: 200, body: "" });
      calls++;
      if (calls === 1) return; // hangs until the per-attempt timeout
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "access-control-allow-origin": new URL(page.url()).origin },
        body: '{"ok":true}',
      });
    });
    await page.goto("/en/projects/trustit");
    await expect(status(page).getByRole("link", { name: "Open live demo" })).toBeVisible();
    await expect(status(page)).toHaveAttribute("data-state", "ready", { timeout: 25_000 });
    consoleErrors.length = 0;
  });
});

/**
 * Real backends, real headers: opt-in (LIVE_HEALTH=1), since it wakes the
 * four free hosts. Each page must turn ready within its announced wake time.
 */
test.describe("live /health (opt-in)", () => {
  test.skip(!process.env.LIVE_HEALTH, "set LIVE_HEALTH=1 to run against the real backends");
  for (const project of projects.filter((p) => p.healthUrl)) {
    test(project.slug, async ({ page, external, consoleErrors }) => {
      const minutes = project.wakeMinutes ?? 1;
      test.setTimeout((minutes + 2) * 60_000);
      external.live = true;
      external.allow.push(project.healthUrl!);
      await page.goto(`/en/projects/${project.slug}`);
      await expect(page.getByTestId("live-demo")).toHaveAttribute("data-state", "ready", {
        timeout: (minutes + 1) * 60_000,
      });
      // localhost is not an allowed origin, so the CORS probe is rejected and the fallback answers.
      consoleErrors.length = 0;
    });
  }
});
