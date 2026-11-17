import { test as base, expect } from "@playwright/test";

type External = {
  /** URLs a test expects to leave the site (demo iframes, its own /health). Set before page.goto. */
  allow: Array<string | RegExp>;
  /** Every request to another origin, in order. */
  requests: string[];
};

/**
 * Every test fails on a console error, an uncaught page error, or a request
 * to a host other than the site itself, unless the test allowed that URL.
 * Requests to other origins never reach the network: allowed ones get a small
 * stub answer (so a demo iframe "loads" and a /health ping succeeds), the rest
 * are aborted. Vercel Analytics only loads on Vercel.
 */
export const test = base.extend<{ consoleErrors: string[]; external: External }>({
  external: [
    async ({ page, baseURL }, use) => {
      const origin = new URL(baseURL!).origin;
      const external: External = { allow: [], requests: [] };
      await page.route(
        (url) => url.protocol.startsWith("http") && url.origin !== origin,
        async (route) => {
          const url = route.request().url();
          external.requests.push(url);
          const allowed = external.allow.some((a) => (typeof a === "string" ? url === a || url.startsWith(a) : a.test(url)));
          if (!allowed) return route.abort();
          return route.fulfill({
            status: 200,
            contentType: route.request().resourceType() === "document" ? "text/html" : "application/json",
            body: route.request().resourceType() === "document" ? "<!doctype html><title>demo</title><p>demo</p>" : '{"status":"ok"}',
          });
        },
      );
      await use(external);
    },
    { auto: true },
  ],
  consoleErrors: [
    async ({ page, external }, use) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
      });
      page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
      await use(errors);
      const unexpected = external.requests.filter(
        (url) => !external.allow.some((a) => (typeof a === "string" ? url === a || url.startsWith(a) : a.test(url))),
      );
      // An aborted request also logs a console error; report the request itself.
      const all = [...unexpected.map((u) => `third-party request: ${u}`), ...(unexpected.length ? [] : errors)];
      expect(all, all.join("\n")).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
