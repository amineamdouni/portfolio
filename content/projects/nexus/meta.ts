import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "nexus",
  category: "fullstack",
  title: "Nexus",
  summary: {
    en: "Platform that manages final-year projects for students, supervisors and admins, with messaging, follow-up alerts and an AI module that summarises reports and suggests supervisors.",
    fr: "Plateforme de gestion des projets de fin d'études pour les étudiants, les encadrants et les administrateurs, avec messagerie, alertes de suivi et un module IA qui résume les rapports et suggère des encadrants."
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
    "Claude API",
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
    ["landing-desktop", "Public landing page: what Nexus does, the life of a project and a one-click demo.", "Page d'accueil publique : ce que fait Nexus, le parcours d'un PFE et une démo en un clic."],
    ["admin-dashboard-desktop", "Admin dashboard with statistics on projects, students and supervisors.", "Tableau de bord administrateur avec les statistiques des projets, étudiants et encadrants."],
    ["pfes-desktop", "List of final-year projects with status, student and supervisor.", "Liste des projets de fin d'études avec statut, étudiant et encadrant."],
    ["pfe-detail-desktop", "A submitted project with its AI summary, keywords and theme.", "Un projet déposé avec son résumé IA, ses mots-clés et son thème."],
    ["ai-suggestions-desktop", "AI supervisor suggestions: a score, a reason and the current load for each candidate.", "Suggestions d'encadrants par l'IA : un score, une justification et la charge actuelle de chaque candidat."],
    ["messages-desktop", "Student and supervisor messages inside the project.", "Messages entre l'étudiant et l'encadrant dans le projet."],
    ["supervisors-desktop", "Supervisors with their expertise and active projects against capacity.", "Les encadrants avec leur expertise et leurs PFE actifs face à leur capacité."],
    ["settings-desktop", "Institution settings: yearly project allowance, AI spend this month and report deadline.", "Réglages de l'établissement : plafond annuel de PFE, dépenses IA du mois et date limite de dépôt."],
    ["archive-search-desktop", "Archive search across past years, filtered by a keyword.", "Recherche dans les archives des années passées, filtrée par mot-clé."],
    ["supervisor-dashboard-desktop", "Supervisor dashboard with the To watch list of projects due soon.", "Tableau de bord de l'encadrant avec la liste « À surveiller » des PFE bientôt dus."],
    ["student-my-pfe-desktop", "Student view of their own project and its progress.", "Vue étudiant de son projet et de sa progression."],
    ["admin-dashboard-fr-desktop", "The admin dashboard in French.", "Le tableau de bord administrateur en français."],
    ["landing-mobile", "Landing page on a phone.", "Page d'accueil sur téléphone."],
    ["student-my-pfe-mobile", "Student project view on a phone.", "Vue du projet étudiant sur téléphone."],
    // More screenshots in public/shots/nexus/, not shown in the gallery (uncomment to show):
    // ["login-desktop", "Login page with the demo notice and the three demo-login buttons.", "Page de connexion avec l'avis de démo et les trois boutons de connexion de démo."],
    // ["login-mobile", "Login page on a phone.", "Page de connexion sur téléphone."],
    // ["guide-desktop", "The user guide, role by role.", "Le guide d'utilisation, rôle par rôle."],
    // ["archive-fr-desktop", "The archive in French.", "Les archives en français."],
  ]),
  architecture: [
    {
      title: "Client",
      nodes: [
        {
          name: { en: "Browser", fr: "Navigateur" },
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
          name: { en: "Supervisor", fr: "Encadrant" }
        },
        {
          name: { en: "Student", fr: "Étudiant" }
        }
      ],
      arrow: "accent"
    },
    {
      title: "API · NestJS",
      kind: "accent",
      nodes: [
        {
          name: { en: "JWT auth", fr: "auth JWT" },
          note: { en: "roles", fr: "rôles" }
        },
        {
          name: { en: "REST API", fr: "API REST" },
          note: "Prisma"
        },
        {
          name: "Workers",
          note: { en: "emails · AI jobs", fr: "emails · tâches IA" }
        }
      ],
      arrow: "plain"
    },
    {
      title: { en: "Data and AI", fr: "Données et IA" },
      nodes: [
        {
          name: "PostgreSQL",
          note: { en: "nexus schema", fr: "schéma nexus" }
        },
        {
          name: "Claude API",
          note: "Haiku 5.5 · Sonnet 5.5"
        }
      ]
    }
  ],
  demoHint: {
    en: "No password needed: choose a role under See the demo on the home page, or use the Admin, Supervisor and Student buttons on the login page.",
    fr: "Pas de mot de passe : choisissez un rôle sous « Voir la démo » sur la page d'accueil, ou utilisez les boutons Admin, Encadrant et Étudiant de la page de connexion."
  },
  featured: true,
  order: 4,
  draft: false,
};

export default meta;
