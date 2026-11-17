import { useTranslations } from "next-intl";
import { ProjectCardSkeleton } from "@/components/ProjectCard";

export default function ProjectsLoading() {
  const t = useTranslations("projects");
  return (
    <div className="pb-16 md:pb-24">
      <section className="pt-10 pb-7 md:pt-20 md:pb-10">
        <h1 className="mb-4 text-h1">{t("title")}</h1>
        <p className="max-w-[60ch] text-lead text-text-secondary">{t("lead")}</p>
      </section>
      <p role="status" className="pb-7 font-mono text-[13px] tracking-[0.04em] text-text-muted uppercase">
        {t("loading")}
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
