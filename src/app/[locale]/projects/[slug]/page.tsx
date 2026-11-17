import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getProject, getProjects, pick } from "@/lib/projects";
import { alternates } from "@/lib/seo";
import { ProjectClient, ProjectEcommerce, ProjectFullstack, ProjectMobile } from "@/components/templates";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export const dynamic = "error";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getProjects().map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: pick(project.summary, locale as Locale) ?? undefined,
    alternates: alternates(locale, `/projects/${slug}`),
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();

  switch (project.category) {
    case "mobile":
      return <ProjectMobile project={project} />;
    case "fullstack":
      return <ProjectFullstack project={project} />;
    case "ecommerce":
      return <ProjectEcommerce project={project} />;
    case "client":
      return <ProjectClient project={project} />;
  }
}
