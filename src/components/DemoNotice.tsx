import { getTranslations } from "next-intl/server";
import { Alert } from "./ui";

/** Shown before any demo visitors can edit (plan C3). */
export async function DemoNotice({ className }: { className?: string }) {
  const t = await getTranslations("demo");
  return (
    <Alert tone="warning" title={t("noticeTitle")} className={className} data-testid="demo-notice">
      {t("notice")}
    </Alert>
  );
}
