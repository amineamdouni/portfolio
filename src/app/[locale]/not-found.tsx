import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClass, iconProps } from "@/components/ui";

export default function NotFound() {
  const t = useTranslations();
  const links = [
    { href: "/projects", label: t("nav.projects") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <section className="pt-16 pb-24 md:pt-[120px] md:pb-40">
      <p className="mb-5 font-mono text-[13px] tracking-[0.04em] text-text-muted uppercase">{t("notFound.eyebrow")}</p>
      <h1 className="max-w-[18ch] text-display leading-[1.1]">{t("notFound.title")}</h1>
      <p className="mt-5 mb-8 max-w-[48ch] text-text-secondary">{t("notFound.text")}</p>
      <Link href="/" className={buttonClass("primary")}>
        {t("notFound.home")}
      </Link>
      <ul className="mt-8 max-w-[320px] border-t">
        {links.map((l) => (
          <li key={l.href} className="border-b">
            <Link href={l.href} className="flex min-h-11 items-center gap-2 font-semibold no-underline">
              {l.label}
              <ArrowRight {...iconProps} className="rtl:-scale-x-100" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
