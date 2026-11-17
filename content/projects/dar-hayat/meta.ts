import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "dar-hayat",
  category: "client",
  title: "Dar Hayat",
  summary: {
    en: "Site for a custom wooden construction business.",
    fr: "Site d'une entreprise de constructions en bois sur mesure."
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
  liveUrl: "https://dar-hayat.vercel.app/",
  shots: shotsFor("dar-hayat", [
    ["home-desktop", "Home page with the logo.", "Page d'accueil avec le logo."],
    ["constructions-desktop", "Section on custom wooden constructions, with photos.", "Section sur les constructions en bois sur mesure, avec photos."],
    ["home-mobile", "Home page on a phone, opening on a hero image.", "Page d'accueil sur téléphone, qui s'ouvre sur une image."],
  ]),
  featured: false,
  order: 6,
  draft: false,
};

export default meta;
