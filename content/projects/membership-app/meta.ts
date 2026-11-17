import { shotsFor } from "../shots";
import type { ProjectMeta } from "../types";

const meta: ProjectMeta = {
  slug: "membership-app",
  category: "mobile",
  title: "Membership app",
  summary: {
    en: "Membership app for members, coaches and founders, on web and mobile (rebuilt demo).",
    fr: "Application d'abonnement pour membres, coachs et fondateurs, sur web et mobile (démo reconstruite)."
  },
  role: {
    en: "Full-stack developer, team project",
    fr: "Développeur full-stack, projet d'équipe"
  },
  team: {
    kind: "team",
    size: null
  },
  dates: {
    start: "2026-07",
    end: null
  },
  stack: [
    "React Native",
    "Expo",
    "Expo Router",
    "TypeScript",
    "zustand",
    "React Query",
    "zod",
    "Playwright"
  ],
  demoUrl: "https://membership-app-demo.vercel.app",
  healthUrl: null,
  repo: {
    visibility: "private",
    url: null
  },
  liveUrl: null,
  shots: shotsFor("membership-app", [
    ["member-home-mobile", "Member home: level, weekly challenge, orders, coin balance and the main modules.", "Accueil du membre : niveau, défi de la semaine, commandes, solde de pièces et modules principaux."],
    ["role-picker-mobile", "Demo login: choose Member, Coach or Founder, no password.", "Connexion de démo : choisir Membre, Coach ou Fondateur, sans mot de passe."],
    ["member-academy-mobile", "Academy: tracks to choose from and the chapters of the current track.", "Académie : les parcours au choix et les chapitres du parcours en cours."],
    ["member-chapter-mobile", "A chapter with its lessons, progress and the chapter quiz.", "Un chapitre avec ses leçons, la progression et le quiz du chapitre."],
    ["member-majlis-mobile", "Community hub with stats, a members-only room and chat rooms.", "Espace communauté avec statistiques, salon réservé aux membres et salons de discussion."],
    ["member-home-ar-mobile", "The member home in Arabic, laid out right to left.", "L'accueil du membre en arabe, de droite à gauche."],
    ["coach-intake-review-mobile", "Intake review: the client's plan, details, goals and lifestyle before approval.", "Examen d'une admission : formule, informations, objectifs et mode de vie du client avant validation."],
    ["founder-reports-mobile", "Founder's moderation queue with reported messages and actions.", "File de modération du fondateur avec les messages signalés et les actions."],
    // More screenshots in public/shots/membership-app/, not shown in the gallery (uncomment to show):
    // ["intro-mobile", "Opening screen with the sample-data notice and a Continue button.", "Écran d'ouverture avec l'avis sur les données d'exemple et un bouton Continuer."],
    // ["member-fitness-mobile", "Fitness coaching: find a coach, the member's coach and subscription, and categories.", "Coaching sportif : trouver un coach, le coach et l'abonnement du membre, et les catégories."],
    // ["member-profile-mobile", "Member profile with level, XP, score and the next target.", "Profil du membre avec niveau, XP, score et prochain objectif."],
    // ["coach-dashboard-mobile", "Coach dashboard with active clients, pending intakes, messages and monthly revenue.", "Tableau de bord du coach : clients actifs, admissions en attente, messages et revenus du mois."],
    // ["coach-clients-mobile", "Coach's client list filtered by status.", "Liste des clients du coach, filtrée par statut."],
    // ["founder-team-mobile", "Team page: invite by email, pending invitations and members.", "Page équipe : invitation par e-mail, invitations en attente et membres."],
  ]),
  tryThis: {
    en: [
      "Log in as Member and open the academy: read a lesson, answer the quiz and watch the level go up.",
      "Visit the leaderboard and a voice room, then use \"Switch role\" to become Coach and approve an intake form.",
      "Switch to Arabic to see the right-to-left layout. \"Reset demo\" restores the start."
    ],
    fr: [
      "Connectez-vous en Membre et ouvrez l'académie : lisez une leçon, répondez au quiz et regardez le niveau monter.",
      "Passez par le classement et un salon vocal, puis « Changer de rôle » pour devenir Coach et approuver un formulaire d'admission.",
      "Passez en arabe pour voir la mise en page de droite à gauche. « Réinitialiser la démo » remet tout à zéro."
    ]
  },
  featured: false,
  order: 3,
  draft: false,
};

export default meta;
