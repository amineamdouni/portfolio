# Portfolio

The portfolio site of Amine Amdouni, full-stack developer: mobile apps, full-stack products, e-commerce projects and client sites, each with an interactive demo, a live demo, screenshots or a link to the live site. English and French, light and dark.

Status: skeleton. Every page, component and translation is in place; project write-ups, screenshots and demo URLs are placeholders marked **TODO**.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 with the portfolio design system tokens (`src/app/globals.css`)
- `next-intl`: `/en` and `/fr`, toggle in the header
- `next-themes`: follows the system setting, with a toggle in the header
- MDX via `@next/mdx` for project write-ups
- `@vercel/analytics` (loaded only on Vercel)
- Fonts: Instrument Sans and Geist Mono through `next/font` (self-hosted at build time)
- Playwright for the smoke tests and the screenshot script
- pnpm, Node 22 (`.nvmrc`, `engines`)

The site makes no third-party requests at runtime except Vercel Analytics on Vercel, and, on a full-stack project page, a request to that project's own demo backend `/health` to wake it.

## Run it

```bash
nvm use            # Node 22
pnpm install
pnpm dev           # http://localhost:3000 → redirects to /en
```

Checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e      # builds, starts on port 3210, runs the Playwright smoke tests
```

First time only: `pnpm exec playwright install chromium`.

Environment variables (all optional, none secret):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute URL for sitemap, canonical and Open Graph links. Default `https://amine-amdouni.vercel.app`. |
| `NEXT_PUBLIC_SHOW_CV` | `1` shows the "Download CV" buttons. Keep unset until `public/cv.pdf` exists. |

## Structure

```
content/projects/<slug>/meta.ts   facts about one project (typed by content/projects/types.ts)
content/projects/<slug>/en.mdx    write-up, English
content/projects/<slug>/fr.mdx    write-up, French
content/projects/index.ts         list of projects
messages/{en,fr}.json             every UI string
src/app/[locale]/                 pages: home, projects, projects/[slug], about, contact, not-found, error
src/components/                   SiteHeader, PageFooter, ProjectCard, ProjectHeader, PhoneFrame,
                                  BrowserFrame, Gallery, LiveDemoButton, DemoNotice, ArchitectureDiagram,
                                  templates.tsx (ProjectMobile, ProjectFullstack, ProjectEcommerce, ProjectClient)
src/proxy.ts                      locale detection and redirects (next-intl)
scripts/screenshots.ts            screenshot script (config in scripts/screenshots.config.ts)
infra/neon/                       Neon schema/role setup for the demo backends (no secrets)
e2e/                              Playwright smoke tests
```

## Content model

Each project has a `meta.ts`:

| Field | Meaning |
|---|---|
| `slug`, `title` | URL segment and product name |
| `category` | `mobile`, `fullstack`, `ecommerce` or `client`; picks the page template |
| `summary`, `role` | one line each, `{ en, fr }`, or `null` while unknown (shown as TODO) |
| `team` | `{ kind: "solo" }` or `{ kind: "team", size }` |
| `dates` | `{ start, end }` as `YYYY` or `YYYY-MM`, `end: null` = ongoing |
| `stack` | technology names, shown as tags |
| `demoUrl` | mobile: the web build shown in the phone frame; full-stack: the web app |
| `healthUrl` | the backend's `/health`, woken on that project's page only |
| `repo` | `{ visibility, url }`, visibility is `public` or `private` |
| `liveUrl` | client sites: the live site |
| `shots` | screenshots: `src`, `kind` (desktop/mobile), `width`, `height`, `alt` and optional `caption` in both languages |
| `architecture` | full-stack only: columns for the SVG diagram |
| `demoLogin` | full-stack only: public demo-only credentials to show |
| `featured`, `order`, `draft` | home page selection, order in the category, draft badge |

The MDX write-up uses these components: `<Section number="01" title="…">`, `<Todo>` (visible placeholder), `<Screens />` (gallery from `shots`) and `<Architecture />` (diagram from `architecture`). Until a project has shots, its gallery shows marked placeholder images.

To add a project: create the folder with `meta.ts`, `en.mdx`, `fr.mdx`, then add it to `content/projects/index.ts`.

## Screenshot script

```bash
pnpm screenshots                  # every target
pnpm screenshots smilescan sift   # some slugs
```

Targets and routes live in `scripts/screenshots.config.ts`. For each route and viewport it writes `public/shots/<slug>/<route>-<viewport>.png` and `.webp`. Desktop is 1440 × 900; mobile is 390 × 844 at 2x. Cookie banners are declined, never accepted (`declineCookieBanner`); if no decline button exists the run warns so the shot can be checked. Then reference the files in that project's `meta.ts` `shots`.

## Demo behaviour

- **PhoneFrame**: from 768px wide, the demo runs in an iframe at 390 × 844 scaled into a fixed-ratio box (no layout shift). Under 768px there is no iframe, only an "Open demo full screen" button. If the embed does not load within 20 s it falls back to a screenshot and the gallery.
- **LiveDemoButton**: fetches the project's `/health` (no-cors) on page load and on hover or focus, shows "Waking the demo server (up to 1 min)" until it answers, then becomes the link. It never wakes other projects' backends.
- **DemoNotice**: "This is a demo with sample data. Anything you add is visible to other visitors and is deleted every night. Please don't enter real personal information." (French version in `messages/fr.json`.)
