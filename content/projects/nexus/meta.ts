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
  shots: shotsFor("nexus", [
    ["admin-dashboard-desktop", "Admin dashboard with statistics on projects, students and supervisors.", "Tableau de bord administrateur avec les statistiques des projets, étudiants et encadrants."],
    ["pfes-desktop", "List of final-year projects with status, student and supervisor.", "Liste des projets de fin d'études avec statut, étudiant et encadrant."],
    ["pfe-detail-desktop", "A project page: status, progress, people and deliverables.", "Page d'un projet : statut, progression, personnes et livrables."],
    ["archive-search-desktop", "Archive search across past years, filtered by a keyword.", "Recherche dans les archives des années passées, filtrée par mot-clé."],
    ["supervisor-dashboard-desktop", "Supervisor dashboard with the projects they follow.", "Tableau de bord de l'encadrant avec les projets qu'il suit."],
    ["student-my-pfe-desktop", "Student view of their own project and its progress.", "Vue étudiant de son projet et de sa progression."],
    ["admin-dashboard-fr-desktop", "The admin dashboard in French.", "Le tableau de bord administrateur en français."],
    ["login-desktop", "Login page with the demo notice and the three demo-login buttons.", "Page de connexion avec l'avis de démo et les trois boutons de connexion de démo."],
    ["student-my-pfe-mobile", "Student project view on a phone.", "Vue du projet étudiant sur téléphone."],
    ["login-mobile", "Login page on a phone.", "Page de connexion sur téléphone."],
    // More screenshots in public/shots/nexus/, not shown in the gallery (uncomment to show):
    // ["archive-fr-desktop", "The archive in French.", "Les archives en français."],
  ]),
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
