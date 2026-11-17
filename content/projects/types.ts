/**
 * Content model for one project. One folder per project:
 *   content/projects/<slug>/meta.ts   structured facts (this type)
 *   content/projects/<slug>/en.mdx    write-up, English
 *   content/projects/<slug>/fr.mdx    write-up, French
 *
 * Rule: no invented facts. Anything not known yet is `null` / empty and the
 * UI shows a visible TODO marker. Wave 4 fills these from the build reports.
 */

export type Category = "mobile" | "fullstack" | "ecommerce" | "client";

export type Localized = { en: string; fr: string };

export type Team =
  | { kind: "solo" }
  | { kind: "team"; /** People on the team, when known. */ size: number | null };

export type ProjectDates = {
  /** "YYYY" or "YYYY-MM". */
  start: string;
  /** "YYYY" or "YYYY-MM"; null = ongoing. */
  end: string | null;
};

export type Shot = {
  /** Path under /public, e.g. "/shots/delivair/mobile-01.webp". */
  src: string;
  kind: "desktop" | "mobile";
  width: number;
  height: number;
  /** One sentence. */
  alt: Localized;
  caption?: Localized;
};

/** Diagram label: a product or tech name as-is, or a generic word translated. */
export type DiagramText = string | Localized;
export type DiagramNode = { name: DiagramText; note?: DiagramText };
export type DiagramColumn = {
  title: DiagramText;
  kind?: "plain" | "accent" | "external";
  nodes: DiagramNode[];
  /** Arrow drawn to the right of this column. */
  arrow?: "accent" | "plain";
};

export type ProjectMeta = {
  slug: string;
  category: Category;
  /** Product name, shown as-is in both languages. */
  title: string;
  /** One line. null = TODO. */
  summary: Localized | null;
  /** e.g. "Solo project". null = TODO. */
  role: Localized | null;
  team: Team;
  dates: ProjectDates | null;
  stack: string[];
  /** Mobile: the Expo web build shown in the phone frame. Full-stack: the web app. */
  demoUrl: string | null;
  /** Backend /health URL, woken on the project page only. */
  healthUrl: string | null;
  repo: { visibility: "public" | "private"; url: string | null };
  /** Client sites: the live site. */
  liveUrl: string | null;
  shots: Shot[];
  /** Full-stack pages only. */
  architecture?: DiagramColumn[];
  /** Demo login shown next to a full-stack demo (public demo-only credentials). */
  demoLogin?: { label: Localized; value: string }[];
  /** Full-stack: how long the backend can take to wake, in minutes (default 1). */
  wakeMinutes?: number;
  /** Full-stack: how to get in when there is no password (e.g. a "Log in as demo user" button). */
  demoHint?: Localized;
  /** Full-stack: more links next to the live demo (admin app, the client's live site). */
  links?: { label: Localized; url: string }[];
  /** Mobile: short steps that show the main flow, in order. */
  tryThis?: { en: string[]; fr: string[] };
  /** Shown on Home under "Selected work". */
  featured?: boolean;
  /** Sort order inside a category (lower first). */
  order: number;
  /** true while the write-up is placeholder text. */
  draft: boolean;
};
