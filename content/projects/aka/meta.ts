import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "aka",
  category: "ecommerce",
  title: "AKA",
  summary: {
    en: "Early fashion online shop. Screenshots only.",
    fr: "Première boutique de mode en ligne. Captures d'écran uniquement."
  },
  role: {
    en: "Solo project",
    fr: "Projet solo"
  },
  team: {
    kind: "solo"
  },
  dates: {
    start: "2022",
    end: "2022"
  },
  stack: [
    "Next.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "Bootstrap"
  ],
  demoUrl: null,
  healthUrl: null,
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: shotsFor("aka", [
    ["shop-desktop", "Shop page with the filter sidebar and the product grid.", "Page boutique avec la barre de filtres et la grille de produits."],
    ["product-desktop", "Product page for a wool blend coat.", "Fiche produit d'un manteau en laine mélangée."],
    ["home-desktop", "Home page hero.", "Bannière de la page d'accueil."],
    ["shop-mobile", "Product grid on a phone.", "Grille de produits sur téléphone."],
  ]),
  featured: false,
  order: 2,
  draft: false,
};

export default meta;
