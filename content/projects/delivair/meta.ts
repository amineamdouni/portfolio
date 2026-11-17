import type { ProjectMeta } from "../types";

// TODO (Wave 4): fill summary/role/dates where null, demoUrl, healthUrl, liveUrl, shots.
// No invented facts: leave a field null until a build report confirms it.
const meta: ProjectMeta = {
  slug: "delivair",
  category: "mobile",
  title: "DelivAir",
  summary: {
    en: "Mobile app that connects travellers with spare luggage space to people who want to send packages.",
    fr: "Application mobile qui met en relation des voyageurs ayant de la place dans leurs bagages et des personnes qui veulent envoyer un colis."
  },
  role: {
    en: "Solo project",
    fr: "Projet solo"
  },
  team: {
    kind: "solo"
  },
  dates: {
    start: "2022-11",
    end: "2023-01"
  },
  stack: [
    "React Native",
    "Expo"
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
  order: 1,
  draft: true
};

export default meta;
