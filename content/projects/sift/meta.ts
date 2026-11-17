import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

// Java API on a free host: a cold start can take 1 to 3 minutes, hence wakeMinutes: 3.
const meta: ProjectMeta = {
  slug: "sift",
  category: "fullstack",
  title: "Sift",
  summary: {
    en: "Trello-style board app with roles, drag and drop and a Spring Boot API.",
    fr: "Application de tableaux à la Trello avec rôles, glisser-déposer et API Spring Boot."
  },
  role: {
    en: "Solo project",
    fr: "Projet solo"
  },
  team: {
    kind: "solo"
  },
  dates: {
    start: "2025-08",
    end: "2025-08"
  },
  stack: [
    "Java",
    "Spring Boot",
    "PostgreSQL",
    "Flyway",
    "React",
    "TypeScript",
    "Vite",
    "TanStack Query",
    "Tailwind CSS",
    "dnd-kit",
    "Testcontainers",
    "Playwright"
  ],
  demoUrl: "https://sift-demo-beta.vercel.app",
  healthUrl: "https://sift-api-fglc.onrender.com/health",
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: shotsFor("sift", [
    ["board-desktop", "A board with columns of tickets, labels and assignees.", "Un tableau avec ses colonnes de tickets, étiquettes et personnes assignées."],
    ["ticket-desktop", "Ticket panel with description, labels, assignees, dates, checklist and comments.", "Panneau d'un ticket avec description, étiquettes, personnes assignées, dates, checklist et commentaires."],
    ["boards-desktop", "Boards home listing the two sample boards.", "Accueil des tableaux avec les deux tableaux d'exemple."],
    ["settings-labels-desktop", "Board settings for an admin: labels and categories.", "Réglages d'un tableau pour un admin : étiquettes et catégories."],
    ["settings-members-desktop", "Board settings for an admin: members and visibility.", "Réglages d'un tableau pour un admin : membres et visibilité."],
    ["login-desktop", "Login page with the \"Log in as demo user\" button.", "Page de connexion avec le bouton de connexion en utilisateur de démo."],
    ["board-mobile", "The board on a phone.", "Le tableau sur téléphone."],
  ]),
  architecture: [
    {
      title: "Client",
      nodes: [
        {
          name: "Web app"
        }
      ],
      arrow: "accent"
    },
    {
      title: "API · Spring Boot",
      kind: "accent",
      nodes: [
        {
          name: "REST API",
          note: "JWT"
        },
        {
          name: "Reorder endpoint"
        }
      ],
      arrow: "plain"
    },
    {
      title: "Data",
      nodes: [
        {
          name: "PostgreSQL",
          note: "Flyway"
        }
      ]
    }
  ],
  wakeMinutes: 3,
  demoHint: {
    en: "No password needed: use \"Log in as demo user\" in the app.",
    fr: "Pas de mot de passe : utilisez « Se connecter en utilisateur de démo » dans l'application."
  },
  featured: false,
  order: 3,
  draft: false,
};

export default meta;
