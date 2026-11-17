import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

const plainLink =
  "w-fit text-[15px] text-text-primary no-underline hover:text-text-primary hover:underline";

export async function PageFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-surface py-8">
      <div className="container-page">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
          <div>
            <p className="text-[17px] font-semibold">{nav("brand")}</p>
            <p className="mt-2 max-w-[34ch] text-[15px] text-text-muted">{t("blurb")}</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="font-mono text-[11px] tracking-[0.06em] text-text-muted uppercase">{t("pages")}</p>
            <Link href="/projects" className={plainLink}>
              {nav("projects")}
            </Link>
            <Link href="/about" className={plainLink}>
              {nav("about")}
            </Link>
            <Link href="/contact" className={plainLink}>
              {nav("contact")}
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="font-mono text-[11px] tracking-[0.06em] text-text-muted uppercase">{t("elsewhere")}</p>
            <a href={`mailto:${site.email}`} className="w-fit text-[15px] [overflow-wrap:anywhere]">
              {site.email}
            </a>
            <a href={site.phoneHref} className={plainLink}>
              {site.phoneDisplay}
            </a>
            <a href={site.linkedinUrl} className={plainLink} rel="noreferrer noopener" target="_blank">
              {t("linkedin")}
            </a>
            <a href={`${site.githubUrl}/portfolio`} className={plainLink} rel="noreferrer noopener" target="_blank">
              {t("source")}
            </a>
            {site.showCvDownload && (
              <a href={site.cvPath} className={plainLink} download>
                {t("downloadCv")}
              </a>
            )}
          </div>
        </div>
        <p className="mt-7 border-t pt-5 font-mono text-xs text-text-muted">{t("note", { year })}</p>
      </div>
    </footer>
  );
}
