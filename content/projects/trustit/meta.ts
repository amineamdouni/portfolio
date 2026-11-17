import type { ProjectMeta } from "../types";

// TODO (Wave 4): fill summary/role/dates where null, demoUrl, healthUrl, liveUrl, shots.
// No invented facts: leave a field null until a build report confirms it.
// TODO (Wave 4): demoLogin with the public demo-only credentials, if the app has them.
const meta: ProjectMeta = {
  slug: "trustit",
  category: "fullstack",
  title: "Trust IT",
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
    "Next.js",
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
      title: "Client",
      nodes: [
        {
          name: "Browser"
        }
      ],
      arrow: "plain"
    },
    {
      title: "Web · Next.js",
      kind: "accent",
      nodes: [
        {
          name: "Customer site"
        }
      ],
      arrow: "accent"
    },
    {
      title: "API · NestJS",
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
          note: "trustit schema"
        }
      ]
    }
  ],
  featured: true,
  order: 1,
  draft: true
};

export default meta;
