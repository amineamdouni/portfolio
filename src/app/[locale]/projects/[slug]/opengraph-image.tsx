import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getProject, getProjects, pick } from "@/lib/projects";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Project by Amine Amdouni";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getProjects().map((p) => ({ locale, slug: p.slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
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
