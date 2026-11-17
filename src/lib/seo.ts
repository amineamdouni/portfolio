import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

/** Canonical + hreflang alternates for a path such as "/projects" ("" = home). */
export function alternates(locale: string, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}${path}`;
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}

/**
 * Canonical, hreflang and Open Graph (with og:url) for one page. A page's
 * openGraph replaces the layout's, so the shared fields are repeated here.
 */
export function pageMeta(
  locale: string,
  path: string,
  text: { title?: string; description?: string } = {},
): Pick<Metadata, "alternates" | "openGraph"> {
  return {
    alternates: alternates(locale, path),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `/${locale}${path}`,
      ...text,
    },
  };
}
