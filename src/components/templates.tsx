import type { ComponentType } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { hostOf, shotsOrPlaceholders, type ProjectMeta } from "@/lib/projects";
import { Section, Todo } from "@/mdx-components";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { BrowserFrame } from "./BrowserFrame";
import { DemoNotice } from "./DemoNotice";
import { Gallery, type GalleryShot } from "./Gallery";
import { LiveDemoButton } from "./LiveDemoButton";
import { PhoneFrame } from "./PhoneFrame";
import { Breadcrumb, ProjectHeader } from "./ProjectHeader";
import { Callout, SectionHeading, TodoMark, buttonClass, iconProps } from "./ui";

type MdxModule = { default: ComponentType<{ components?: Record<string, unknown> }> };

async function loadBody(slug: string, locale: Locale): Promise<MdxModule> {
  return (await import(`@content/projects/${slug}/${locale}.mdx`)) as MdxModule;
}

async function galleryShots(project: ProjectMeta, locale: Locale): Promise<GalleryShot[]> {
  const t = await getTranslations("gallery");
  const { shots, placeholder } = shotsOrPlaceholders(project);
  return shots.map((s) => ({
    src: s.src,
    kind: s.kind,
    width: s.width,
    height: s.height,
    alt: placeholder ? t("pendingAlt", { kind: t(s.kind).toLowerCase() }) : s.alt[locale],
    caption: placeholder ? t("pendingLabel") : s.caption?.[locale],
  }));
}

/** MDX body with project-bound components (<Screens />, <Architecture />). */
async function ProjectBody({ project, galleryIntro }: { project: ProjectMeta; galleryIntro?: string }) {
  const locale = (await getLocale()) as Locale;
  const { default: Body } = await loadBody(project.slug, locale);
  const shots = await galleryShots(project, locale);
  const Screens = () => <Gallery shots={shots} intro={galleryIntro} />;
  const Architecture = () =>
    project.architecture ? <ArchitectureDiagram columns={project.architecture} /> : null;
  return <Body components={{ Section, Todo, Screens, Architecture }} />;
}

function Page({ children }: { children: React.ReactNode }) {
  return <article className="pb-16 md:pb-24">{children}</article>;
}

/* ---------- Mobile: phone frame demo ---------- */

export async function ProjectMobile({ project }: { project: ProjectMeta }) {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const shots = await galleryShots(project, locale);
  const fallback = shots.find((s) => s.kind === "mobile")?.src ?? "/shots/_placeholder/mobile.svg";
  const steps = project.tryThis?.[locale] ?? [];

  return (
    <Page>
      <Breadcrumb title={project.title} />
      <ProjectHeader project={project} />
      <section id="demo" className="mt-16 md:mt-24" data-template="mobile">
        <SectionHeading>{t("project.tryDemo")}</SectionHeading>
        <div className="mt-8 grid items-start gap-8 *:min-w-0 lg:grid-cols-[390px_minmax(0,1fr)] lg:gap-20">
          <PhoneFrame title={project.title} demoUrl={project.demoUrl} fallbackSrc={fallback} />
          <div>
            {steps.length > 0 && (
              <>
                <h3 className="mb-4 text-h3">{t("project.tryThis")}</h3>
                <ol className="mb-6 flex max-w-(--measure) list-decimal flex-col gap-3 ps-5 text-[17px] text-text-secondary marker:font-mono marker:text-sm marker:text-text-muted">
                  {steps.map((step) => (
                    <li key={step} className="ps-1">
                      {step}
                    </li>
                  ))}
                </ol>
              </>
            )}
            <Callout label={t("demo.sampleData")}>
              {t("demo.mobileNotice")}
            </Callout>
            {project.demoUrl && (
              <p className="mt-2 hidden md:block">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-11 items-center gap-2 text-[17px] font-semibold no-underline"
                >
                  {t("demo.openFullScreen")}
                  <ExternalLink {...iconProps} className="rtl:-scale-x-100" />
                  <span className="font-mono text-[11px] font-normal text-text-muted">{t("project.opensNewTab")}</span>
                </a>
              </p>
            )}
          </div>
        </div>
      </section>
      <ProjectBody project={project} />
    </Page>
  );
}

/* ---------- Full-stack: browser frame + wake-up button ---------- */

export async function ProjectFullstack({ project }: { project: ProjectMeta }) {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const shots = await galleryShots(project, locale);
  const cover = shots.find((s) => s.kind === "desktop");

  return (
    <Page>
      <Breadcrumb title={project.title} />
      <ProjectHeader project={project} />
      <section id="demo" className="mt-16 md:mt-24" data-template="fullstack">
        <SectionHeading>{t("project.liveDemo")}</SectionHeading>
        <DemoNotice className="mt-8" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          <div className="order-3 min-w-0 lg:order-1">
            <BrowserFrame
              url={project.demoUrl ? hostOf(project.demoUrl) : `${project.slug}.example`}
              sampleDataLabel={t("demo.sampleData")}
            >
              {cover && (
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  fill
                  sizes="(min-width: 1024px) 760px, 100vw"
                  className="object-cover object-top"
                  unoptimized={cover.src.endsWith(".svg")}
                />
              )}
            </BrowserFrame>
          </div>
          <div className="order-1 flex min-w-0 flex-col gap-5 lg:order-2">
            {project.demoUrl ? (
              <LiveDemoButton demoUrl={project.demoUrl} healthUrl={project.healthUrl} wakeMinutes={project.wakeMinutes} />
            ) : (
              // No live demo yet (e.g. Sift before its deploy): no button, screenshots only.
              <p className="text-[15px] text-text-secondary" data-testid="demo-not-online">
                {t("demo.notOnline")}
              </p>
            )}
            {(project.demoLogin?.length || project.demoHint) && (
              <div className="rounded-md border bg-surface p-5">
                <p className="eyebrow mb-3">{t("project.demoLogin")}</p>
                {project.demoLogin?.length ? (
                  <dl className="grid grid-cols-[90px_1fr] gap-x-3 gap-y-2.5 text-[15px]">
                    {project.demoLogin.map((row) => (
                      <div key={row.value} className="contents">
                        <dt className="text-text-muted">{row.label[locale]}</dt>
                        <dd className="font-mono text-sm [overflow-wrap:anywhere]">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {project.demoHint && <p className="text-[15px] text-text-secondary">{project.demoHint[locale]}</p>}
              </div>
            )}
            {project.links?.length ? (
              <ul className="flex flex-col gap-1" data-testid="project-links">
                {project.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold no-underline"
                    >
                      {link.label[locale]}
                      <ExternalLink {...iconProps} className="rtl:-scale-x-100" />
                      <span className="font-mono text-[11px] font-normal text-text-muted">{hostOf(link.url)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
      <ProjectBody project={project} />
    </Page>
  );
}

/* ---------- E-commerce: screenshots only ---------- */

export async function ProjectEcommerce({ project }: { project: ProjectMeta }) {
  const t = await getTranslations("project");
  return (
    <Page>
      <Breadcrumb title={project.title} />
      <ProjectHeader project={project} />
      <div data-template="ecommerce">
        <ProjectBody project={project} galleryIntro={t("noLiveDemo")} />
      </div>
    </Page>
  );
}

/* ---------- Client site: link + home page screenshot ---------- */

export async function ProjectClient({ project }: { project: ProjectMeta }) {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const shots = await galleryShots(project, locale);
  const cover = shots.find((s) => s.kind === "desktop");
  const url = project.liveUrl ?? project.demoUrl;

  return (
    <Page>
      <Breadcrumb title={project.title} />
      <ProjectHeader project={project} />
      <div className="mt-8" data-template="client">
        {url ? (
          <>
            <a href={url} target="_blank" rel="noreferrer noopener" className={buttonClass("primary")}>
              {t("project.visitSite")}
              <ExternalLink {...iconProps} className="rtl:-scale-x-100" />
            </a>
            <p className="mt-2.5 text-sm text-text-muted">{t("project.opensInNewTab", { host: hostOf(url) })}</p>
          </>
        ) : (
          <p className="text-[15px] text-text-secondary">
            <TodoMark>{t("project.siteNotOnline")}</TodoMark>
          </p>
        )}
      </div>
      <div className="mt-10 md:mt-14">
        <BrowserFrame url={url ? hostOf(url) : `${project.slug}.example`} caption={t("project.homePage")}>
          {cover && (
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(min-width: 1200px) 1136px, 100vw"
              className="object-cover object-top"
              unoptimized={cover.src.endsWith(".svg")}
              priority
            />
          )}
        </BrowserFrame>
      </div>
      <ProjectBody project={project} />
      <section className="mt-16 md:mt-24">
        <SectionHeading>{t("project.screens")}</SectionHeading>
        <Gallery shots={shots} intro={t("project.screensIntro")} />
      </section>
    </Page>
  );
}
