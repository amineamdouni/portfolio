import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { cvPath } from "@/lib/site";
import { SkillsList } from "@/components/SkillsList";
import { SectionHeading, buttonClass, iconProps } from "@/components/ui";

type Props = { params: Promise<{ locale: string }> };

const jobs = ["freelance", "billcom", "swiver", "innothinkLead", "innothinkDev"] as const;
const schools = ["licence", "bac", "training"] as const;
const langs = ["arabic", "english", "french"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const text = { title: t("aboutTitle"), description: t("aboutDescription") };
  return { ...text, ...pageMeta(locale, "/about", text) };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className="pb-16 md:pb-24">
      <section className="pt-10 md:pt-20">
        <h1 className="mb-6 text-h1">{t("title")}</h1>
        <div className="flex max-w-(--measure) flex-col gap-4">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a href={cvPath(locale)} download className={buttonClass("primary")}>
            <Download {...iconProps} />
            {t("downloadCv")}
          </a>
          <span className="font-mono text-[13px] text-text-muted">{t("cvMeta")}</span>
        </div>
      </section>

      <section className="mt-16 md:mt-24" aria-labelledby="experience">
        <SectionHeading number="01" id="experience">
          {t("experience")}
        </SectionHeading>
        <ol className="mt-8 max-w-[760px]">
          {jobs.map((key, i) => {
            const last = i === jobs.length - 1;
            const points = t.raw(`jobs.${key}.points`) as string[];
            return (
              <li key={key} className={`grid grid-cols-[auto_minmax(0,1fr)] gap-5 ${last ? "" : "pb-7"}`}>
                <div aria-hidden className="flex flex-col items-center pt-2">
                  <span
                    className={`size-[9px] rounded-full ${i === 0 ? "bg-accent" : "border border-border-strong bg-surface"}`}
                  />
                  {!last && <span className="mt-2 w-px flex-1 bg-border" />}
                </div>
                <div>
                  <p className="font-mono text-[13px] tracking-[0.02em] text-text-muted uppercase">
                    {t(`jobs.${key}.period`)}
                  </p>
                  <h3 className="mt-1 mb-0.5 text-h3">{t(`jobs.${key}.role`)}</h3>
                  <p className="text-[15px] text-text-secondary">{t(`jobs.${key}.meta`)}</p>
                  <ul className="mt-2.5 flex max-w-[60ch] list-disc flex-col gap-1.5 ps-5 text-[15px] text-text-secondary">
                    {points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-16 md:mt-24" aria-labelledby="education">
        <SectionHeading number="02" id="education">
          {t("education")}
        </SectionHeading>
        <ul className="mt-8 max-w-[760px] border-t">
          {schools.map((key) => (
            <li key={key} className="grid gap-x-6 gap-y-1 border-b py-[18px] md:grid-cols-[160px_1fr]">
              <p className="pt-[3px] font-mono text-[13px] text-text-muted">{t(`schools.${key}.period`)}</p>
              <div>
                <p className="text-h3">{t(`schools.${key}.title`)}</p>
                <p className="mt-0.5 text-[15px] text-text-secondary">{t(`schools.${key}.meta`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 md:mt-24" aria-labelledby="skills">
        <SectionHeading number="03" id="skills">
          {t("skills")}
        </SectionHeading>
        <div className="mt-8 max-w-[760px]">
          <SkillsList />
        </div>
      </section>

      <section className="mt-16 md:mt-24" aria-labelledby="languages">
        <SectionHeading number="04" id="languages">
          {t("languages")}
        </SectionHeading>
        <dl className="mt-8 grid max-w-[760px] grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-px overflow-hidden rounded-md border bg-border">
          {langs.map((key) => (
            <div key={key} className="bg-surface px-5 py-[22px]">
              <dt className="text-h3">{t(`langs.${key}`)}</dt>
              <dd className="mt-1.5 text-sm text-text-muted">{t(`langs.${key}Level`)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
