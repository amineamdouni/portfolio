import type { ProjectMeta } from "../types";

// TODO (Wave 4): fill summary/role/dates where null, demoUrl, healthUrl, liveUrl, shots.
// No invented facts: leave a field null until a build report confirms it.
const meta: ProjectMeta = {
  slug: "depogro",
  category: "mobile",
  title: "DepoGro",
  summary: {
    en: "B2B ordering and delivery app, released on the App Store and Google Play.",
    fr: "Application B2B de commande et de livraison, publiée sur l'App Store et Google Play."
  },
  role: {
    en: "Agile team lead",
    fr: "Chef d'équipe Agile"
  },
  team: {
    kind: "team",
    size: 6
  },
  dates: {
    start: "2024-01",
    end: "2024-10"
  },
  stack: [
    "React Native"
  ],
  demoUrl: null,
  healthUrl: null,
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: [],
  featured: true,
  order: 2,
  draft: true
};

export default meta;
