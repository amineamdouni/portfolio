import type { ProjectMeta } from "../types";

// TODO (Wave 4): fill summary/role/dates where null, demoUrl, healthUrl, liveUrl, shots.
// No invented facts: leave a field null until a build report confirms it.
// TODO (Wave 4): demoLogin with the public demo-only credentials, if the app has them.
const meta: ProjectMeta = {
  slug: "sift",
  category: "fullstack",
  title: "Sift",
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
    "Java",
    "Spring Boot",
    "PostgreSQL",
    "Flyway",
    "React"
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
  featured: false,
  order: 3,
  draft: true
};

export default meta;
