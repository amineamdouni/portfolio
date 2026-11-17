import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { badgeFor, formatDates, pick, type ProjectMeta } from "@/lib/projects";
import { StatusBadge, Tag, TodoMark } from "./ui";

export async function Breadcrumb({ title }: { title: string }) {
  const t = await getTranslations("project");
  return (
    <nav
      aria-label={t("breadcrumb")}
      className="pt-6 pb-4 font-mono text-[13px] tracking-[0.04em] text-text-muted uppercase md:pt-8 md:pb-6"
    >
      <Link href="/projects" className="text-text-secondary">
        {t("projects")}
      </Link>
      <span aria-hidden> / </span>
      <span aria-current="page">{title}</span>
    </nav>
  );
}

export async function ProjectHeader({ project }: { project: ProjectMeta }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const badge = badgeFor(project);
  const role = pick(project.role, locale);
  const summary = pick(project.summary, locale);
  const dates = formatDates(project, locale, t("project.present"));
  const team =
    project.team.kind === "solo"
      ? t("project.solo")
      : project.team.size
        ? t("project.teamOf", { size: project.team.size })
        : null;

  const facts: Array<{ label: string; value: string | null }> = [
    { label: t("project.role"), value: role },
    { label: t("project.timeline"), value: dates },
  ];
  // "Solo" would repeat the role ("Solo project"); show Team only for team work.
  if (project.team.kind === "team") facts.push({ label: t("project.team"), value: team });
  facts.push({
    label: t("project.code"),
    value: project.repo.visibility === "private" ? t("project.privateRepo") : t("project.publicRepo"),
  });

  return (
    <header>
      <div className="mb-3.5 flex flex-wrap gap-2 md:mb-[18px] md:gap-2.5">
        <StatusBadge tone={badge.tone}>{t(`badges.${badge.key}`)}</StatusBadge>
        {project.draft && <StatusBadge tone="warning">{t("badges.draft")}</StatusBadge>}
      </div>
      <h1 className="mb-3 max-w-[16ch] text-h1 text-pretty md:mb-4 md:text-display">{project.title}</h1>
      <p className="mb-6 max-w-[60ch] text-lead text-text-secondary md:mb-8">
        {summary ?? <TodoMark>{t("project.todoSummary")}</TodoMark>}
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-t pt-5 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:gap-6 md:pt-7">
        {/* Unknown facts are left out rather than guessed. */}
        {facts
          .filter((f) => f.value)
          .map((f) => (
            <div key={f.label}>
              <dt className="eyebrow mb-1 md:mb-1.5">{f.label}</dt>
              <dd className="text-base font-medium">{f.value}</dd>
            </div>
          ))}
        {project.stack.length > 0 && (
          <div className="col-span-full md:col-span-2">
            <dt className="eyebrow mb-2">{t("project.stack")}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <Tag key={s} size="md">
                  {s}
                </Tag>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </header>
  );
}
