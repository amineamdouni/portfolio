import AxeBuilder from "@axe-core/playwright";
import { projects } from "../content/projects";
import { expect, test } from "./fixtures";

const trustit = projects.find((p) => p.slug === "trustit")!;

/** One page per page type: static pages, each project template, every full-stack page, the 404. */
const pageTypes = [
  "/en",
  "/fr/projects",
  "/en/about",
  "/fr/contact",
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

test.describe("live demo button: /health answers", () => {
  test("with CORS headers, even if CORP is same-origin", async ({ page, external }) => {
    external.allow.push(trustit.healthUrl!);
    let calls = 0;
    await page.route(trustit.healthUrl!, (route) => {
      calls++;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {
          "access-control-allow-origin": new URL(page.url()).origin,
          "cross-origin-resource-policy": "same-origin",
        },
        body: '{"ok":true}',
      });
    });
    await page.goto("/en/projects/trustit");
    await expect(page.getByTestId("live-demo").getByRole("link", { name: "Open live demo" })).toBeVisible();
    expect(calls).toBe(1); // the CORS request was enough, no fallback
  });

  test("without CORS headers: an opaque answer counts as awake", async ({ page, external, consoleErrors }) => {
    external.allow.push(trustit.healthUrl!);
    // Playwright's stub can't make Chrome reject CORS, so the first (CORS) request fails
    // the way a CORS rejection does (a network error); the no-cors retry gets the answer.
    let calls = 0;
    await page.route(trustit.healthUrl!, (route) => {
      calls++;
      if (calls === 1) return route.abort("failed");
      return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });
    await page.goto("/en/projects/trustit");
    await expect(page.getByTestId("live-demo").getByRole("link", { name: "Open live demo" })).toBeVisible();
    expect(calls).toBe(2);
    expect(consoleErrors.filter((e) => !/Failed to load resource|ERR_FAILED/.test(e))).toEqual([]);
    consoleErrors.length = 0;
  });

  test("a 503 while the host starts keeps waking, then turns ready", async ({ page, external, consoleErrors }) => {
    external.allow.push(trustit.healthUrl!);
    let calls = 0;
    await page.route(trustit.healthUrl!, (route) => {
      calls++;
      return route.fulfill({
        status: calls === 1 ? 503 : 200,
        contentType: "application/json",
        headers: { "access-control-allow-origin": new URL(page.url()).origin },
        body: calls === 1 ? '{"ok":false}' : '{"ok":true}',
      });
    });
    await page.goto("/en/projects/trustit");
    await expect(page.getByText("Waking the demo server (up to 1 min)")).toBeVisible();
    await expect(page.getByTestId("live-demo").getByRole("link", { name: "Open live demo" })).toBeVisible({
      timeout: 10_000,
    });
    expect(calls).toBe(2);
    expect(consoleErrors.filter((e) => !/status of 503/.test(e))).toEqual([]);
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
    test(project.slug, async ({ page, external }) => {
      const minutes = project.wakeMinutes ?? 1;
      test.setTimeout((minutes + 2) * 60_000);
      external.live = true;
      external.allow.push(project.healthUrl!);
      await page.goto(`/en/projects/${project.slug}`);
      await expect(page.getByTestId("live-demo").getByRole("link", { name: "Open live demo" })).toBeVisible({
        timeout: (minutes + 1) * 60_000,
      });
    });
  }
});
