import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "smiling-ortho",
  category: "client",
  title: "Smiling Ortho",
  summary: {
    en: "Product site built for a client.",
    fr: "Site de produits réalisé pour un client."
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
  liveUrl: "https://www.smilingortho.site/",
  shots: shotsFor("smiling-ortho", [
    ["home-desktop", "Home page hero.", "Bannière de la page d'accueil."],
    ["products-desktop", "Products page with the product grid.", "Page des produits avec la grille de produits."],
    ["home-mobile", "Home page on a phone.", "Page d'accueil sur téléphone."],
  ]),
  featured: false,
  order: 3,
  draft: false,
};

export default meta;
