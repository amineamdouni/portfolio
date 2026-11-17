import { expect, test } from "./fixtures";

test("phone menu opens, closes with Escape", async ({ page }) => {
  await page.goto("/en");
  const button = page.getByRole("button", { name: "Open menu" });
  await button.click();
  const menu = page.locator("#mobile-menu");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("mobile demo: no frame under 768px, a full-screen button instead", async ({ page, external }) => {
  await page.goto("/en/projects/delivair");
  await expect(page.locator("figure iframe")).toHaveCount(0);
  await expect(page.getByText("Sample data").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Open demo full screen" }).first()).toHaveAttribute(
    "href",
    "https://delivair-demo.vercel.app",
  );
  expect(external.requests).toEqual([]);
});

test("no horizontal scroll on the main pages", async ({ page, external }) => {
  external.allow.push("https://trustit-api.onrender.com/health");
  for (const path of ["/en", "/fr/projects", "/en/projects/trustit", "/fr/about"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
