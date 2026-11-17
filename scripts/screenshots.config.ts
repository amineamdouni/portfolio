/**
 * What scripts/screenshots.ts captures. One entry per project slug.
 * Output: public/shots/<slug>/<route-name>-<viewport>.{png,webp}
 *
 * TODO (Wave 4): replace the demo base URLs with the deployed Vercel URLs and
 * add the routes picked for each demo (and the local runs: AKA, MangaDana,
 * admin panels on their local ports).
 */
export type Viewport = "desktop" | "mobile";

export type Route = {
  /** File name stem, e.g. "home". */
  name: string;
  /** Path appended to baseUrl, e.g. "/" or "/boards/1". */
  path: string;
  viewports: Viewport[];
  /** Optional CSS selector to wait for before the shot. */
  waitFor?: string;
  /** Full-page capture instead of the viewport only. */
  fullPage?: boolean;
};

export type Target = {
  slug: string;
  baseUrl: string;
  /** Close any cookie banner by declining (live client sites). */
  declineCookies?: boolean;
  routes: Route[];
};

export const viewports: Record<Viewport, { width: number; height: number; deviceScaleFactor: number; isMobile: boolean }> = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
};

const liveSite = (slug: string, baseUrl: string): Target => ({
  slug,
  baseUrl,
  declineCookies: true,
  // Plan: 2 desktop + 1 mobile per live client site. TODO (Wave 4): pick the second desktop route.
  routes: [
    { name: "home", path: "/", viewports: ["desktop", "mobile"] },
    { name: "home-full", path: "/", viewports: ["desktop"], fullPage: true },
  ],
});

export const targets: Target[] = [
  liveSite("smiling-ortho", "https://www.smilingortho.site"),
  liveSite("depogro-site", "https://depogro.com"),
  liveSite("amsdynamic", "https://amsdynamic.fr"),
  liveSite("dar-hayat", "https://dar-hayat.vercel.app"),
  liveSite("real-estate", "https://real-estate-black-zeta.vercel.app"),
  liveSite("elegante-design", "https://elegante-design.vercel.app"),
  liveSite("smilescan", "https://www.smilescansolution.site"),
  // TODO (Wave 4): deployed demos, e.g.
  // { slug: "delivair", baseUrl: "https://<delivair-demo>.vercel.app", routes: [{ name: "home", path: "/", viewports: ["mobile"] }] },
];
