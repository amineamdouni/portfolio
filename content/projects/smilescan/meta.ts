import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "smilescan",
  category: "client",
  title: "SmileScan",
  summary: {
    en: "Service site with a price list.",
    fr: "Site de service avec une liste de tarifs."
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
  liveUrl: "https://www.smilescansolution.site/",
  shots: shotsFor("smilescan", [
    ["home-desktop", "Home page hero.", "Bannière de la page d'accueil."],
    ["pricing-desktop", "Price list and about section.", "Liste des tarifs et section à propos."],
    ["home-mobile", "Home page on a phone.", "Page d'accueil sur téléphone."],
  ]),
  featured: false,
  order: 9,
  draft: false,
};

export default meta;
