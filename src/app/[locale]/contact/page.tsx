import type { Metadata } from "next";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/lib/seo";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";
import { buttonClass, iconProps } from "@/components/ui";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("contactTitle"), description: t("contactDescription"), alternates: alternates(locale, "/contact") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="pb-16 md:pb-24">
      <section className="pt-10 pb-10 md:pt-20 md:pb-14">
        <h1 className="mb-4 text-h1">{t("title")}</h1>
        <p className="max-w-[56ch] text-lead text-text-secondary">{t("lead")}</p>
      </section>

      <div className="grid items-start gap-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-24">
        <div>
          <p className="eyebrow mb-3">{t("direct")}</p>
          <div className="flex flex-col items-start gap-3">
            <a href={`mailto:${site.email}`} className={buttonClass("secondary")} data-testid="contact-email">
              <Mail {...iconProps} />
              {site.email}
            </a>
            <a href={site.phoneHref} className={buttonClass("secondary")} data-testid="contact-phone" title={t("phone", { phone: site.phoneDisplay })}>
              <Phone {...iconProps} />
              {site.phoneDisplay}
            </a>
            <a
              href={site.linkedinUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonClass("secondary")}
              data-testid="contact-linkedin"
            >
              {t("linkedin")}
              <ExternalLink {...iconProps} className="rtl:-scale-x-100" />
            </a>
          </div>
          <p className="mt-5 max-w-[40ch] text-[15px] text-text-muted">{t("note")}</p>
        </div>

        <div className="border-t pt-10 lg:border-t-0 lg:border-s lg:ps-24 lg:pt-0">
          <h2 className="mb-2 text-h2">{t("formTitle")}</h2>
          <p className="mb-5 max-w-[56ch] text-[15px] text-text-muted">{t("formNote")}</p>
          <ContactForm email={site.email} />
        </div>
      </div>
    </div>
  );
}
