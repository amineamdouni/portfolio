import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/** Canonical + hreflang alternates for a path such as "/projects" ("" = home). */
export function alternates(locale: string, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}${path}`;
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}
