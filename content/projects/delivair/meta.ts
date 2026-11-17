import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "delivair",
  category: "mobile",
  title: "DelivAir",
  summary: {
    en: "Mobile app that connects travellers with spare luggage space to people who want to send packages.",
    fr: "Application mobile qui met en relation des voyageurs ayant de la place dans leurs bagages et des personnes qui veulent envoyer un colis."
  },
  role: {
    en: "Solo project",
    fr: "Projet solo"
  },
  team: {
    kind: "solo"
  },
  dates: {
    start: "2022-11",
    end: "2023-01"
  },
  stack: [
    "React Native",
    "Expo",
    "Expo Router",
    "TypeScript",
    "Reanimated",
    "zustand",
    "Playwright"
  ],
  demoUrl: "https://delivair-demo.vercel.app",
  healthUrl: null,
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: shotsFor("delivair", [
    ["home-mobile", "Home screen: a plane over a pink and green sky, with From and To fields to search for travellers.", "Écran d'accueil : un avion sur un ciel rose et vert, avec les champs Départ et Arrivée pour chercher des voyageurs."],
    ["login-mobile", "Login screen with the \"Continue as demo user\" button.", "Écran de connexion avec le bouton pour continuer en utilisateur de démo."],
    ["search-rules-mobile", "Search from Tunis to Paris, with stacked cards on luggage rules before confirming.", "Recherche de Tunis à Paris, avec des cartes empilées sur les règles des bagages avant de confirmer."],
    ["search-flight-mobile", "Search animation: the plane flies while the app looks for travellers.", "Animation de recherche : l'avion vole pendant que l'application cherche des voyageurs."],
    ["search-results-mobile", "Search result: a traveller from Tunis to Paris with 12 kg of free space.", "Résultat de recherche : un voyageur de Tunis à Paris avec 12 kg de place libre."],
    ["all-requests-mobile", "All travellers' offers with free weight, date, route and a note.", "Toutes les offres des voyageurs avec le poids libre, la date, le trajet et une note."],
    ["conversation-mobile", "Chat with a traveller, with a banner saying the replies are simulated.", "Discussion avec un voyageur, avec un bandeau indiquant que les réponses sont simulées."],
    ["profile-mobile", "Profile of the sample user with contact details and a contact list.", "Profil de l'utilisateur d'exemple avec ses coordonnées et une liste de contacts."],
    ["admin-dashboard", "Admin dashboard with monthly charts of users and trips.", "Tableau de bord d'administration avec les graphiques mensuels des utilisateurs et des trajets."],
    ["admin-users", "Admin list of users with city, phone, email and rating.", "Liste d'administration des utilisateurs avec ville, téléphone, e-mail et note."],
    ["admin-trips", "Admin list of posted trips with route, dates, contents and weight.", "Liste d'administration des trajets publiés avec trajet, dates, contenu et poids."],
    // More screenshots in public/shots/delivair/, not shown in the gallery (uncomment to show):
    // ["intro-mobile", "Opening screen with the sample-data notice and a Continue button.", "Écran d'ouverture avec l'avis sur les données d'exemple et un bouton Continuer."],
  ]),
  tryThis: {
    en: [
      "Tap \"Continue as demo user\" on the login screen.",
      "On Home, enter Tunis and Paris and confirm: watch the plane search, then swipe through the travellers found.",
      "Open a traveller and send a message (replies are scripted), then use \"Reset demo\" to start over."
    ],
    fr: [
      "Touchez « Continue as demo user » (continuer en utilisateur de démo) sur l'écran de connexion.",
      "Sur l'accueil, saisissez Tunis et Paris puis confirmez : l'avion cherche, puis faites défiler les voyageurs trouvés.",
      "Ouvrez un voyageur et envoyez un message (les réponses sont scriptées), puis « Reset demo » pour recommencer."
    ]
  },
  featured: true,
  order: 1,
  draft: false,
};

export default meta;
