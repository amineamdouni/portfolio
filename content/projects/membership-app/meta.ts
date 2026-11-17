import type { ProjectMeta } from "../types";

// TODO (Wave 4): fill summary/role/dates where null, demoUrl, healthUrl, liveUrl, shots.
// No invented facts: leave a field null until a build report confirms it.
const meta: ProjectMeta = {
  slug: "membership-app",
  category: "mobile",
  title: "Membership app",
  summary: null,
  role: null,
  team: {
    kind: "team",
    size: null
  },
  dates: null,
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
  featured: false,
  order: 3,
  draft: true
};

export default meta;
