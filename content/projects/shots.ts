import type { Shot } from "./types";
import sizes from "./shot-sizes.json";

/** [file name without extension, alt EN, alt FR], in gallery order. */
export type ShotEntry = readonly [name: string, en: string, fr: string];

const known = sizes as unknown as Record<string, [number, number] | undefined>;

/**
 * Screenshot list for one project, from files in public/shots/<slug>/.
 * Sizes come from shot-sizes.json (`pnpm shots:manifest`); a name with no file
 * fails the build. Portrait images are "mobile", the rest "desktop".
 * The first entry is the project card's cover.
 *
 * To add screenshots: drop <name>.webp (+ .png) in public/shots/<slug>/,
 * run `pnpm shots:manifest`, then add a line here in that project's meta.ts.
 */
export function shotsFor(slug: string, entries: readonly ShotEntry[]): Shot[] {
  return entries.map(([name, en, fr]) => {
    const size = known[`${slug}/${name}`];
    if (!size) throw new Error(`Screenshot public/shots/${slug}/${name}.webp is missing; run pnpm shots:manifest`);
    const [width, height] = size;
    return {
      src: `/shots/${slug}/${name}.webp`,
      kind: height > width ? "mobile" : "desktop",
      width,
      height,
      alt: { en, fr },
    };
  });
}
