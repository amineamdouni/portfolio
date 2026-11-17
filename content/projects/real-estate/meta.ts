import type { ProjectMeta } from "../types";

// TODO (Wave 4): fill summary/role/dates where null, demoUrl, healthUrl, liveUrl, shots.
// No invented facts: leave a field null until a build report confirms it.
const meta: ProjectMeta = {
  slug: "real-estate",
  category: "client",
  title: "Real estate site",
  summary: null,
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
  shots: [],
  featured: false,
  order: 7,
  draft: true
};

export default meta;
