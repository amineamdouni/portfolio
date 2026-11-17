/**
 * Site-wide settings. Contact details are the owner's own, published on
 * purpose. Everything else here is configuration, not content.
 */
export const site = {
  name: "Amine Amdouni",
  /** Wave 4: set NEXT_PUBLIC_SITE_URL to the final Vercel URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://amine-amdouni.vercel.app",
  email: "amineamdouni24@gmail.com",
  phoneDisplay: "+216 50 917 560",
  phoneHref: "tel:+21650917560",
  linkedinUrl: "https://www.linkedin.com/in/amine-amdouni",
  linkedinDisplay: "linkedin.com/in/amine-amdouni",
  githubUrl: "https://github.com/amineamdouni",
  cvPath: "/cv.pdf",
  /**
   * The final CV arrives at Gate C. Until then every "Download CV" control is
   * hidden and public/cv.pdf does not exist. Set NEXT_PUBLIC_SHOW_CV=1 once
   * public/cv.pdf is in place.
   */
  showCvDownload: process.env.NEXT_PUBLIC_SHOW_CV === "1",
} as const;
