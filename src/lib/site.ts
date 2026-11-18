/**
 * Site-wide settings. Contact details are the owner's own, published on
 * purpose. Everything else here is configuration, not content.
 */
export const site = {
  name: "Amine Amdouni",
  /** Wave 4: set NEXT_PUBLIC_SITE_URL to the final Vercel URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://amine-amdouni.vercel.app",
  email: "amineamdouni24@gmail.com",
  phoneDisplay: "+216 52 079 640",
  phoneHref: "tel:+21652079640",
  linkedinUrl: "https://www.linkedin.com/in/amineamdouni",
  linkedinDisplay: "linkedin.com/in/amineamdouni",
  githubUrl: "https://github.com/amineamdouni",
  /** One CV per locale, in public/. Sources live outside the repo (cv-en.html, cv-fr.html). */
  cvPaths: { en: "/Amine_Amdouni_CV_EN.pdf", fr: "/Amine_Amdouni_CV_FR.pdf" },
} as const;

export function cvPath(locale: string): string {
  return locale === "fr" ? site.cvPaths.fr : site.cvPaths.en;
}
