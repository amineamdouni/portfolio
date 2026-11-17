import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/projects", "/about", "/contact", ...getProjects().map((p) => `/projects/${p.slug}`)];
  return paths.map((path) => ({
    url: `${site.url}/${routing.defaultLocale}${path}`,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${site.url}/${l}${path}`])),
    },
  }));
}
