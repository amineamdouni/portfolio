import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Amine Amdouni";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const home = await getTranslations({ locale, namespace: "home" });
  return ogImage({ eyebrow: "Amine Amdouni", title: t("aboutTitle"), footer: home("title") });
}
