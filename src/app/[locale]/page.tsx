import { ArrowRight, Download, ExternalLink, Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeatured, getProjects } from "@/lib/projects";
import { site } from "@/lib/site";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillsList } from "@/components/SkillsList";
import { SectionHeading, buttonClass, iconProps } from "@/components/ui";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const featured = getFeatured();
  const total = getProjects().length;

  return (
    <>
      <section className="pt-12 pb-2 md:pt-24 md:pb-4">
        <p className="mb-5 font-mono text-[13px] tracking-[0.04em] text-text-muted uppercase">{t("eyebrow")}</p>
        <h1 className="max-w-[18ch] text-display leading-[1.1]">{t("title")}</h1>
        <p className="mt-6 mb-9 max-w-[56ch] text-lead text-text-secondary">{t("lead")}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/projects" className={buttonClass("primary")}>
            {t("viewProjects")}
            <ArrowRight {...iconProps} className="rtl:-scale-x-100" />
          </Link>
          {site.showCvDownload && (
            <a href={site.cvPath} download className={buttonClass("secondary")}>
              <Download {...iconProps} />
              {t("downloadCv")}
            </a>
          )}
        </div>
      </section>

      <section className="mt-16 md:mt-24" aria-labelledby="selected-work">
        <SectionHeading number="01" id="selected-work">
          {t("selectedWork")}
        </SectionHeading>
        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4 md:gap-6">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <Link
          href="/projects"
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-[17px] font-semibold no-underline"
        >
          {t("allProjects", { count: total })}
          <ArrowRight {...iconProps} className="rtl:-scale-x-100" />
        </Link>
      </section>

      <section className="mt-16 md:mt-24" aria-labelledby="skills">
        <SectionHeading number="02" id="skills">
          {t("whatIWorkWith")}
        </SectionHeading>
        <div className="mt-8">
          <SkillsList />
        </div>
      </section>

      <section className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-end gap-8 border-t pt-10 pb-16 md:mt-24 md:pt-14 md:pb-24">
        <div>
          <h2 className="mb-3 text-h2">{t("getInTouch")}</h2>
          <p className="max-w-[48ch] text-text-secondary">{t("getInTouchText")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a href={`mailto:${site.email}`} className={buttonClass("secondary")}>
            <Mail {...iconProps} />
            {site.email}
          </a>
          <a
            href={site.linkedinUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-11 items-center gap-2 text-[17px] font-semibold no-underline"
          >
            {t("linkedin")}
            <ExternalLink {...iconProps} className="rtl:-scale-x-100" />
          </a>
        </div>
      </section>
    </>
  );
}
