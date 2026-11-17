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
  // TODO (shots batch 2/3): add screenshots with shotsFor("sift", [...]).
  shots: shotsFor("sift", []),
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
