import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "mangadana",
  category: "ecommerce",
  title: "MangaDana",
  summary: {
    en: "Early online shop for manga-inspired clothing and accessories. Screenshots only.",
    fr: "Première boutique en ligne de vêtements et accessoires inspirés des mangas. Captures d'écran uniquement."
  },
  role: {
    en: "Solo project",
    fr: "Projet solo"
  },
  team: {
    kind: "solo"
  },
  dates: {
    start: "2022-12",
    end: "2022-12"
  },
  stack: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "MongoDB",
    "Mongoose",
    "TypeScript",
    "Playwright"
  ],
  demoUrl: null,
  healthUrl: null,
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: shotsFor("mangadana", [
    ["mangadana-shop-desktop", "Shop page with the product grid.", "Page boutique avec la grille de produits."],
    ["mangadana-product-desktop", "Product page with photos, price and the add-to-cart button.", "Fiche produit avec photos, prix et bouton d'ajout au panier."],
    ["mangadana-cart-desktop", "Cart with the selected items and the total.", "Panier avec les articles choisis et le total."],
    ["mangadana-shop-mobile", "Shop page on a phone.", "Page boutique sur téléphone."],
  ]),
  featured: false,
  order: 1,
  draft: false,
};

export default meta;
