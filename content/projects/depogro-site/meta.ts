import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "depogro-site",
  category: "client",
  title: "DepoGro website",
  summary: {
    en: "Public website for the DepoGro company.",
    fr: "Site public de l'entreprise DepoGro."
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
  liveUrl: "https://depogro.com/",
  shots: shotsFor("depogro-site", [
    ["home-desktop", "Home page hero.", "Bannière de la page d'accueil."],
    ["services-desktop", "\"Pourquoi Depogro ?\" section with its cards.", "Section « Pourquoi Depogro ? » avec ses cartes."],
    ["home-mobile", "Home page on a phone.", "Page d'accueil sur téléphone."],
  ]),
  featured: false,
  order: 4,
  draft: false,
};

export default meta;
