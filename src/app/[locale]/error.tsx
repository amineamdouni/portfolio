"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Alert, buttonClass } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("error");
  return (
    <section className="flex max-w-[560px] flex-col items-start gap-6 pt-16 pb-24 md:pt-[120px] md:pb-40">
      <Alert tone="danger" title={t("title")}>
        {t("text")}
      </Alert>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={reset} className={buttonClass("secondary")}>
          {t("retry")}
        </button>
        <Link href="/" className={buttonClass("ghost")}>
          {t("home")}
        </Link>
      </div>
    </section>
  );
}
