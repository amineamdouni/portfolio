import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "depogro",
  category: "mobile",
  title: "DepoGro",
  summary: {
    en: "B2B ordering and delivery app, released on the App Store and Google Play.",
    fr: "Application B2B de commande et de livraison, publiée sur l'App Store et Google Play."
  },
  role: {
    en: "Agile team lead",
    fr: "Chef d'équipe Agile"
  },
  team: {
    kind: "team",
    size: 6
  },
  dates: {
    start: "2024-01",
    end: "2024-10"
  },
  stack: [
    "React Native",
    "Expo",
    "TypeScript",
    "React Navigation",
    "zustand",
    "i18next"
  ],
  demoUrl: "https://depogro-demo.vercel.app",
  healthUrl: null,
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: shotsFor("depogro", [
    ["client-home-mobile", "Shop home in French: a promotion banner, offers and the catalogue.", "Accueil de la boutique en français : bannière de promotion, offres et catalogue."],
    ["role-picker-mobile", "Demo login: choose Client, Sales rep or Deliverer.", "Connexion de démo : choisir Client, Commercial ou Livreur."],
    ["client-category-mobile", "Oils and preserves category with prices and add-to-cart buttons.", "Catégorie huiles et conserves, avec prix et boutons d'ajout au panier."],
    ["client-product-mobile", "Product page with the unit price and bulk discounts.", "Fiche produit avec le prix unitaire et les remises par quantité."],
    ["client-cart-mobile", "Shop's cart with quantities, totals and the minimum order amount.", "Panier de la boutique avec quantités, totaux et montant minimum de commande."],
    ["client-tracking-mobile", "Order tracking: pending, confirmed, shipped and delivered steps.", "Suivi de commande : étapes en attente, confirmée, expédiée et livrée."],
    ["client-home-ar-mobile", "The same shop home in Arabic, laid out right to left.", "Le même accueil de boutique en arabe, de droite à gauche."],
    ["deliverer-dashboard-mobile", "Deliverer dashboard with availability and four tiles: completed, pending, collected and earnings.", "Tableau de bord du livreur avec sa disponibilité et quatre tuiles : terminées, en attente, encaissé et gains."],
    ["admin-orders", "Admin dashboard: orders with their status and filters.", "Tableau de bord : les commandes avec leur statut et des filtres."],
    ["admin-order-detail", "Order detail in the admin dashboard, with the customer, items and status.", "Détail d'une commande dans le tableau de bord, avec le client, les articles et le statut."],
    ["admin-order-shipped", "The same order after it is marked as shipped.", "La même commande après son passage au statut expédiée."],
    ["admin-products", "Product catalogue in the admin dashboard.", "Catalogue des produits dans le tableau de bord."],
    ["admin-ambassadors", "Ambassadors in the admin dashboard, with their sales progress.", "Les ambassadeurs dans le tableau de bord, avec leur progression des ventes."],
    ["admin-ads", "Ads shown in the app, managed from the admin dashboard.", "Les publicités affichées dans l'application, gérées depuis le tableau de bord."],
    // More screenshots in public/shots/depogro/, not shown in the gallery (uncomment to show):
    // ["intro-mobile", "Opening screen with the sample-data notice in Arabic, French and English.", "Écran d'ouverture avec l'avis sur les données d'exemple en arabe, français et anglais."],
    // ["onboarding-mobile", "Onboarding screen with a language choice and the sign-in button.", "Écran de présentation avec le choix de la langue et le bouton de connexion."],
    // ["client-orders-mobile", "Order history with the status and amount of each order.", "Historique des commandes avec le statut et le montant de chaque commande."],
    // ["rep-clients-mobile", "Sales rep's list of client shops with an \"Add a client\" button.", "Liste des boutiques clientes du commercial avec un bouton « Ajouter un client »."],
    // ["rep-cart-mobile", "Sales rep's cart for an order taken on a client's behalf.", "Panier du commercial pour une commande passée au nom d'un client."],
    // ["rep-profile-mobile", "Sales rep's profile with progress toward the sales target.", "Profil du commercial avec la progression vers l'objectif de ventes."],
    // ["deliverer-deliveries-mobile", "Deliverer's assigned deliveries with Accept buttons.", "Livraisons assignées au livreur avec des boutons Accepter."],
  ]),
  tryThis: {
    en: [
      "Pick Client on the login screen, add a few products to the cart and check out.",
      "Open the order and follow its tracking steps, then switch the app to Arabic.",
      "Log out, pick Deliverer and accept the order you just placed. \"Reset demo\" restores the start."
    ],
    fr: [
      "Choisissez Client sur l'écran de connexion, ajoutez quelques produits au panier et validez.",
      "Ouvrez la commande et suivez ses étapes, puis passez l'application en arabe.",
      "Déconnectez-vous, choisissez Livreur et acceptez la commande passée. « Réinitialiser la démo » remet tout à zéro."
    ]
  },
  featured: true,
  order: 2,
  draft: false,
};

export default meta;
