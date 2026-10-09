import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Download, FileCode, Palette, X } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/site/github-icon";
import { AssetDownload, type AssetFormat } from "@/components/brand/asset-download";
import { CopyValue } from "@/components/brand/copy-value";
import { GITHUB_ORG } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

const KIT = "/brand/kit";
const KIT_ZIP = "/brand/scintillar-brand-kit.zip";
const TOKENS = { css: "/brand/tokens/scintillar.tokens.css", json: "/brand/tokens/scintillar.tokens.json" };

// Fixed preview backgrounds, so each file is shown on the background it was made for, whatever the site theme.
const LIGHT_BG = "#F0F4F3";
const DARK_BG = "#020E0A";

type Kind = "horizontal" | "vertical" | "mark" | "icon";
type Ink = "brand" | "mono";
type Ground = "on-light" | "on-dark";

const PNG_WIDTHS: Record<Kind, [number, number][]> = {
  horizontal: [[600, 196], [1200, 392], [2400, 784]],
  vertical: [[196, 196], [392, 392], [784, 784]],
  mark: [[196, 196], [392, 392], [784, 784]],
  icon: [[129, 129], [257, 257], [513, 513]],
};

function formats(file: string, kind: Kind, vector: string): AssetFormat[] {
  const [x1, x2, x4] = PNG_WIDTHS[kind];
  return [
    { label: "SVG", detail: vector, href: `${KIT}/${file}.svg` },
    { label: "PNG", detail: `${x1[0]} × ${x1[1]}`, href: `${KIT}/${file}.png` },
    { label: "PNG @2x", detail: `${x2[0]} × ${x2[1]}`, href: `${KIT}/${file}@2x.png` },
    { label: "PNG @4x", detail: `${x4[0]} × ${x4[1]}`, href: `${KIT}/${file}@4x.png` },
  ];
}

interface Swatch {
  token: string;
  hex: string;
}

const LIGHT: Swatch[] = [
  { token: "background", hex: "#F0F4F3" },
  { token: "foreground", hex: "#0D0D0D" },
  { token: "card", hex: "#FFFFFF" },
  { token: "primary", hex: "#005C3D" },
  { token: "primary-foreground", hex: "#E7F3EF" },
  { token: "muted", hex: "#E2E9E7" },
  { token: "muted-foreground", hex: "#3D524B" },
  { token: "border", hex: "#D2DAD8" },
];

const DARK: Swatch[] = [
  { token: "background", hex: "#020E0A" },
  { token: "foreground", hex: "#FAFAFA" },
  { token: "card", hex: "#010906" },
  { token: "primary", hex: "#40BF95" },
  { token: "primary-foreground", hex: "#0D0D0D" },
  { token: "muted", hex: "#12211C" },
  { token: "muted-foreground", hex: "#C2E0D6" },
  { token: "border", hex: "#293D36" },
];

/** Contrast ratios (WCAG 2) of the pairs the site uses most, measured on the hex values above. */
const CONTRAST = {
  light: [
    { fg: "#0D0D0D", bg: "#F0F4F3", ratio: 17.5 },
    { fg: "#005C3D", bg: "#F0F4F3", ratio: 7.3 },
    { fg: "#E7F3EF", bg: "#005C3D", ratio: 7.1 },
    { fg: "#3D524B", bg: "#F0F4F3", ratio: 7.6 },
  ],
  dark: [
    { fg: "#FAFAFA", bg: "#020E0A", ratio: 18.8 },
    { fg: "#40BF95", bg: "#020E0A", ratio: 8.5 },
    { fg: "#0D0D0D", bg: "#40BF95", ratio: 8.4 },
    { fg: "#C2E0D6", bg: "#020E0A", ratio: 14.0 },
  ],
};

interface Example {
  good: string;
  bad: string;
}

interface BrandContent {
  title: string;
  eyebrow: string;
  heading: string;
  lead: string;
  kit: { download: string; detail: string; tokens: string };
  sections: Record<"logos" | "icons" | "rules" | "color" | "type" | "naming" | "tools" | "voice", string>;
  download: string;
  copy: { copy: string; copied: string };
  inks: Record<`${Ink}-${Ground}`, string>;
  logos: {
    heading: string;
    body: string;
    variants: Record<"horizontal" | "vertical" | "mark", { name: string; use: string }>;
    which: { title: string; items: string[] };
  };
  icons: {
    heading: string;
    body: string;
    grounds: Record<Ground, string>;
    styles: Record<"solid" | "outline", string>;
    shapes: Record<"round" | "square", string>;
    inks: Record<Ink, string>;
  };
  rules: {
    heading: string;
    body: string;
    clearTitle: string;
    clearBody: string;
    clearLabel: string;
    minTitle: string;
    minBody: string;
    min: { label: string; value: string }[];
    dontTitle: string;
    donts: Record<"stretch" | "rotate" | "recolor" | "effects" | "contrast" | "retype", string>;
    doTitle: string;
    dos: string[];
  };
  color: {
    heading: string;
    body: string;
    light: string;
    dark: string;
    roles: Record<string, string>;
    logoTitle: string;
    logoBody: string;
    contrastTitle: string;
    contrastBody: string;
    contrastPairs: string[];
    tokensTitle: string;
    tokensBody: string;
    tokensCss: string;
    tokensJson: string;
  };
  type: {
    heading: string;
    body: string;
    license: string;
    get: string;
    scale: { name: string; spec: string; sample: string; className: string }[];
    rulesTitle: string;
    rules: string[];
  };
  naming: {
    heading: string;
    body: string;
    rows: Example[];
    domainsTitle: string;
    domains: string[];
  };
  tools: {
    heading: string;
    body: string;
    points: { title: string; body: string }[];
    creditTitle: string;
    creditBody: string;
    creditText: string;
    creditPreview: string;
  };
  voice: {
    heading: string;
    body: string;
    goodLabel: string;
    badLabel: string;
    principles: { title: string; body: string; example: Example }[];
  };
  contact: { title: string; body: string; cta: string };
}

const content: Record<Locale, BrandContent> = {
  en: {
    title: "Brand",
    eyebrow: "Brand",
    heading: "Logos, colors and type, ready to use",
    lead: "Everything you need to write about Scintillar, link to it or credit it in something you've built: the logo files, our colors and type, and a short guide to using them well. Take what you need.",
    kit: { download: "Download the brand kit", detail: "SVG and PNG logos, icons and color tokens (ZIP)", tokens: "Color tokens" },
    sections: { logos: "Logos", icons: "Icons", rules: "Usage", color: "Color", type: "Type", naming: "Naming", tools: "Tools and your brand", voice: "Voice" },
    download: "Download",
    copy: { copy: "Copy", copied: "Copied" },
    inks: {
      "brand-on-light": "Green, for light backgrounds",
      "brand-on-dark": "Green, for dark backgrounds",
      "mono-on-light": "Mono, for light backgrounds",
      "mono-on-dark": "Mono, for dark backgrounds",
    },
    logos: {
      heading: "The logo in every shape",
      body: "Three layouts, each in green and mono, for light and dark backgrounds. Every file comes as SVG and as PNG at three sizes.",
      variants: {
        horizontal: { name: "Horizontal", use: "The default. Headers, footers, documents and slides." },
        vertical: { name: "Vertical", use: "Centered layouts: title slides, posters, empty states." },
        mark: { name: "Mark", use: "Small spaces: avatars, social profiles, loading states." },
      },
      which: {
        title: "Which version?",
        items: [
          "Use the green logo on plain light or dark backgrounds. That's most of the time.",
          "Use mono on photos, on colored backgrounds, or when printing in one color.",
          "Pick the file made for your background: \"for light backgrounds\" has dark ink, \"for dark backgrounds\" has light ink.",
        ],
      },
    },
    icons: {
      heading: "App icons and favicons",
      body: "The mark on a tile, for browser tabs, app icons and anywhere a square or round shape is expected. Solid tiles stand out; outline tiles sit quietly in a list.",
      grounds: { "on-light": "For light interfaces", "on-dark": "For dark interfaces" },
      styles: { solid: "Solid", outline: "Outline" },
      shapes: { round: "round", square: "square" },
      inks: { brand: "green", mono: "mono" },
    },
    rules: {
      heading: "Give it room, keep it whole",
      body: "Use the files as they are. Never redraw, retype, recolor, stretch, rotate or animate the logo.",
      clearTitle: "Clear space",
      clearBody: "Keep space at least as wide as one of the mark's side rings empty on every side. Measure from the drawing, not from the edge of the file.",
      clearLabel: "Clear space: one ring on every side",
      minTitle: "Minimum size",
      minBody: "Below these sizes the rings close up. Use the icon instead.",
      min: [
        { label: "Horizontal", value: "120 px wide" },
        { label: "Vertical", value: "80 px wide" },
        { label: "Mark", value: "24 px tall" },
        { label: "Icon", value: "16 px (favicon)" },
      ],
      dontTitle: "Please don't",
      donts: {
        stretch: "Stretch or squash it",
        rotate: "Rotate or tilt it",
        recolor: "Change its colors",
        effects: "Add shadows, glows or effects",
        contrast: "Use it without enough contrast",
        retype: "Retype the name in another font",
      },
      doTitle: "Do",
      dos: [
        "Use the downloaded files without changes.",
        "Pick the version made for your background.",
        "Link the logo to scintillar.com when it stands for Scintillar.",
      ],
    },
    color: {
      heading: "Jade green on calm neutrals",
      body: "Green marks what matters: actions, links, focus and the logo. Neutrals with a hint of green carry everything else. Each theme has its own green, tuned for contrast.",
      light: "Light theme",
      dark: "Dark theme",
      roles: {
        background: "Page background",
        foreground: "Headings and body text",
        card: "Cards and panels",
        primary: "Buttons, links, focus rings",
        "primary-foreground": "Text on green",
        muted: "Quiet areas and chips",
        "muted-foreground": "Secondary text",
        border: "Dividers and outlines",
      },
      logoTitle: "Logo green",
      logoBody: "The logo files use their own greens: #005E3E on light backgrounds and #5CD6AD on dark ones. Use the files rather than matching these by hand.",
      contrastTitle: "Contrast",
      contrastBody: "Every pairing below meets WCAG AAA for body text (7:1 or more).",
      contrastPairs: ["Text on background", "Green on background", "Text on green", "Secondary text on background"],
      tokensTitle: "Tokens for code and design tools",
      tokensBody: "The same colors and type as CSS variables and in the W3C design tokens format, which most design tools can import.",
      tokensCss: "CSS variables",
      tokensJson: "Design tokens (JSON)",
    },
    type: {
      heading: "JetBrains Mono, for everything",
      body: "One family for headings, body text and code. Bold for headings, thin for body copy.",
      license: "Free and open source (SIL Open Font License).",
      get: "Get JetBrains Mono on Google Fonts",
      scale: [
        { name: "Heading 1", spec: "Bold 700 · 48 px", sample: "Self-serve tools", className: "text-4xl font-bold sm:text-5xl" },
        { name: "Heading 2", spec: "Bold 700 · 36 px", sample: "Host it yourself", className: "text-3xl font-bold sm:text-4xl" },
        { name: "Heading 3", spec: "Bold 700 · 18 px", sample: "One small tool at a time", className: "text-lg font-bold" },
        { name: "Body", spec: "Light 300 · 16 px", sample: "Every tool takes your logo, colors and domain.", className: "text-base font-light" },
        { name: "Eyebrow", spec: "Bold 700 · 12 px · uppercase", sample: "What is Scintillar?", className: "text-xs font-bold uppercase tracking-widest text-primary" },
      ],
      rulesTitle: "Setting text",
      rules: [
        "Headings in sentence case. Tool names keep their capitals.",
        "Keep body lines under about 70 characters.",
        "Don't use other fonts next to it, even for code.",
      ],
    },
    naming: {
      heading: "Saying the name",
      body: "Scintillar is one word with a capital S. The tools have their own names, written as names.",
      rows: [
        { good: "Scintillar", bad: "SCINTILLAR, scintillar, Scintilar" },
        { good: "Docs Shell, Scintillar UI, Status Pages", bad: "docs-shell, the scintillar ui, status page tool" },
        { good: "Scintillar's tools", bad: "Scintillar's projects, Scintillar platform" },
        { good: "@sntlr/docs-shell (in code and install commands)", bad: "Sntlr, SNTLR (in prose)" },
      ],
      domainsTitle: "Our two domains",
      domains: [
        "scintillar.com is our home: this site, the tool catalog and how to reach us.",
        "sntlr.app is where things run: each tool's docs and our own instance, at <tool>.sntlr.app.",
      ],
    },
    tools: {
      heading: "Your brand comes first",
      body: "Every Scintillar tool is white-label: it takes your logo, colors and domain and runs under your brand. Our logo stays out of the way.",
      points: [
        { title: "No Scintillar logo required", body: "A tool you host shows your brand, not ours. You never have to display our logo or name." },
        { title: "Don't use ours as yours", body: "Don't use the Scintillar logo as your instance's logo, or suggest that Scintillar runs or endorses your site." },
        { title: "Our own instances", body: "Our instances on sntlr.app use the Scintillar brand, with the tool name next to the mark." },
      ],
      creditTitle: "Want to give credit?",
      creditBody: "It's optional and always welcome. One small line in the footer or docs is enough.",
      creditText: '<a href="https://scintillar.com">Built with Scintillar</a>',
      creditPreview: "Built with Scintillar",
    },
    voice: {
      heading: "Clear words, plain promises",
      body: "We write like a friendly maintainer: helpful, direct and honest about what a tool is and isn't.",
      goodLabel: "Say",
      badLabel: "Not",
      principles: [
        {
          title: "Lead with what you get",
          body: "Describe what the tool does for people, not what it's built with.",
          example: { good: "Put your docs online with versions, search and two languages.", bad: "A Next.js MDX documentation framework." },
        },
        {
          title: "Honest about scope",
          body: "Our tools are provided as is, for hobbyists and small projects. Don't promise support, uptime or a roadmap.",
          example: { good: "Free to use, provided as is. Help is best-effort on GitHub.", bad: "Enterprise-grade platform with dedicated support." },
        },
        {
          title: "Tools at the center",
          body: "Talk about the tools. Mention the community behind them lightly.",
          example: { good: "Status Pages gives your services one public status page.", bad: "Our amazing team is revolutionizing status pages!" },
        },
      ],
    },
    contact: {
      title: "Something not covered here?",
      body: "Ask on GitHub and we'll answer when we can.",
      cta: "Scintillar on GitHub",
    },
  },
  fr: {
    title: "Marque",
    eyebrow: "Marque",
    heading: "Logos, couleurs et typographie, prêts à l'emploi",
    lead: "Tout ce qu'il faut pour parler de Scintillar, y faire un lien ou le créditer dans ce que vous avez bâti : les fichiers du logo, nos couleurs et notre typographie, et un court guide pour bien les utiliser. Prenez ce dont vous avez besoin.",
    kit: { download: "Télécharger la trousse de marque", detail: "Logos SVG et PNG, icônes et jetons de couleur (ZIP)", tokens: "Jetons de couleur" },
    sections: { logos: "Logos", icons: "Icônes", rules: "Utilisation", color: "Couleur", type: "Typographie", naming: "Nom", tools: "Les outils et votre marque", voice: "Ton" },
    download: "Télécharger",
    copy: { copy: "Copier", copied: "Copié" },
    inks: {
      "brand-on-light": "Vert, pour fonds clairs",
      "brand-on-dark": "Vert, pour fonds foncés",
      "mono-on-light": "Mono, pour fonds clairs",
      "mono-on-dark": "Mono, pour fonds foncés",
    },
    logos: {
      heading: "Le logo sous toutes ses formes",
      body: "Trois dispositions, chacune en vert et en mono, pour fonds clairs et foncés. Chaque fichier est offert en SVG et en PNG à trois tailles.",
      variants: {
        horizontal: { name: "Horizontal", use: "Par défaut. En-têtes, pieds de page, documents et présentations." },
        vertical: { name: "Vertical", use: "Mises en page centrées : diapositives titres, affiches, états vides." },
        mark: { name: "Symbole", use: "Petits espaces : avatars, profils sociaux, états de chargement." },
      },
      which: {
        title: "Quelle version?",
        items: [
          "Utilisez le logo vert sur des fonds clairs ou foncés unis. C'est le cas la plupart du temps.",
          "Utilisez le mono sur des photos, des fonds colorés, ou pour une impression à une couleur.",
          "Choisissez le fichier fait pour votre fond : « pour fonds clairs » a une encre foncée, « pour fonds foncés » une encre claire.",
        ],
      },
    },
    icons: {
      heading: "Icônes d'application et favicons",
      body: "Le symbole sur une tuile, pour les onglets du navigateur, les icônes d'application et partout où l'on attend une forme carrée ou ronde. Les tuiles pleines ressortent; les tuiles en contour restent discrètes dans une liste.",
      grounds: { "on-light": "Pour interfaces claires", "on-dark": "Pour interfaces foncées" },
      styles: { solid: "Pleine", outline: "Contour" },
      shapes: { round: "ronde", square: "carrée" },
      inks: { brand: "verte", mono: "mono" },
    },
    rules: {
      heading: "Donnez-lui de l'espace, gardez-le intact",
      body: "Utilisez les fichiers tels quels. Ne redessinez pas, ne retapez pas, ne recolorez pas, n'étirez pas, ne faites pas pivoter et n'animez pas le logo.",
      clearTitle: "Zone de protection",
      clearBody: "Gardez libre, de chaque côté, un espace au moins aussi large qu'un des anneaux latéraux du symbole. Mesurez à partir du dessin, pas du bord du fichier.",
      clearLabel: "Zone de protection : un anneau de chaque côté",
      minTitle: "Taille minimale",
      minBody: "Sous ces tailles, les anneaux se referment. Utilisez plutôt l'icône.",
      min: [
        { label: "Horizontal", value: "120 px de large" },
        { label: "Vertical", value: "80 px de large" },
        { label: "Symbole", value: "24 px de haut" },
        { label: "Icône", value: "16 px (favicon)" },
      ],
      dontTitle: "À éviter",
      donts: {
        stretch: "L'étirer ou l'écraser",
        rotate: "Le faire pivoter ou l'incliner",
        recolor: "Changer ses couleurs",
        effects: "Ajouter des ombres, lueurs ou effets",
        contrast: "L'utiliser sans assez de contraste",
        retype: "Retaper le nom dans une autre police",
      },
      doTitle: "À faire",
      dos: [
        "Utiliser les fichiers téléchargés sans les modifier.",
        "Choisir la version faite pour votre fond.",
        "Lier le logo à scintillar.com quand il représente Scintillar.",
      ],
    },
    color: {
      heading: "Du vert jade sur des neutres calmes",
      body: "Le vert signale ce qui compte : actions, liens, focus et logo. Des neutres teintés de vert portent tout le reste. Chaque thème a son propre vert, ajusté pour le contraste.",
      light: "Thème clair",
      dark: "Thème foncé",
      roles: {
        background: "Fond de page",
        foreground: "Titres et texte courant",
        card: "Cartes et panneaux",
        primary: "Boutons, liens, anneaux de focus",
        "primary-foreground": "Texte sur vert",
        muted: "Zones discrètes et pastilles",
        "muted-foreground": "Texte secondaire",
        border: "Séparateurs et contours",
      },
      logoTitle: "Vert du logo",
      logoBody: "Les fichiers du logo utilisent leurs propres verts : #005E3E sur fond clair et #5CD6AD sur fond foncé. Utilisez les fichiers plutôt que de reproduire ces couleurs à la main.",
      contrastTitle: "Contraste",
      contrastBody: "Chaque paire ci-dessous respecte le niveau WCAG AAA pour le texte courant (7:1 ou plus).",
      contrastPairs: ["Texte sur fond", "Vert sur fond", "Texte sur vert", "Texte secondaire sur fond"],
      tokensTitle: "Jetons pour le code et les outils de design",
      tokensBody: "Les mêmes couleurs et la même typographie en variables CSS et au format de jetons de design du W3C, que la plupart des outils de design peuvent importer.",
      tokensCss: "Variables CSS",
      tokensJson: "Jetons de design (JSON)",
    },
    type: {
      heading: "JetBrains Mono, pour tout",
      body: "Une seule famille pour les titres, le texte courant et le code. Gras pour les titres, fin pour le texte.",
      license: "Libre et gratuite (SIL Open Font License).",
      get: "Obtenir JetBrains Mono sur Google Fonts",
      scale: [
        { name: "Titre 1", spec: "Gras 700 · 48 px", sample: "Des outils en libre-service", className: "text-4xl font-bold sm:text-5xl" },
        { name: "Titre 2", spec: "Gras 700 · 36 px", sample: "Hébergez-le vous-même", className: "text-3xl font-bold sm:text-4xl" },
        { name: "Titre 3", spec: "Gras 700 · 18 px", sample: "Un petit outil à la fois", className: "text-lg font-bold" },
        { name: "Texte", spec: "Fin 300 · 16 px", sample: "Chaque outil prend votre logo, vos couleurs et votre domaine.", className: "text-base font-light" },
        { name: "Surtitre", spec: "Gras 700 · 12 px · majuscules", sample: "Qu'est-ce que Scintillar?", className: "text-xs font-bold uppercase tracking-widest text-primary" },
      ],
      rulesTitle: "Composer le texte",
      rules: [
        "Titres avec une majuscule initiale seulement. Les noms d'outils gardent leurs majuscules.",
        "Gardez les lignes de texte sous environ 70 caractères.",
        "N'utilisez pas d'autres polices à côté, même pour le code.",
      ],
    },
    naming: {
      heading: "Écrire le nom",
      body: "Scintillar s'écrit en un mot, avec un S majuscule. Les outils ont leurs propres noms, écrits comme des noms.",
      rows: [
        { good: "Scintillar", bad: "SCINTILLAR, scintillar, Scintilar" },
        { good: "Docs Shell, Scintillar UI, Status Pages", bad: "docs-shell, le scintillar ui, outil de page de statut" },
        { good: "les outils de Scintillar", bad: "les projets de Scintillar, la plateforme Scintillar" },
        { good: "@sntlr/docs-shell (dans le code et les commandes)", bad: "Sntlr, SNTLR (dans le texte)" },
      ],
      domainsTitle: "Nos deux domaines",
      domains: [
        "scintillar.com est notre maison : ce site, le catalogue d'outils et comment nous joindre.",
        "sntlr.app est là où les choses tournent : la documentation de chaque outil et notre propre instance, à <outil>.sntlr.app.",
      ],
    },
    tools: {
      heading: "Votre marque d'abord",
      body: "Chaque outil Scintillar est en marque blanche : il prend votre logo, vos couleurs et votre domaine, et fonctionne sous votre marque. Notre logo reste en retrait.",
      points: [
        { title: "Aucun logo Scintillar requis", body: "Un outil que vous hébergez affiche votre marque, pas la nôtre. Vous n'avez jamais à afficher notre logo ou notre nom." },
        { title: "N'utilisez pas le nôtre comme le vôtre", body: "N'utilisez pas le logo Scintillar comme logo de votre instance, et ne laissez pas entendre que Scintillar exploite ou approuve votre site." },
        { title: "Nos propres instances", body: "Nos instances sur sntlr.app portent la marque Scintillar, avec le nom de l'outil à côté du symbole." },
      ],
      creditTitle: "Envie de nous créditer?",
      creditBody: "C'est facultatif et toujours apprécié. Une petite ligne dans le pied de page ou la documentation suffit.",
      creditText: '<a href="https://scintillar.com">Conçu avec Scintillar</a>',
      creditPreview: "Conçu avec Scintillar",
    },
    voice: {
      heading: "Des mots clairs, des promesses simples",
      body: "Nous écrivons comme un mainteneur sympathique : utile, direct et honnête sur ce qu'un outil est et n'est pas.",
      goodLabel: "Dire",
      badLabel: "Pas",
      principles: [
        {
          title: "Commencer par ce qu'on obtient",
          body: "Décrivez ce que l'outil fait pour les gens, pas avec quoi il est bâti.",
          example: { good: "Mettez votre documentation en ligne, avec versions, recherche et deux langues.", bad: "Un framework de documentation MDX pour Next.js." },
        },
        {
          title: "Honnête sur la portée",
          body: "Nos outils sont fournis tels quels, pour les passionnés et les petits projets. Ne promettez ni support, ni disponibilité, ni feuille de route.",
          example: { good: "Gratuit, fourni tel quel. L'aide se fait au mieux, sur GitHub.", bad: "Plateforme de niveau entreprise avec support dédié." },
        },
        {
          title: "Les outils au centre",
          body: "Parlez des outils. Mentionnez la communauté derrière eux avec légèreté.",
          example: { good: "Status Pages réunit l'état de vos services sur une seule page publique.", bad: "Notre équipe incroyable révolutionne les pages de statut!" },
        },
      ],
    },
    contact: {
      title: "Une question qui n'est pas couverte ici?",
      body: "Posez-la sur GitHub et nous répondrons dès que possible.",
      cta: "Scintillar sur GitHub",
    },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: content[locale].title, description: content[locale].lead, alternates: { canonical: `/${locale}/brand` } };
}

const SECTION_IDS = ["logos", "icons", "rules", "color", "type", "naming", "tools", "voice"] as const;

export default async function BrandPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = content[locale];

  return (
    <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 sm:pt-20">
      <header>
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl">{c.heading}</h1>
        <p className="mt-6 max-w-3xl text-lg font-light leading-relaxed">{c.lead}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <a href={KIT_ZIP} download>
              <Download className="size-4" />
              {c.kit.download}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#color">
              <Palette className="size-4" />
              {c.kit.tokens}
            </a>
          </Button>
        </div>
        <p className="mt-3 text-xs font-light text-muted-foreground">{c.kit.detail}</p>
        <nav aria-label={c.title} className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-block rounded-full border px-3 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
                >
                  {c.sections[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Logos */}
      <Section id="logos" eyebrow={c.sections.logos} title={c.logos.heading} body={c.logos.body}>
        <div className="space-y-10">
          {(["horizontal", "vertical", "mark"] as const).map((kind) => (
            <div key={kind}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg">{c.logos.variants[kind].name}</h3>
                <p className="text-sm font-light text-muted-foreground">{c.logos.variants[kind].use}</p>
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {(["brand-on-light", "brand-on-dark", "mono-on-light", "mono-on-dark"] as const).map((combo) => {
                  const file = `scintillar-${kind}-${combo}`;
                  const name = `${c.logos.variants[kind].name} · ${c.inks[combo]}`;
                  return (
                    <li key={combo} className="overflow-hidden rounded-xl border bg-card">
                      <Preview ground={combo.endsWith("on-dark") ? "on-dark" : "on-light"} className="h-32 sm:h-36">
                        <Image
                          src={`${KIT}/${file}.svg`}
                          alt={`Scintillar, ${name}`}
                          width={kind === "horizontal" ? 600 : 196}
                          height={196}
                          className={kind === "horizontal" ? "h-auto w-full max-w-52" : "h-full w-auto"}
                        />
                      </Preview>
                      <div className="flex items-center justify-between gap-2 p-3">
                        <p className="text-xs font-light leading-snug">{c.inks[combo]}</p>
                        <AssetDownload name={name} label={c.download} formats={formats(file, kind, locale === "fr" ? "vectoriel" : "vector")} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <Note title={c.logos.which.title} items={c.logos.which.items} />
      </Section>

      {/* Icons */}
      <Section id="icons" eyebrow={c.sections.icons} title={c.icons.heading} body={c.icons.body}>
        <div className="space-y-4">
          {(["on-light", "on-dark"] as const).map((ground) => (
            <div key={ground} className="rounded-2xl border bg-card p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{c.icons.grounds[ground]}</p>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(["solid", "outline"] as const).flatMap((style) =>
                  (["brand", "mono"] as const).flatMap((ink) =>
                    (["round", "square"] as const).map((shape) => {
                      const file = `scintillar-icon-${style}-${shape}-${ink}-${ground}`;
                      const name = `${c.icons.styles[style]}, ${c.icons.shapes[shape]}, ${c.icons.inks[ink]}`;
                      return (
                        <li key={file} className="overflow-hidden rounded-xl border">
                          <Preview ground={ground} className="h-24">
                            <Image src={`${KIT}/${file}.svg`} alt={`Scintillar, ${name}`} width={56} height={56} className="size-14" />
                          </Preview>
                          <div className="flex items-center justify-between gap-2 p-2.5">
                            <p className="text-xs font-light leading-snug">{name}</p>
                            <AssetDownload name={name} label={c.download} formats={formats(file, "icon", locale === "fr" ? "vectoriel" : "vector")} />
                          </div>
                        </li>
                      );
                    }),
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Usage rules */}
      <Section id="rules" eyebrow={c.sections.rules} title={c.rules.heading} body={c.rules.body}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg">{c.rules.clearTitle}</h3>
            <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">{c.rules.clearBody}</p>
            <figure className="mt-6">
              <div className="relative mx-auto w-fit rounded-md border border-dashed border-primary/70 bg-[#F0F4F3] p-[18px]">
                <Image
                  src={`${KIT}/scintillar-horizontal-brand-on-light.svg`}
                  alt=""
                  width={600}
                  height={196}
                  className="h-auto w-56 max-w-full"
                />
                {(["top-1 left-1/2 -translate-x-1/2", "bottom-1 left-1/2 -translate-x-1/2", "left-1 top-1/2 -translate-y-1/2", "right-1 top-1/2 -translate-y-1/2"] as const).map((pos) => (
                  <span key={pos} aria-hidden="true" className={cn("absolute size-2.5 rounded-full border-2 border-primary", pos)} />
                ))}
              </div>
              <figcaption className="mt-3 text-center text-xs font-light text-muted-foreground">{c.rules.clearLabel}</figcaption>
            </figure>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg">{c.rules.minTitle}</h3>
            <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">{c.rules.minBody}</p>
            <dl className="mt-6 divide-y rounded-lg border">
              {c.rules.min.map((m) => (
                <div key={m.label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="font-light">{m.label}</dt>
                  <dd className="font-bold">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <h3 className="mt-12 text-lg">{c.rules.dontTitle}</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(c.rules.donts) as (keyof BrandContent["rules"]["donts"])[]).map((key) => (
            <li key={key} className="overflow-hidden rounded-xl border bg-card">
              <Misuse kind={key} />
              <p className="flex items-start gap-2 p-3 text-sm">
                <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                {c.rules.donts[key]}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-xl border border-l-4 border-l-primary bg-card p-5">
          <p className="font-bold">{c.rules.doTitle}</p>
          <ul className="mt-3 space-y-2">
            {c.rules.dos.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm font-light">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Color */}
      <Section id="color" eyebrow={c.sections.color} title={c.color.heading} body={c.color.body}>
        <div className="grid gap-4 lg:grid-cols-2">
          {([
            ["light", c.color.light, LIGHT, LIGHT_BG],
            ["dark", c.color.dark, DARK, DARK_BG],
          ] as const).map(([key, label, swatches, bg]) => (
            <div key={key} className="rounded-2xl border p-4 sm:p-5" style={{ backgroundColor: bg, color: key === "dark" ? "#FAFAFA" : "#0D0D0D" }}>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
              <ul className="mt-4 space-y-2">
                {swatches.map((s) => (
                  <li key={s.token} className="flex items-center gap-3">
                    <span
                      className="size-10 shrink-0 rounded-lg border"
                      style={{ backgroundColor: s.hex, borderColor: key === "dark" ? "#293D36" : "#D2DAD8" }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{s.token}</p>
                      <p className="truncate text-xs font-light opacity-80">{c.color.roles[s.token]}</p>
                    </div>
                    <CopyValue value={s.hex} labels={c.copy} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-4 rounded-xl border border-l-4 border-l-primary bg-card p-5">
          <span className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="size-5 rounded-full bg-[#005E3E]" />
            <span className="size-5 rounded-full bg-[#5CD6AD]" />
          </span>
          <div>
            <p className="font-bold">{c.color.logoTitle}</p>
            <p className="mt-1 text-sm font-light text-muted-foreground">{c.color.logoBody}</p>
          </div>
        </div>

        <h3 className="mt-12 text-lg">{c.color.contrastTitle}</h3>
        <p className="mt-2 text-sm font-light text-muted-foreground">{c.color.contrastBody}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {(["light", "dark"] as const).map((key) => (
            <ul key={key} className="divide-y rounded-xl border bg-card">
              {CONTRAST[key].map((pair, i) => (
                <li key={pair.fg + pair.bg} className="flex items-center gap-3 p-3">
                  <span
                    className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md border text-sm font-bold"
                    style={{ backgroundColor: pair.bg, color: pair.fg }}
                    aria-hidden="true"
                  >
                    Aa
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-light">
                    {c.color.contrastPairs[i]}
                    <span className="block text-xs text-muted-foreground">{key === "light" ? c.color.light : c.color.dark}</span>
                  </span>
                  <span className="text-sm font-bold">{pair.ratio.toFixed(1)}:1</span>
                  <span className="rounded-full bg-primary/12 px-2 py-0.5 text-xs font-bold text-primary">AAA</span>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border bg-card p-6">
          <h3 className="text-lg">{c.color.tokensTitle}</h3>
          <p className="mt-2 max-w-2xl text-sm font-light leading-relaxed text-muted-foreground">{c.color.tokensBody}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={TOKENS.css} download>
                <FileCode className="size-4" />
                {c.color.tokensCss}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={TOKENS.json} download>
                <FileCode className="size-4" />
                {c.color.tokensJson}
              </a>
            </Button>
          </div>
        </div>
      </Section>

      {/* Type */}
      <Section id="type" eyebrow={c.sections.type} title={c.type.heading} body={c.type.body}>
        <div className="rounded-2xl border bg-card">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b p-6">
            <p className="text-6xl font-bold leading-none sm:text-7xl" aria-hidden="true">
              Aa
            </p>
            <div className="text-sm">
              <p className="font-bold">JetBrains Mono</p>
              <p className="mt-1 font-light text-muted-foreground">{c.type.license}</p>
              <a
                href="https://fonts.google.com/specimen/JetBrains+Mono"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block font-medium text-primary underline-offset-4 hover:underline"
              >
                {c.type.get}
              </a>
            </div>
          </div>
          <ul className="divide-y">
            {c.type.scale.map((s) => (
              <li key={s.name} className="grid gap-2 p-6 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-6">
                <div className="text-xs">
                  <p className="font-bold">{s.name}</p>
                  <p className="mt-0.5 font-light text-muted-foreground">{s.spec}</p>
                </div>
                <p className={cn("min-w-0 break-words leading-tight", s.className)}>{s.sample}</p>
              </li>
            ))}
          </ul>
        </div>
        <Note title={c.type.rulesTitle} items={c.type.rules} />
      </Section>

      {/* Naming */}
      <Section id="naming" eyebrow={c.sections.naming} title={c.naming.heading} body={c.naming.body}>
        <ul className="divide-y rounded-2xl border bg-card">
          {c.naming.rows.map((row) => (
            <li key={row.good} className="grid gap-2 p-4 sm:grid-cols-2 sm:gap-6">
              <p className="flex items-start gap-2 text-sm font-bold">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                {row.good}
              </p>
              <p className="flex items-start gap-2 text-sm font-light text-muted-foreground">
                <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                <s className="decoration-destructive/60">{row.bad}</s>
              </p>
            </li>
          ))}
        </ul>
        <Note title={c.naming.domainsTitle} items={c.naming.domains} />
      </Section>

      {/* Tools and white-label */}
      <Section id="tools" eyebrow={c.sections.tools} title={c.tools.heading} body={c.tools.body}>
        <ul className="grid gap-4 md:grid-cols-3">
          {c.tools.points.map((p) => (
            <li key={p.title} className="rounded-2xl border bg-card p-5">
              <p className="font-bold">{p.title}</p>
              <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-2xl border bg-card p-6">
          <h3 className="text-lg">{c.tools.creditTitle}</h3>
          <p className="mt-2 text-sm font-light text-muted-foreground">{c.tools.creditBody}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-lg border border-dashed p-5 text-xs font-light text-muted-foreground">
              <span>
                © 2026 Your Site ·{" "}
                <a href="https://scintillar.com" className="underline underline-offset-4 hover:text-primary">
                  {c.tools.creditPreview}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-foreground px-4 py-3 text-background">
              <code className="min-w-0 flex-1 break-all text-xs">{c.tools.creditText}</code>
              <CopyValue value={c.tools.creditText} labels={c.copy} className="shrink-0 hover:text-background/70">
                <span className="sr-only">{c.copy.copy}</span>
              </CopyValue>
            </div>
          </div>
        </div>
      </Section>

      {/* Voice */}
      <Section id="voice" eyebrow={c.sections.voice} title={c.voice.heading} body={c.voice.body}>
        <ol className="space-y-4">
          {c.voice.principles.map((p, i) => (
            <li key={p.title} className="grid gap-4 rounded-2xl border bg-card p-6 md:grid-cols-[1fr_1.2fr]">
              <div>
                <span className="text-2xl font-bold text-primary" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg">{p.title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="rounded-lg border border-primary/40 p-3">
                  <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Check className="size-3.5" aria-hidden="true" />
                    {c.voice.goodLabel}
                  </span>
                  {p.example.good}
                </p>
                <p className="rounded-lg border border-dashed p-3 font-light text-muted-foreground">
                  <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-destructive">
                    <X className="size-3.5" aria-hidden="true" />
                    {c.voice.badLabel}
                  </span>
                  {p.example.bad}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Contact */}
      <section className="mt-28 rounded-3xl bg-foreground p-6 text-background sm:p-10">
        <h2 className="text-3xl">{c.contact.title}</h2>
        <p className="mt-3 font-light opacity-80">{c.contact.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="secondary">
            <a href={GITHUB_ORG} target="_blank" rel="noreferrer">
              <GithubIcon className="size-4" />
              {c.contact.cta}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background">
            <a href={KIT_ZIP} download>
              <Download className="size-4" />
              {c.kit.download}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-primary">{children}</p>;
}

function Section({ id, eyebrow, title, body, children }: { id: string; eyebrow: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-28 scroll-mt-24">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-3 max-w-2xl scroll-mt-24 text-3xl sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl font-light leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Preview({ ground, className, children }: { ground: Ground; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn("flex items-center justify-center p-5", className)}
      style={{ backgroundColor: ground === "on-dark" ? DARK_BG : LIGHT_BG }}
    >
      {children}
    </div>
  );
}

function Note({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6 rounded-xl border border-l-4 border-l-primary bg-card p-5">
      <p className="font-bold">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm font-light">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A deliberately wrong use of the logo, drawn from the real file so the mistake is obvious. */
function Misuse({ kind }: { kind: keyof BrandContent["rules"]["donts"] }) {
  const logo = (src: string, style?: React.CSSProperties) => (
    <Image src={src} alt="" width={600} height={196} className="h-auto w-40" style={style} />
  );
  const light = `${KIT}/scintillar-horizontal-brand-on-light.svg`;
  return (
    <div
      aria-hidden="true"
      className="flex h-28 items-center justify-center overflow-hidden"
      style={{ backgroundColor: kind === "contrast" ? DARK_BG : LIGHT_BG }}
    >
      {kind === "stretch" && logo(light, { transform: "scaleX(1.35) scaleY(0.8)" })}
      {kind === "rotate" && logo(light, { transform: "rotate(-14deg)" })}
      {kind === "recolor" && logo(light, { filter: "hue-rotate(200deg) saturate(3)" })}
      {kind === "effects" && logo(light, { filter: "drop-shadow(3px 4px 3px rgb(0 0 0 / 0.55)) drop-shadow(0 0 8px #40BF95)" })}
      {kind === "contrast" && logo(`${KIT}/scintillar-horizontal-mono-on-light.svg`)}
      {kind === "retype" && (
        <span className="flex items-center gap-1.5">
          <Image src={`${KIT}/scintillar-mark-brand-on-light.svg`} alt="" width={196} height={196} className="size-14" />
          <span className="font-serif text-2xl italic text-[#0D0D0D]">Scintillar</span>
        </span>
      )}
    </div>
  );
}
