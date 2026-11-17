import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getProject, getProjects, pick } from "@/lib/projects";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getProjects().map((p) => ({ locale, slug: p.slug })));
}

/** One card per page; the alt text is in the page's language. */
export async function generateImageMetadata({ params }: { params: Params | Promise<Params> }) {
  const { locale, slug } = await params;
  // Plain strings: next-intl needs a request here, and this runs at build time.
  const title = getProject(slug)?.title ?? "Amine Amdouni";
  const alt = locale === "fr" ? `${title}, un projet d'Amine Amdouni` : `${title}, a project by Amine Amdouni`;
  return [{ id: "card", alt, size: ogSize, contentType: ogContentType }];
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  const t = await getTranslations({ locale, namespace: "projects" });
  const badges = await getTranslations({ locale, namespace: "projects.filters" });
  return ogImage({
    eyebrow: `Amine Amdouni · ${t("title")}`,
    title: project?.title ?? t("title"),
    footer: (project && pick(project.summary, locale as Locale)) ?? (project ? badges(project.category) : ""),
  });
}
