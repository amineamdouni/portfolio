import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "amsdynamic",
  category: "client",
  title: "AMS Dynamic",
  summary: {
    en: "Public site of a car rental and sales business.",
    fr: "Site public d'une entreprise de location et de vente de voitures."
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
  liveUrl: "https://amsdynamic.fr/",
  shots: shotsFor("amsdynamic", [
    ["home-desktop", "Home page hero.", "Bannière de la page d'accueil."],
    ["vehicles-desktop", "Carousel of cars to rent on the home page.", "Carrousel des voitures à louer sur la page d'accueil."],
    ["home-mobile", "Home page on a phone.", "Page d'accueil sur téléphone."],
  ]),
  featured: false,
  order: 5,
  draft: false,
};

export default meta;
