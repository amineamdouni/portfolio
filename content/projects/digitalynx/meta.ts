import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "digitalynx",
  category: "client",
  title: "Digitalynx",
  summary: {
    en: "Single-page site for a digital marketing agency. Live demo copy.",
    fr: "Site d'une page pour une agence de marketing digital. Copie de démonstration en ligne."
  },
  role: {
    en: "Solo project",
    fr: "Projet solo"
  },
  team: {
    kind: "solo"
  },
  dates: null,
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Radix UI"
  ],
  demoUrl: "https://digitalynx-ten.vercel.app",
  healthUrl: null,
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: shotsFor("digitalynx", [
    ["home-desktop", "Home page hero with the video poster.", "Bannière de la page d'accueil avec l'image de la vidéo."],
    ["services-desktop", "\"Nos services\" section with the service cards.", "Section « Nos services » avec les cartes de services."],
    ["home-mobile", "Home page on a phone.", "Page d'accueil sur téléphone."],
  ]),
  featured: false,
  order: 1,
  draft: false,
};

export default meta;
