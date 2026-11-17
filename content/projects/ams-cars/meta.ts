import type { ProjectMeta } from "../types";

// TODO (Wave 4): fill summary/role/dates where null, demoUrl, healthUrl, liveUrl, shots.
// No invented facts: leave a field null until a build report confirms it.
// TODO (Wave 4): demoLogin with the public demo-only credentials, if the app has them.
const meta: ProjectMeta = {
  slug: "ams-cars",
  category: "fullstack",
  title: "AMS Cars",
  summary: null,
  role: {
    en: "Solo project",
    fr: "Projet solo"
  },
  team: {
    kind: "solo"
  },
  dates: null,
  stack: [
    "NestJS",
    "Prisma",
    "PostgreSQL"
  ],
  demoUrl: null,
  healthUrl: null,
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: [],
  architecture: [
    {
      title: "Clients",
      nodes: [
        {
          name: "Customer site"
        },
        {
          name: "Admin dashboard"
        }
      ],
      arrow: "accent"
    },
    {
      title: "API · NestJS",
      kind: "accent",
      nodes: [
        {
          name: "REST API",
          note: "Prisma"
        },
        {
          name: "/health"
        }
      ],
      arrow: "plain"
    },
    {
      title: "Data",
      nodes: [
        {
          name: "PostgreSQL",
          note: "amscars schema"
        }
      ]
    }
  ],
  featured: false,
  order: 2,
  draft: true
};

export default meta;
