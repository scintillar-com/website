import type { Locale, Localized } from "@/i18n/config";

export const statuses = ["available", "in-progress", "planned"] as const;
export type Status = (typeof statuses)[number];

export const categories = ["docs-design", "feedback-support", "operations"] as const;
export type Category = (typeof categories)[number];

/** Which mock UI the project's cover renders (see components/projects/project-cover.tsx). */
export type CoverKind = "docs" | "components" | "tokens" | "brand" | "upvotes" | "tickets" | "uptime";

export interface Project {
  slug: string;
  name: string;
  /** Short subtitle under the name, like "Documentation engine". */
  kind: Localized;
  /** One line, shown on every card. */
  pitch: Localized;
  description: Localized;
  status: Status;
  category: Category;
  tags: Localized<string[]>;
  license: string | null;
  /** Public GitHub repo. Leave unset while the repo is private or doesn't exist. */
  github?: string;
  /** True when a repo exists but is still private. */
  repoPrivate?: boolean;
  links?: { live?: string; npm?: string };
  features: Localized<string[]>;
  /** Shell commands to get started, for available projects. */
  install?: string[];
  /** What's next, for projects that aren't available yet. */
  roadmap?: Localized;
  cover: CoverKind;
  /** Shown large at the top of its category in Browse mode. */
  featured?: boolean;
}

export const categoryInfo: Record<Category, { title: Localized; description: Localized }> = {
  "docs-design": {
    title: { en: "Docs & Design", fr: "Docs et design" },
    description: {
      en: "Document components, run design systems and package brands.",
      fr: "Documenter des composants, faire vivre des design systems et livrer des marques.",
    },
  },
  "feedback-support": {
    title: { en: "Feedback & Support", fr: "Rétroaction et support" },
    description: {
      en: "Collect what users ask for and answer their support requests.",
      fr: "Recueillir ce que les utilisateurs demandent et répondre à leurs demandes de support.",
    },
  },
  operations: {
    title: { en: "Operations", fr: "Opérations" },
    description: {
      en: "Keep people informed about the services you run.",
      fr: "Tenir les gens informés de l'état des services que vous opérez.",
    },
  },
};

export const projects: Project[] = [
  {
    slug: "docs-shell",
    name: "Docs Shell",
    kind: { en: "Documentation sites", fr: "Sites de documentation" },
    pitch: {
      en: "A polished documentation site from day one, with a component showcase when you need one.",
      fr: "Un site de documentation soigné dès le premier jour, avec une vitrine de composants au besoin.",
    },
    description: {
      en: "Write your docs and get a site that's ready to share: search, versions, English and French, light and dark themes, all under your own brand. Need to present a component library? Registry Shell adds live previews and copy-ready install instructions for every component. The Scintillar UI site runs on it.",
      fr: "Rédigez votre documentation et obtenez un site prêt à partager : recherche, versions, anglais et français, thèmes clair et sombre, le tout sous votre propre marque. Besoin de présenter une bibliothèque de composants? Registry Shell ajoute des aperçus en direct et des instructions d'installation prêtes à copier pour chaque composant. Le site de Scintillar UI fonctionne avec.",
    },
    status: "available",
    category: "docs-design",
    tags: { en: ["Documentation", "Search", "Design systems"], fr: ["Documentation", "Recherche", "Design systems"] },
    license: "MIT",
    github: "https://github.com/scintillar-com/docs",
    links: { live: "https://ui.sntlr.app", npm: "https://www.npmjs.com/package/@sntlr/registry-shell" },
    features: {
      en: [
        "Search across every page",
        "Versions, so readers find the docs for what they use",
        "English and French built in",
        "Your logo, colors and domain",
        "Component showcase with live previews",
        "Host it anywhere",
      ],
      fr: [
        "Recherche dans toutes les pages",
        "Versions, pour que chacun trouve la documentation de ce qu'il utilise",
        "Anglais et français inclus",
        "Votre logo, vos couleurs, votre domaine",
        "Vitrine de composants avec aperçus en direct",
        "Hébergez-le n'importe où",
      ],
    },
    install: ["npm install -D @sntlr/registry-shell", "npx registry-shell init"],
    cover: "docs",
    featured: true,
  },
  {
    slug: "scintillar-ui",
    name: "Scintillar UI",
    kind: { en: "Interface components", fr: "Composants d'interface" },
    pitch: {
      en: "Ready-made buttons, forms, tables and screens that take on your brand.",
      fr: "Des boutons, formulaires, tableaux et écrans prêts à l'emploi, aux couleurs de votre marque.",
    },
    description: {
      en: "A library of 43 interface components and 19 complete screens, from buttons and forms to sign-in pages and account settings. Each one comes with accessibility notes and picks up your brand colors. Take only what you need; it becomes part of your app.",
      fr: "Une bibliothèque de 43 composants d'interface et 19 écrans complets, des boutons et formulaires jusqu'aux pages de connexion et aux paramètres de compte. Chacun vient avec des notes d'accessibilité et prend les couleurs de votre marque. Prenez seulement ce dont vous avez besoin; il devient partie de votre application.",
    },
    status: "available",
    category: "docs-design",
    tags: { en: ["Components", "Design system", "Accessibility"], fr: ["Composants", "Design system", "Accessibilité"] },
    license: "MIT",
    github: "https://github.com/scintillar-com/ui",
    links: { live: "https://ui.sntlr.app" },
    features: {
      en: [
        "43 components and 19 ready-made screens",
        "Sign-in, profile and team settings screens included",
        "Accessibility notes for every component",
        "Docs in English and French",
      ],
      fr: [
        "43 composants et 19 écrans prêts à l'emploi",
        "Écrans de connexion, de profil et de paramètres d'équipe inclus",
        "Notes d'accessibilité pour chaque composant",
        "Documentation en anglais et en français",
      ],
    },
    install: ["npx shadcn@latest add https://ui.sntlr.app/r/button.json"],
    cover: "components",
  },
  {
    slug: "jev-design-system",
    name: "JEV Design System",
    kind: { en: "Design consistency", fr: "Cohérence du design" },
    pitch: {
      en: "Spot design inconsistencies before your users do.",
      fr: "Repérez les incohérences de design avant vos utilisateurs.",
    },
    description: {
      en: "Describe what each color, spacing and type style in your design system is allowed to mean, and JEV Design System checks your designs against it. When it's confident something clashes, it asks a stronger AI model for a fix, so your product stays consistent as it grows.",
      fr: "Décrivez ce que chaque couleur, espacement et style typographique de votre design system a le droit de signifier, et JEV Design System vérifie vos designs en conséquence. Quand il est sûr qu'un élément détonne, il demande une correction à un modèle d'IA plus puissant, pour que votre produit reste cohérent en grandissant.",
    },
    status: "planned",
    category: "docs-design",
    tags: { en: ["Design systems", "Consistency", "AI"], fr: ["Design systems", "Cohérence", "IA"] },
    license: null,
    features: {
      en: [
        "Rules for what each color, spacing and type style may be used for",
        "Automatic conflict detection",
        "AI suggestions when a conflict is clear",
      ],
      fr: [
        "Des règles sur l'usage de chaque couleur, espacement et style typographique",
        "Détection automatique des conflits",
        "Suggestions de l'IA quand un conflit est clair",
      ],
    },
    roadmap: {
      en: "Planned. Not available yet.",
      fr: "Prévu. Pas encore disponible.",
    },
    cover: "tokens",
  },
  {
    slug: "branding-guide-automation",
    name: "Branding Guide Automation",
    kind: { en: "Brand kits", fr: "Trousses de marque" },
    pitch: {
      en: "Describe a brand once and get the full brand kit.",
      fr: "Décrivez une marque une seule fois et obtenez toute la trousse.",
    },
    description: {
      en: "Fill in a brand once and get everything a brand delivery needs: organized folders for logos, fonts, prints and templates, a brand guide and an itemized estimate. An early prototype exists, and a new version is planned.",
      fr: "Remplissez une marque une seule fois et obtenez tout ce qu'une livraison de marque demande : des dossiers organisés pour les logos, polices, imprimés et gabarits, un guide de marque et une estimation détaillée. Un premier prototype existe et une nouvelle version est prévue.",
    },
    status: "planned",
    category: "docs-design",
    tags: { en: ["Branding", "Brand guide", "Estimates"], fr: ["Image de marque", "Guide de marque", "Estimations"] },
    license: null,
    repoPrivate: true,
    features: {
      en: ["Organized brand-kit folders", "A brand guide, generated for you", "Itemized estimates", "English and French"],
      fr: ["Dossiers de trousse de marque organisés", "Un guide de marque, généré pour vous", "Estimations détaillées", "Anglais et français"],
    },
    roadmap: {
      en: "An early prototype exists, and a new version is planned.",
      fr: "Un premier prototype existe et une nouvelle version est prévue.",
    },
    cover: "brand",
  },
  {
    slug: "feature-requests",
    name: "Feature Requests",
    kind: { en: "Feedback boards", fr: "Tableaux de suggestions" },
    pitch: {
      en: "Let users suggest features and vote for what matters to them.",
      fr: "Laissez vos utilisateurs suggérer des fonctionnalités et voter pour ce qui compte.",
    },
    description: {
      en: "A public board where users suggest features for your products and vote for the ideas they care about, so you know what people want before you decide what to build.",
      fr: "Un tableau public où les utilisateurs proposent des fonctionnalités pour vos produits et votent pour les idées qui leur tiennent à cœur, pour savoir ce que les gens veulent avant de décider quoi construire.",
    },
    status: "planned",
    category: "feedback-support",
    tags: { en: ["Feedback", "Roadmap", "Community"], fr: ["Rétroaction", "Feuille de route", "Communauté"] },
    license: null,
    repoPrivate: true,
    features: {
      en: ["One board per product", "Suggestions and votes", "Public: anyone can see what others asked for"],
      fr: ["Un tableau par produit", "Suggestions et votes", "Public : tout le monde voit ce que les autres ont demandé"],
    },
    roadmap: {
      en: "Planned. Not available yet.",
      fr: "Prévu. Pas encore disponible.",
    },
    cover: "upvotes",
  },
  {
    slug: "support",
    name: "Support Desk",
    kind: { en: "Help desk", fr: "Centre d'aide" },
    pitch: {
      en: "One support inbox that sends tickets where your team already works.",
      fr: "Une seule boîte de support qui envoie les billets là où votre équipe travaille déjà.",
    },
    description: {
      en: "Answer support requests from one place. Keep tickets in Support Desk, or send them to GitHub, Notion or the other tools your team already uses.",
      fr: "Répondez aux demandes de support à partir d'un seul endroit. Gardez les billets dans Support Desk ou envoyez-les vers GitHub, Notion ou les autres outils que votre équipe utilise déjà.",
    },
    status: "planned",
    category: "feedback-support",
    tags: { en: ["Support", "Tickets", "Integrations"], fr: ["Support", "Billets", "Intégrations"] },
    license: null,
    repoPrivate: true,
    features: {
      en: ["Built-in ticket inbox", "Send tickets to GitHub, Notion and other tools"],
      fr: ["Boîte de billets intégrée", "Envoi des billets vers GitHub, Notion et d'autres outils"],
    },
    roadmap: {
      en: "Planned. Not available yet.",
      fr: "Prévu. Pas encore disponible.",
    },
    cover: "tickets",
  },
  {
    slug: "status",
    name: "Status Pages",
    kind: { en: "Status pages", fr: "Pages de statut" },
    pitch: {
      en: "One clear page that tells your users whether everything is up.",
      fr: "Une page claire qui dit à vos utilisateurs si tout fonctionne.",
    },
    description: {
      en: "Connect the services you run and get a single public page that shows whether they're up, under your own brand and domain.",
      fr: "Branchez les services que vous opérez et obtenez une seule page publique qui montre s'ils fonctionnent, sous votre propre marque et votre domaine.",
    },
    status: "planned",
    category: "operations",
    tags: { en: ["Uptime", "Monitoring", "Status page"], fr: ["Disponibilité", "Surveillance", "Page de statut"] },
    license: null,
    repoPrivate: true,
    features: {
      en: ["Connects to the services you run", "One public status page for all of them"],
      fr: ["Se branche aux services que vous opérez", "Une seule page de statut publique pour tous"],
    },
    roadmap: {
      en: "Planned. Not available yet.",
      fr: "Prévu. Pas encore disponible.",
    },
    cover: "uptime",
    featured: true,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Search text for a project in one locale: name, kind, pitch and tags. */
export function searchText(p: Project, locale: Locale) {
  return [p.name, p.kind[locale], p.pitch[locale], ...p.tags[locale]].join(" ").toLowerCase();
}
