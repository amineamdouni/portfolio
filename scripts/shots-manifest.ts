/**
 * Writes content/projects/shot-sizes.json: the pixel size of every
 * public/shots/<slug>/<name>.webp, so meta.ts files only list names and alt text.
 *
 *   pnpm shots:manifest
 *
 * Run it after adding screenshots, then add the new names to that project's
 * `shotsFor(...)` list in meta.ts.
 */
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SHOTS = path.join(process.cwd(), "public", "shots");
const OUT = path.join(process.cwd(), "content", "projects", "shot-sizes.json");

async function main() {
  const sizes: Record<string, [number, number]> = {};
  const slugs = (await readdir(SHOTS, { withFileTypes: true }))
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .map((d) => d.name)
    .sort();
  for (const slug of slugs) {
    const files = (await readdir(path.join(SHOTS, slug))).filter((f) => f.endsWith(".webp")).sort();
    for (const file of files) {
      const { width, height } = await sharp(path.join(SHOTS, slug, file)).metadata();
      if (!width || !height) throw new Error(`No size for ${slug}/${file}`);
      sizes[`${slug}/${file.replace(/\.webp$/, "")}`] = [width, height];
    }
  }
  await writeFile(OUT, `${JSON.stringify(sizes, null, 2)}\n`);
  console.log(`${Object.keys(sizes).length} shots → ${path.relative(process.cwd(), OUT)}`);
}

void main();
