import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "ams-cars",
  category: "fullstack",
  title: "AMS Cars",
  summary: {
    en: "Car rental and sales system: customer site, admin dashboard and API.",
    fr: "Système de location et de vente de voitures : site client, tableau de bord et API."
  },
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
    "PostgreSQL",
    "Next.js",
    "React",
    "Tailwind CSS",
    "TypeScript",
    "Playwright"
  ],
  demoUrl: "https://ams-cars-site-iota.vercel.app",
  healthUrl: "https://ams-cars-api.onrender.com/health",
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: shotsFor("ams-cars", [
    ["home-desktop", "Customer site home page with the hero and the brand row.", "Accueil du site client avec la bannière et la rangée de marques."],
    ["car-detail-desktop", "Car page with specs, rates and the availability form.", "Fiche voiture avec caractéristiques, tarifs et formulaire de disponibilité."],
    ["admin-cars-desktop", "Admin dashboard: the table of cars to rent.", "Tableau de bord : la liste des voitures à louer."],
    ["home-mobile", "Customer site home page on a phone.", "Accueil du site client sur téléphone."],
  ]),
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
  demoHint: {
    en: "The customer site needs no login. In the admin dashboard, use the \"Log in as demo admin\" button.",
    fr: "Le site client ne demande pas de connexion. Dans le tableau de bord, utilisez le bouton de connexion en administrateur de démo."
  },
  links: [
    {
      label: {
        en: "Admin dashboard (demo)",
        fr: "Tableau de bord (démo)"
      },
      url: "https://ams-cars-admin.vercel.app"
    },
    {
      label: {
        en: "The client's live site",
        fr: "Le site en ligne du client"
      },
      url: "https://amsdynamic.fr/"
    }
  ],
  featured: false,
  order: 2,
  draft: false,
};

export default meta;
