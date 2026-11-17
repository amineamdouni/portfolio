import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { badgeFor, pick, type ProjectMeta } from "@/lib/projects";
import { Skeleton, StatusBadge, Tag } from "./ui";

export async function ProjectCard({ project, headingLevel = 3 }: { project: ProjectMeta; headingLevel?: 2 | 3 }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const badge = badgeFor(project);
  const summary = pick(project.summary, locale);
  const role = pick(project.role, locale);
  // The first screenshot in meta.ts is the cover; phone screens are shown whole.
  const cover = project.shots[0];
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const shown = project.stack.slice(0, 4);
  const more = project.stack.length - shown.length;

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-testid="project-card"
      data-category={project.category}
      className="group block overflow-hidden rounded-md border bg-surface text-inherit no-underline transition-[border-color] duration-[120ms] ease-out-std hover:border-border-strong hover:text-inherit hover:no-underline focus-visible:rounded-md"
    >
      <div className="relative aspect-[16/10] border-b">
        {cover ? (
          <Image
            src={cover.src}
            alt=""
            fill
            sizes="(min-width: 1200px) 380px, (min-width: 768px) 50vw, 100vw"
            className={cover.kind === "mobile" ? "bg-surface-sunken object-contain" : "object-cover object-top"}
            unoptimized={cover.src.endsWith(".svg")}
          />
        ) : (
          <div className="hatch flex size-full items-center justify-center">
            <span className="rounded-xs bg-surface px-2 py-[3px] font-mono text-xs text-text-muted">
              {project.title}
            </span>
          </div>
        )}
      </div>
      <div className="px-[18px] pt-[18px] pb-5">
        <div className="mb-2.5 flex items-center gap-2.5">
          <StatusBadge tone={badge.tone}>{t(`badges.${badge.key}`)}</StatusBadge>
          <span className="ms-auto font-mono text-xs whitespace-nowrap text-text-muted uppercase">
            {role ?? t("project.todoValue")}
          </span>
        </div>
        <Heading className="mb-1.5 text-h3 group-hover:underline group-hover:underline-offset-3">{project.title}</Heading>
        <p className="mb-3.5 text-[15px] leading-[1.6] text-pretty text-text-secondary">
          {summary ?? t("project.todoSummary")}
        </p>
        {shown.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {shown.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
            {more > 0 && <Tag muted>+{more}</Tag>}
          </div>
        )}
      </div>
    </Link>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div aria-hidden className="overflow-hidden rounded-md border bg-surface">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="flex flex-col gap-2.5 px-[18px] pt-[18px] pb-5">
        <Skeleton className="h-6 w-[40%]" />
        <Skeleton className="h-5 w-[75%]" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  );
}
