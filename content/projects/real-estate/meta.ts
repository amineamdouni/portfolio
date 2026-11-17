import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "real-estate",
  category: "client",
  title: "Real estate site",
  summary: {
    en: "Property listings site built on a template.",
    fr: "Site d'annonces immobilières construit sur un modèle."
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
  liveUrl: "https://real-estate-black-zeta.vercel.app/",
  shots: shotsFor("real-estate", [
    ["home-desktop", "Home page hero.", "Bannière de la page d'accueil."],
    ["properties-desktop", "Properties page with filters and listing cards.", "Page des biens avec filtres et fiches."],
    ["home-mobile", "Home page on a phone.", "Page d'accueil sur téléphone."],
  ]),
  featured: false,
  order: 7,
  draft: false,
};

export default meta;
