import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "elegante-design",
  category: "client",
  title: "Elegante Design",
  summary: {
    en: "Showcase site with a project gallery.",
    fr: "Site vitrine avec une galerie de projets."
  },
  role: {
    en: "Solo project",
    fr: "Projet solo"
  },
  team: {
    kind: "solo"
  },
  dates: null,
  stack: [],
  demoUrl: null,
  healthUrl: null,
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: "https://elegante-design.vercel.app/",
  shots: shotsFor("elegante-design", [
    ["home-desktop", "Home page hero.", "Bannière de la page d'accueil."],
    ["projects-desktop", "\"Découvrez nos projets\" gallery section.", "Section galerie « Découvrez nos projets »."],
    ["home-mobile", "Home page on a phone.", "Page d'accueil sur téléphone."],
  ]),
  featured: false,
  order: 8,
  draft: false,
};

export default meta;
