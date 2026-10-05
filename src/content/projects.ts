import type { Locale, Localized } from "@/i18n/config";

export const statuses = ["available", "in-progress", "planned", "someday"] as const;
export type Status = (typeof statuses)[number];

export const categories = ["docs-design", "feedback-support", "operations", "experiments"] as const;
export type Category = (typeof categories)[number];

/** Which mock UI the project's cover renders (see components/projects/project-cover.tsx). */
export type CoverKind = "docs" | "components" | "tokens" | "brand" | "upvotes" | "tickets" | "uptime" | "network";

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
      en: "Hear what users need and answer them where they already are.",
      fr: "Entendre ce dont les utilisateurs ont besoin et leur répondre là où ils sont.",
    },
  },
  operations: {
    title: { en: "Operations", fr: "Opérations" },
    description: {
      en: "Keep people informed about the services you run.",
      fr: "Tenir les gens informés de l'état des services que vous opérez.",
    },
  },
  experiments: {
    title: { en: "Experiments", fr: "Expériences" },
    description: {
      en: "Side projects for later. Not the mission, but on the list.",
      fr: "Des projets pour plus tard. Pas la mission, mais sur la liste.",
    },
  },
};

export const projects: Project[] = [
  {
    slug: "docs-shell",
    name: "docs-shell",
    kind: { en: "Documentation engine", fr: "Moteur de documentation" },
    pitch: {
      en: "Turn a folder of MDX into a versioned, searchable docs site.",
      fr: "Transformez un dossier MDX en site de documentation versionné et consultable.",
    },
    description: {
      en: "docs-shell builds a static documentation site from your MDX files, with versioned docs, English and French out of the box, full-text search and a theme panel. Its registry preset, registry-shell, adds what a shadcn-style component registry needs: live previews, install commands, and props, accessibility and test tabs.",
      fr: "docs-shell génère un site de documentation statique à partir de vos fichiers MDX : documentation versionnée, anglais et français inclus, recherche plein texte et panneau de thème. Son préréglage registry-shell ajoute ce qu'il faut à un registre de composants de style shadcn : aperçus en direct, commandes d'installation et onglets props, accessibilité et tests.",
    },
    status: "available",
    category: "docs-design",
    tags: { en: ["Docs", "MDX", "Registry", "Next.js"], fr: ["Docs", "MDX", "Registre", "Next.js"] },
    license: "MIT",
    github: "https://github.com/scintillar-com/registry-shell",
    links: { live: "https://ui.sntlr.app", npm: "https://www.npmjs.com/package/@sntlr/registry-shell" },
    features: {
      en: [
        "Static export: host it anywhere",
        "Versioned docs with a version switcher",
        "English and French built in",
        "Full-text search",
        "Component registry module with live previews",
      ],
      fr: [
        "Export statique : hébergez-le n'importe où",
        "Documentation versionnée avec sélecteur de version",
        "Anglais et français inclus",
        "Recherche plein texte",
        "Module de registre de composants avec aperçus en direct",
      ],
    },
    install: ["npm install -D @sntlr/registry-shell", "npx registry-shell init"],
    cover: "docs",
    featured: true,
  },
  {
    slug: "scintillar-ui",
    name: "Scintillar UI",
    kind: { en: "Component registry", fr: "Registre de composants" },
    pitch: {
      en: "43 components and 19 blocks you install with the shadcn CLI.",
      fr: "43 composants et 19 blocs à installer avec la CLI shadcn.",
    },
    description: {
      en: "Scintillar UI is a shadcn-compatible registry of React components and blocks built for live collaboration. Every item installs into any Next.js, Vite or TanStack Start project with the shadcn CLI. The source is copied into your project, so nothing Scintillar-specific ships at runtime.",
      fr: "Scintillar UI est un registre compatible shadcn de composants et de blocs React pensés pour la collaboration en direct. Chaque élément s'installe dans un projet Next.js, Vite ou TanStack Start avec la CLI shadcn. Le code source est copié dans votre projet : rien de propre à Scintillar n'est livré à l'exécution.",
    },
    status: "available",
    category: "docs-design",
    tags: { en: ["Components", "shadcn", "React"], fr: ["Composants", "shadcn", "React"] },
    license: "MIT",
    github: "https://github.com/scintillar-com/registry",
    links: { live: "https://ui.sntlr.app" },
    features: {
      en: [
        "43 components and 19 composed blocks",
        "Installs with the standard shadcn CLI",
        "Docs in English and French",
        "Props, accessibility and test notes for every component",
      ],
      fr: [
        "43 composants et 19 blocs composés",
        "S'installe avec la CLI shadcn standard",
        "Documentation en anglais et en français",
        "Notes de props, d'accessibilité et de tests pour chaque composant",
      ],
    },
    install: ["npx shadcn@latest add https://ui.sntlr.app/r/button.json"],
    cover: "components",
  },
  {
    slug: "jev-design-system",
    name: "jev-design-system",
    kind: { en: "Design-token reasoning", fr: "Raisonnement sur les jetons de design" },
    pitch: {
      en: "Catch design-token conflicts before they reach the product.",
      fr: "Détecter les conflits de jetons de design avant qu'ils atteignent le produit.",
    },
    description: {
      en: "A JSON definition of what design tokens can and can't represent, checked by a JEV-based decision engine. When the engine detects a conflict with high confidence, it escalates the case to a stronger reasoning model to improve design cohesion and widen the design space.",
      fr: "Une définition JSON de ce que les jetons de design peuvent représenter ou non, vérifiée par un moteur de décision basé sur JEV. Quand le moteur détecte un conflit avec une confiance élevée, il transmet le cas à un modèle de raisonnement plus puissant pour améliorer la cohésion du design et élargir l'espace de design.",
    },
    status: "planned",
    category: "docs-design",
    tags: { en: ["Design tokens", "AI", "Design systems"], fr: ["Jetons de design", "IA", "Design systems"] },
    license: null,
    features: {
      en: [
        "JSON schema for what each token may represent",
        "JEV-based conflict detection",
        "Escalation to a reasoning model for high-confidence conflicts",
      ],
      fr: [
        "Schéma JSON de ce que chaque jeton peut représenter",
        "Détection de conflits basée sur JEV",
        "Transmission à un modèle de raisonnement pour les conflits à haute confiance",
      ],
    },
    roadmap: {
      en: "Design phase. The token definition format comes first, then the decision engine.",
      fr: "Phase de conception. Le format de définition des jetons d'abord, puis le moteur de décision.",
    },
    cover: "tokens",
  },
  {
    slug: "branding-guide-automation",
    name: "Branding guide automation",
    kind: { en: "Brand packaging", fr: "Livraison de marque" },
    pitch: {
      en: "Generate a complete branding kit from one config file.",
      fr: "Générez une trousse de marque complète à partir d'un seul fichier de configuration.",
    },
    description: {
      en: "Describe a brand once and get the whole delivery: folder structure for assets, fonts, logos, prints and templates, the brand guide itself, and an itemized estimate. A first prototype exists; the next version is being planned.",
      fr: "Décrivez une marque une seule fois et obtenez toute la livraison : arborescence pour les éléments, polices, logos, imprimés et gabarits, le guide de marque lui-même et une estimation détaillée. Un premier prototype existe; la prochaine version est en préparation.",
    },
    status: "planned",
    category: "docs-design",
    tags: { en: ["Branding", "Automation", "CLI"], fr: ["Image de marque", "Automatisation", "CLI"] },
    license: null,
    repoPrivate: true,
    features: {
      en: ["Branding-kit folder structure from a config", "Brand guide generation", "Itemized estimates", "English and French"],
      fr: ["Arborescence de trousse de marque à partir d'une configuration", "Génération du guide de marque", "Estimations détaillées", "Anglais et français"],
    },
    roadmap: {
      en: "A prototype exists. The rewrite will become an open-source CLI.",
      fr: "Un prototype existe. La réécriture deviendra une CLI libre.",
    },
    cover: "brand",
  },
  {
    slug: "feature-requests",
    name: "Feature requests",
    kind: { en: "Public feedback forum", fr: "Forum de suggestions public" },
    pitch: {
      en: "Let users suggest features and upvote what matters to them.",
      fr: "Laissez vos utilisateurs suggérer des fonctionnalités et voter pour ce qui compte.",
    },
    description: {
      en: "A public forum where users suggest features for specific products and upvote the ideas they care about, so you can see what people actually want before deciding what to build.",
      fr: "Un forum public où les utilisateurs proposent des fonctionnalités pour des produits précis et votent pour les idées qui leur tiennent à cœur, pour savoir ce que les gens veulent vraiment avant de décider quoi construire.",
    },
    status: "planned",
    category: "feedback-support",
    tags: { en: ["Feedback", "Roadmap", "Community"], fr: ["Rétroaction", "Feuille de route", "Communauté"] },
    license: null,
    repoPrivate: true,
    features: {
      en: ["One board per product", "Upvotes and comments", "Status updates as ideas ship"],
      fr: ["Un tableau par produit", "Votes et commentaires", "Suivi du statut jusqu'à la livraison"],
    },
    roadmap: {
      en: "Planned. The repository is reserved and work starts after the docs tooling stabilizes.",
      fr: "Prévu. Le dépôt est réservé et le travail commencera une fois les outils de documentation stabilisés.",
    },
    cover: "upvotes",
  },
  {
    slug: "support",
    name: "Support desk",
    kind: { en: "Ticketing platform", fr: "Plateforme de billets" },
    pitch: {
      en: "One support inbox that sends tickets where your team works.",
      fr: "Une seule boîte de support qui envoie les billets là où votre équipe travaille.",
    },
    description: {
      en: "A support ticketing platform with several destinations. Keep tickets in-house, or send them to GitHub issues, Notion or other tools your team already uses.",
      fr: "Une plateforme de billets de support avec plusieurs destinations. Gardez les billets à l'interne ou envoyez-les vers les issues GitHub, Notion ou d'autres outils que votre équipe utilise déjà.",
    },
    status: "planned",
    category: "feedback-support",
    tags: { en: ["Support", "Tickets", "Integrations"], fr: ["Support", "Billets", "Intégrations"] },
    license: null,
    repoPrivate: true,
    features: {
      en: ["Built-in ticket inbox", "Outputs to GitHub, Notion and more", "One form for every product"],
      fr: ["Boîte de billets intégrée", "Envoi vers GitHub, Notion et plus", "Un seul formulaire pour tous les produits"],
    },
    roadmap: {
      en: "Planned. The repository is reserved.",
      fr: "Prévu. Le dépôt est réservé.",
    },
    cover: "tickets",
  },
  {
    slug: "status",
    name: "Status pages",
    kind: { en: "Status page service", fr: "Service de pages de statut" },
    pitch: {
      en: "Connect your hosted services and get one clear status page.",
      fr: "Branchez vos services hébergés et obtenez une seule page de statut claire.",
    },
    description: {
      en: "A status page service for system administrators. Connect the services you host and get a single page that shows whether everything is up, with incident history.",
      fr: "Un service de pages de statut pour les administrateurs système. Branchez les services que vous hébergez et obtenez une seule page qui montre si tout fonctionne, avec l'historique des incidents.",
    },
    status: "planned",
    category: "operations",
    tags: { en: ["Uptime", "Incidents", "Monitoring"], fr: ["Disponibilité", "Incidents", "Surveillance"] },
    license: null,
    repoPrivate: true,
    features: {
      en: ["Integrations for hosted services", "Single public status page", "Incident history"],
      fr: ["Intégrations pour services hébergés", "Une seule page de statut publique", "Historique des incidents"],
    },
    roadmap: {
      en: "Planned. The repository is reserved.",
      fr: "Prévu. Le dépôt est réservé.",
    },
    cover: "uptime",
    featured: true,
  },
  {
    slug: "hacking-framework",
    name: "Hacking framework",
    kind: { en: "Interactive hacking games", fr: "Jeux de piratage interactifs" },
    pitch: {
      en: "Procedural cities, networks and systems to hack, for games.",
      fr: "Villes, réseaux et systèmes procéduraux à pirater, pour les jeux.",
    },
    description: {
      en: "A framework for interactive hacking games: procedurally generated cities, internet and power networks, vulnerable systems and the companies behind them. It's a side project for later, not part of the core mission.",
      fr: "Un cadriciel pour jeux de piratage interactifs : villes générées procéduralement, réseaux internet et électriques, systèmes vulnérables et les entreprises derrière eux. C'est un projet pour plus tard, en dehors de la mission principale.",
    },
    status: "someday",
    category: "experiments",
    tags: { en: ["Games", "Procedural", "Simulation"], fr: ["Jeux", "Procédural", "Simulation"] },
    license: null,
    features: {
      en: ["Procedural cities and maps", "Network and vulnerability simulation", "Engine SDKs"],
      fr: ["Villes et cartes procédurales", "Simulation de réseaux et de vulnérabilités", "SDK pour moteurs de jeu"],
    },
    roadmap: {
      en: "Someday. Early map-generation experiments exist, but the tools above come first.",
      fr: "Un jour. Des essais de génération de cartes existent, mais les outils ci-dessus passent d'abord.",
    },
    cover: "network",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Search text for a project in one locale: name, kind, pitch and tags. */
export function searchText(p: Project, locale: Locale) {
  return [p.name, p.kind[locale], p.pitch[locale], ...p.tags[locale]].join(" ").toLowerCase();
}
