import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

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
    "React",
    "Tailwind CSS",
    "NestJS",
    "Prisma",
    "PostgreSQL",
    "next-intl",
    "TypeScript",
    "Playwright"
  ],
  demoUrl: "https://nexus-demo-henna.vercel.app",
  healthUrl: "https://nexus-api-ev6o.onrender.com/health",
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  // TODO (shots batch 2/3): add screenshots with shotsFor("nexus", [...]).
  shots: shotsFor("nexus", []),
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
  demoHint: {
    en: "No password needed: the login page has three buttons, Log in as Admin, Supervisor or Student.",
    fr: "Pas de mot de passe : la page de connexion propose trois boutons, Admin, Encadrant ou Étudiant."
  },
  featured: true,
  order: 4,
  draft: false,
};

export default meta;
