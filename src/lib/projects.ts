import { projects } from "@content/projects";
import type { Category, Localized, ProjectMeta, Shot } from "@content/projects/types";
import type { Locale } from "@/i18n/routing";

export type { Category, ProjectMeta, Shot };

export const categories: Category[] = ["mobile", "fullstack", "ecommerce", "client"];

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (categories as string[]).includes(value);
}

export function getProjects(category?: Category): ProjectMeta[] {
  const list = category ? projects.filter((p) => p.category === category) : projects;
  return [...list].sort(
    (a, b) =>
      categories.indexOf(a.category) - categories.indexOf(b.category) || a.order - b.order,
  );
}

export function getFeatured(): ProjectMeta[] {
  return getProjects().filter((p) => p.featured);
}

export function getProject(slug: string): ProjectMeta | undefined {
  return projects.find((p) => p.slug === slug);
}

export function pick(value: Localized | null | undefined, locale: Locale): string | null {
  return value ? value[locale] : null;
}

export type BadgeKey = "mobile" | "fullstack" | "ecommerce" | "client" | "demoCopy";

/** How a visitor can see the work, shown on cards and page headers. */
export function badgeFor(p: ProjectMeta): { key: BadgeKey; tone: "live" | "accent" | "neutral" } {
  switch (p.category) {
    case "mobile":
      return { key: "mobile", tone: "accent" };
    case "fullstack":
      return { key: "fullstack", tone: "live" };
    case "ecommerce":
      return { key: "ecommerce", tone: "neutral" };
    case "client":
      // Digitalynx and FK-KM are demo copies we host; the others are the clients' own live sites.
      return p.liveUrl ? { key: "client", tone: "live" } : { key: "demoCopy", tone: "neutral" };
  }
}

const monthFmt: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }),
  fr: new Intl.DateTimeFormat("fr", { month: "short", year: "numeric", timeZone: "UTC" }),
};

function formatPoint(value: string, locale: Locale): string {
  const [y, m] = value.split("-");
  if (!m) return y;
  return monthFmt[locale].format(new Date(Date.UTC(Number(y), Number(m) - 1, 1)));
}

export function formatDates(p: ProjectMeta, locale: Locale, present: string): string | null {
  if (!p.dates) return null;
  const start = formatPoint(p.dates.start, locale);
  const end = p.dates.end ? formatPoint(p.dates.end, locale) : present;
  return start === end ? start : `${start} — ${end}`;
}

/** Placeholder shots used until Wave 4 adds real screenshots. */
export function shotsOrPlaceholders(p: ProjectMeta): { shots: Shot[]; placeholder: boolean } {
  if (p.shots.length > 0) return { shots: p.shots, placeholder: false };
  const desktop: Shot = {
    src: "/shots/_placeholder/desktop.svg",
    kind: "desktop",
    width: 1440,
    height: 900,
    alt: { en: "", fr: "" },
  };
  const mobile: Shot = {
    src: "/shots/_placeholder/mobile.svg",
    kind: "mobile",
    width: 390,
    height: 844,
    alt: { en: "", fr: "" },
  };
  const shots =
    p.category === "mobile"
      ? [mobile, mobile, mobile, mobile]
      : p.category === "client"
        ? [desktop, desktop, mobile]
        : [desktop, desktop, desktop, mobile];
  return { shots, placeholder: true };
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
