import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "fk-km",
  category: "client",
  title: "FK-KM",
  summary: {
    en: "Landing page for an energy renovation company. Live demo copy.",
    fr: "Page d'accueil pour une entreprise de rénovation énergétique. Copie de démonstration en ligne."
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
  demoUrl: "https://fk-km.vercel.app",
  healthUrl: null,
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: shotsFor("fk-km", [
    ["home-desktop", "Landing page hero.", "Bannière de la page d'accueil."],
    ["products-desktop", "\"Nos produits\" section with the four products.", "Section « Nos produits » avec les quatre produits."],
    ["home-mobile", "Landing page on a phone.", "Page d'accueil sur téléphone."],
  ]),
  featured: false,
  order: 2,
  draft: false,
};

export default meta;
