import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "trustit",
  category: "fullstack",
  title: "Trust IT",
  summary: {
    en: "Repair booking site: pick a device, describe the problem, then track the repair.",
    fr: "Site de réservation de réparations : choisir l'appareil, décrire le problème, suivre la réparation."
  },
  role: {
    en: "Solo, at InnoThink",
    fr: "Solo, chez InnoThink"
  },
  team: {
    kind: "solo"
  },
  dates: {
    start: "2023",
    end: "2023"
  },
  stack: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "NestJS",
    "Prisma",
    "PostgreSQL",
    "TypeScript",
    "Jest",
    "Playwright"
  ],
  demoUrl: "https://trustit-demo.vercel.app",
  healthUrl: "https://trustit-api.onrender.com/health",
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: shotsFor("trustit", [
    ["home-desktop", "Home page with the booking entry point and \"Why Trust iT?\".", "Page d'accueil avec l'entrée de réservation et « Why Trust iT? »."],
    ["tracking-desktop", "Tracking the sample code DEMO42: device, repair centre and the timeline of stages.", "Suivi du code d'exemple DEMO42 : appareil, centre de réparation et chronologie des étapes."],
    ["login-desktop", "Login page with the demo-user button and the sample tracking code.", "Page de connexion avec le bouton utilisateur de démo et le code de suivi d'exemple."],
    ["home-mobile", "Home page on a phone.", "Page d'accueil sur téléphone."],
  ]),
  architecture: [
    {
      title: "Client",
      nodes: [
        {
          name: { en: "Browser", fr: "Navigateur" }
        }
      ],
      arrow: "plain"
    },
    {
      title: "Web · Next.js",
      kind: "accent",
      nodes: [
        {
          name: { en: "Customer site", fr: "Site client" }
        }
      ],
      arrow: "accent"
    },
    {
      title: "API · NestJS",
      nodes: [
        {
          name: { en: "REST API", fr: "API REST" },
          note: "Prisma"
        },
        {
          name: "/health"
        }
      ],
      arrow: "plain"
    },
    {
      title: { en: "Data", fr: "Données" },
      nodes: [
        {
          name: "PostgreSQL",
          note: { en: "trustit schema", fr: "schéma trustit" }
        }
      ]
    }
  ],
  demoHint: {
    en: "No password needed: use \"Log in as demo user\" on the site. To track a repair without logging in, enter the sample code DEMO42.",
    fr: "Pas de mot de passe : utilisez le bouton « Log in as demo user » sur le site. Pour suivre une réparation sans connexion, saisissez le code d'exemple DEMO42."
  },
  featured: true,
  order: 1,
  draft: false,
};

export default meta;
