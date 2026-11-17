/**
 * Takes project screenshots with Playwright and writes PNG + WebP to
 * public/shots/<slug>/<route>-<viewport>.{png,webp}.
 *
 *   pnpm screenshots                 # every target in screenshots.config.ts
 *   pnpm screenshots delivair sift   # only these slugs
 *
 * Desktop 1440 × 900, mobile 390 × 844 (2x). Animations are reduced, the
 * page settles on network idle, and cookie banners are declined, never accepted.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright";
import sharp from "sharp";
import { targets, viewports, type Target } from "./screenshots.config";

const OUT_DIR = path.join(process.cwd(), "public", "shots");

/** Words on "decline / reject / only necessary" buttons, EN and FR. */
const DECLINE_TEXT = [
  /^(decline|reject|reject all|deny|refuse|necessary only|only necessary|use necessary cookies only)$/i,
  /^(refuser|tout refuser|continuer sans accepter|nécessaires uniquement|uniquement nécessaires)$/i,
];

/** Common consent-manager buttons (OneTrust, Cookiebot, Didomi, Axeptio, Complianz, Iubenda...). */
const DECLINE_SELECTORS = [
  "#onetrust-reject-all-handler",
  "#CybotCookiebotDialogBodyButtonDecline",
  "#didomi-notice-disagree-button",
  "button.axeptio_btn_dismiss",
  ".cmplz-deny",
  ".iubenda-cs-reject-btn",
  "[data-testid='uc-deny-all-button']",
];

/**
 * Closes a cookie banner by declining. Returns true if it clicked something.
 * Never clicks "accept": if only an accept button exists, the banner stays and
 * the run logs a warning so the shot can be checked by hand.
 */
export async function declineCookieBanner(page: Page): Promise<boolean> {
  for (const selector of DECLINE_SELECTORS) {
    const el = page.locator(selector).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click({ timeout: 2_000 }).catch(() => {});
      return true;
    }
  }
  for (const pattern of DECLINE_TEXT) {
    const el = page.getByRole("button", { name: pattern }).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click({ timeout: 2_000 }).catch(() => {});
      return true;
    }
  }
  return false;
}

async function shoot(target: Target) {
  const browser = await chromium.launch();
  try {
    const dir = path.join(OUT_DIR, target.slug);
    await mkdir(dir, { recursive: true });

    for (const route of target.routes) {
      for (const vpName of route.viewports) {
        const vp = viewports[vpName];
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: vp.deviceScaleFactor,
          isMobile: vp.isMobile,
          hasTouch: vp.isMobile,
          reducedMotion: "reduce",
          colorScheme: "light",
        });
        const page = await context.newPage();
        const url = new URL(route.path, target.baseUrl).toString();
        await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
        if (target.declineCookies && !(await declineCookieBanner(page))) {
          // No banner, or only an "accept" option: leave it and flag it.
          console.warn(`  ! ${target.slug}/${route.name}: no decline button found (check the shot)`);
        }
        if (route.waitFor) await page.waitForSelector(route.waitFor, { timeout: 30_000 });
        await page.waitForTimeout(800);

        const stem = path.join(dir, `${route.name}-${vpName}`);
        const png = await page.screenshot({ fullPage: !!route.fullPage, animations: "disabled" });
        await sharp(png).png({ compressionLevel: 9 }).toFile(`${stem}.png`);
        await sharp(png).webp({ quality: 82 }).toFile(`${stem}.webp`);
        console.log(`  ✓ ${path.relative(process.cwd(), stem)}.{png,webp}`);
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const only = process.argv.slice(2);
  const list = only.length ? targets.filter((t) => only.includes(t.slug)) : targets;
  if (!list.length) {
    console.error(`No target matches: ${only.join(", ")}`);
    process.exit(1);
  }
  for (const target of list) {
    console.log(`${target.slug} (${target.baseUrl})`);
    try {
      await shoot(target);
    } catch (err) {
      console.error(`  ✗ ${target.slug}: ${(err as Error).message}`);
      process.exitCode = 1;
    }
  }
}

void main();
