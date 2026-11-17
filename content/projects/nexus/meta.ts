import type { ProjectMeta } from "../types";

// TODO (Wave 4): fill summary/role/dates where null, demoUrl, healthUrl, liveUrl, shots.
// No invented facts: leave a field null until a build report confirms it.
// TODO (Wave 4): demoLogin with the public demo-only credentials, if the app has them.
const meta: ProjectMeta = {
  slug: "nexus",
  category: "fullstack",
  title: "Nexus",
  summary: {
    en: "Platform that manages final-year projects for students, supervisors and admins, with separate access for each role.",
    fr: "Plateforme de gestion des projets de fin d'études pour les étudiants, les encadrants et les administrateurs, avec un accès distinct pour chaque rôle."
  },
  role: {
    en: "Solo project",
    fr: "Projet solo"
  },
  team: {
    kind: "solo"
  },
  dates: {
    start: "2025",
    end: "2026"
  },
  stack: [
    "Next.js",
    "NestJS",
    "Prisma",
    "PostgreSQL",
    "next-intl"
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
          name: "Browser",
          note: "EN / FR"
        }
      ],
      arrow: "plain"
    },
    {
      title: "Web · Next.js",
      nodes: [
        {
          name: "Admin"
        },
        {
          name: "Supervisor"
        },
        {
          name: "Student"
        }
      ],
      arrow: "accent"
    },
    {
      title: "API · NestJS",
      kind: "accent",
      nodes: [
        {
          name: "JWT auth",
          note: "roles"
        },
        {
          name: "REST API",
          note: "Prisma"
        }
      ],
      arrow: "plain"
    },
    {
      title: "Data",
      nodes: [
        {
          name: "PostgreSQL",
          note: "nexus schema"
        }
      ]
    }
  ],
  featured: true,
  order: 4,
  draft: true
};

export default meta;
