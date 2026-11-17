import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categories, getProjects, isCategory, type Category } from "@/lib/projects";
import { pageMeta } from "@/lib/seo";
import { ProjectCard } from "@/components/ProjectCard";
import { EmptyState, buttonClass, cx } from "@/components/ui";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const text = { title: t("projectsTitle"), description: t("projectsDescription") };
  return { ...text, ...pageMeta(locale, "/projects", text) };
}

export default async function ProjectsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { type } = await searchParams;
  const t = await getTranslations("projects");

  // Unknown values show the empty state rather than silently showing everything.
  const raw = Array.isArray(type) ? type[0] : type;
  const active: Category | "all" | "unknown" = !raw ? "all" : isCategory(raw) ? raw : "unknown";
  const list = active === "all" ? getProjects() : active === "unknown" ? [] : getProjects(active);
  const options: Array<Category | "all"> = ["all", ...categories];

  return (
    <div className="pb-16 md:pb-24">
      <section className="pt-10 pb-7 md:pt-20 md:pb-10">
        <h1 className="mb-4 text-h1">{t("title")}</h1>
        <p className="max-w-[60ch] text-lead text-text-secondary">{t("lead")}</p>
      </section>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pb-7">
        {/* Links, not JS state: the filter works without JavaScript, is shareable and follows the back button. */}
        <nav aria-label={t("filterLabel")}>
          <ul className="inline-flex flex-wrap gap-1 rounded-sm border bg-surface-sunken p-1">
            {options.map((opt) => {
              const selected = opt === active;
              return (
                <li key={opt}>
                  <Link
                    href={opt === "all" ? "/projects" : { pathname: "/projects", query: { type: opt } }}
                    aria-current={selected ? "page" : undefined}
                    data-filter={opt}
                    scroll={false}
                    className={cx(
                      "inline-flex h-9 items-center rounded-[3px] border px-3.5 text-sm whitespace-nowrap no-underline transition-colors duration-[120ms] ease-out-std hover:no-underline",
                      selected
                        ? "border-border-strong bg-surface font-semibold text-text-primary hover:text-text-primary"
                        : "border-transparent font-medium text-text-secondary hover:bg-surface hover:text-text-primary",
                    )}
                  >
                    {t(`filters.${opt}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <p aria-live="polite" data-testid="project-count" className="font-mono text-[13px] tracking-[0.04em] text-text-muted uppercase">
          {t("count", { count: list.length })}
        </p>
      </div>

      {list.length > 0 ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-6">
          {list.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} headingLevel={2} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyText")}
          action={
            <Link href="/projects" className={buttonClass("secondary")}>
              {t("showAll")}
            </Link>
          }
        />
      )}
    </div>
  );
}
