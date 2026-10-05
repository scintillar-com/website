import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Accessibility,
  ArrowRight,
  Blocks,
  FlaskConical,
  KeyRound,
  Layers,
  Palette,
  Puzzle,
  Quote,
  Receipt,
  Rocket,
  Sparkles,
  Tag,
  Target,
  Wrench,

} from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/site/github-icon";
import { GITHUB_ORG } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

type Pair = { icon: React.ComponentType<{ className?: string }>; title: string; body: string };

interface AboutContent {
  eyebrow: string;
  title: string;
  lead: string;
  builtFor: string;
  audiences: string[];
  why: { eyebrow: string; title: string; body: string; problemLabel: string; answerLabel: string; pairs: [Pair, Pair][]; asIsTitle: string; asIsBody: string };
  how: { eyebrow: string; title: string; body: string; steps: Pair[] };
  mission: { eyebrow: string; missionTitle: string; missionLead: string; missionBody: string; visionTitle: string; visionLead: string; visionBody: string; motto: string };
  values: { eyebrow: string; title: string; items: Pair[] };
  cta: { title: string; body: string; browse: string; github: string; involved: string; roles: string[] };
}

const content: Record<Locale, AboutContent> = {
  en: {
    eyebrow: "What is Scintillar?",
    title: "A digital playground for self-serve tools",
    lead: "Scintillar builds free, white-label alternatives to larger and costlier tools: docs sites, component registries, feature request boards, support desks and status pages. You host them, put your brand on them and change whatever you need.",
    builtFor: "Built for",
    audiences: ["Small teams", "Developers", "Designers", "Self-hosters"],
    why: {
      eyebrow: "Why Scintillar",
      title: "Big tools come with big bills. We build small ones.",
      body: "Most teams pay for platforms that do far more than they need, under someone else's brand. Scintillar starts from the part you actually use.",
      problemLabel: "The problem",
      answerLabel: "Our answer",
      pairs: [
        [
          { icon: Receipt, title: "Subscriptions that add up", body: "Every seat and every product is another monthly bill." },
          { icon: KeyRound, title: "Free and open source", body: "No seats and no plans. You run it on your own infrastructure." },
        ],
        [
          { icon: Tag, title: "Someone else's brand", body: "Your users see the vendor's logo, not yours." },
          { icon: Palette, title: "White-label by design", body: "Every tool takes your logo, colors and domain." },
        ],
        [
          { icon: Layers, title: "Heavy, opinionated platforms", body: "You adopt a whole suite to use one feature." },
          { icon: Puzzle, title: "Small and composable", body: "Each tool does one job, works on its own and integrates with the others." },
        ],
      ],
      asIsTitle: "Provided as is",
      asIsBody: "These are tools we use ourselves, shared without sales or support pressure. Help is best-effort, on GitHub.",
    },
    how: {
      eyebrow: "How we build",
      title: "UX first, even for developer tools",
      body: "A self-serve tool only works if people can figure it out on their own. So each one is designed before it's built, with the care you'd expect from a product you pay for.",
      steps: [
        { icon: Target, title: "Start from the job", body: "Each tool begins with a concrete task someone needs done, and the first screen is built around it." },
        { icon: Rocket, title: "Defaults that work", body: "Sensible defaults and a one-command deploy, so you see something useful before you configure anything." },
        { icon: Accessibility, title: "Accessible and bilingual", body: "Keyboard and screen-reader support from the start, with English and French built in." },
        { icon: Blocks, title: "One design system", body: "Every tool is built with Scintillar UI, so they look and behave alike, and your brand applies to all of them the same way." },
      ],
    },
    mission: {
      eyebrow: "Mission and vision",
      missionTitle: "Mission",
      missionLead: "Build small, white-label tools that teams can host themselves instead of paying for large platforms.",
      missionBody: "We build what we need, document it as we go and share it so others can adapt it to their own work.",
      visionTitle: "Vision",
      visionLead: "A set of composable tools that are as pleasant to use as the products they replace.",
      visionBody: "Each new tool reuses the same design system and conventions, so the whole set stays consistent as it grows.",
      motto: "One small tool at a time.",
    },
    values: {
      eyebrow: "Values",
      title: "What guides the work",
      items: [
        { icon: Wrench, title: "Usefulness", body: "Build what someone actually needs." },
        { icon: Sparkles, title: "Simplicity", body: "Keep scopes small and setups short." },
        { icon: GithubIcon, title: "Openness", body: "Code and discussions happen in public." },
        { icon: Accessibility, title: "Accessibility", body: "Usable with a keyboard, a screen reader or in French." },
        { icon: KeyRound, title: "Ownership", body: "You host it, you brand it, you own it." },
      ],
    },
    cta: {
      title: "Come play",
      body: "Try a project, open an issue or send a pull request.",
      browse: "Browse projects",
      github: "GitHub",
      involved: "Get involved as",
      roles: ["Contributor", "Designer", "Tester", "User"],
    },
  },
  fr: {
    eyebrow: "Qu'est-ce que Scintillar?",
    title: "Un terrain de jeu numérique pour des outils en libre-service",
    lead: "Scintillar crée des solutions de rechange gratuites et en marque blanche à des outils plus gros et plus coûteux : sites de documentation, registres de composants, tableaux de suggestions, comptoirs de support et pages de statut. Vous les hébergez, vous y mettez votre marque et vous modifiez ce dont vous avez besoin.",
    builtFor: "Conçu pour",
    audiences: ["Petites équipes", "Développeurs", "Designers", "Autohébergement"],
    why: {
      eyebrow: "Pourquoi Scintillar",
      title: "Les gros outils viennent avec de grosses factures. Nous en bâtissons de petits.",
      body: "La plupart des équipes paient pour des plateformes qui en font bien plus que nécessaire, sous la marque de quelqu'un d'autre. Scintillar part de la partie que vous utilisez vraiment.",
      problemLabel: "Le problème",
      answerLabel: "Notre réponse",
      pairs: [
        [
          { icon: Receipt, title: "Des abonnements qui s'additionnent", body: "Chaque siège et chaque produit est une facture mensuelle de plus." },
          { icon: KeyRound, title: "Gratuit et libre", body: "Ni sièges ni forfaits. Vous l'exécutez sur votre propre infrastructure." },
        ],
        [
          { icon: Tag, title: "La marque de quelqu'un d'autre", body: "Vos utilisateurs voient le logo du fournisseur, pas le vôtre." },
          { icon: Palette, title: "En marque blanche, par conception", body: "Chaque outil prend votre logo, vos couleurs et votre domaine." },
        ],
        [
          { icon: Layers, title: "Des plateformes lourdes et dogmatiques", body: "Vous adoptez toute une suite pour une seule fonctionnalité." },
          { icon: Puzzle, title: "Petits et composables", body: "Chaque outil fait une seule chose, fonctionne seul et s'intègre aux autres." },
        ],
      ],
      asIsTitle: "Fourni tel quel",
      asIsBody: "Ce sont des outils que nous utilisons nous-mêmes, partagés sans pression de vente ni de support. L'aide se fait au mieux, sur GitHub.",
    },
    how: {
      eyebrow: "Notre façon de bâtir",
      title: "L'expérience utilisateur d'abord, même pour les outils de développement",
      body: "Un outil en libre-service ne fonctionne que si les gens s'y retrouvent seuls. Chacun est donc conçu avant d'être construit, avec le soin qu'on attend d'un produit payant.",
      steps: [
        { icon: Target, title: "Partir de la tâche", body: "Chaque outil commence par une tâche concrète à accomplir, et le premier écran est construit autour d'elle." },
        { icon: Rocket, title: "Des valeurs par défaut qui marchent", body: "Des réglages par défaut sensés et un déploiement en une commande, pour voir quelque chose d'utile avant de configurer quoi que ce soit." },
        { icon: Accessibility, title: "Accessible et bilingue", body: "Clavier et lecteurs d'écran pris en charge dès le départ, avec l'anglais et le français inclus." },
        { icon: Blocks, title: "Un seul design system", body: "Chaque outil est bâti avec Scintillar UI : ils se ressemblent, se comportent de la même façon, et votre marque s'applique partout pareil." },
      ],
    },
    mission: {
      eyebrow: "Mission et vision",
      missionTitle: "Mission",
      missionLead: "Bâtir de petits outils en marque blanche que les équipes hébergent elles-mêmes au lieu de payer pour de grandes plateformes.",
      missionBody: "Nous bâtissons ce dont nous avons besoin, le documentons au fur et à mesure et le partageons pour que d'autres puissent l'adapter.",
      visionTitle: "Vision",
      visionLead: "Un ensemble d'outils composables aussi agréables à utiliser que les produits qu'ils remplacent.",
      visionBody: "Chaque nouvel outil réutilise le même design system et les mêmes conventions, pour que l'ensemble reste cohérent en grandissant.",
      motto: "Un petit outil à la fois.",
    },
    values: {
      eyebrow: "Valeurs",
      title: "Ce qui guide le travail",
      items: [
        { icon: Wrench, title: "Utilité", body: "Bâtir ce dont quelqu'un a vraiment besoin." },
        { icon: Sparkles, title: "Simplicité", body: "Garder des portées étroites et des installations courtes." },
        { icon: GithubIcon, title: "Ouverture", body: "Le code et les discussions se passent en public." },
        { icon: Accessibility, title: "Accessibilité", body: "Utilisable au clavier, avec un lecteur d'écran ou en français." },
        { icon: KeyRound, title: "Propriété", body: "Vous l'hébergez, vous y mettez votre marque, il vous appartient." },
      ],
    },
    cta: {
      title: "Venez jouer",
      body: "Essayez un projet, ouvrez une issue ou envoyez une pull request.",
      browse: "Voir les projets",
      github: "GitHub",
      involved: "Participez comme",
      roles: ["Contributeur", "Designer", "Testeur", "Utilisateur"],
    },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.nav.about, description: content[locale].lead, alternates: { canonical: `/${locale}/about` } };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = content[locale];

  return (
    <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 sm:pt-20">
      {/* What is Scintillar */}
      <header>
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl">{c.title}</h1>
        <p className="mt-6 max-w-3xl text-lg font-light leading-relaxed">{c.lead}</p>
        <div className="mt-8">
          <p className="text-xs font-bold">{c.builtFor}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {c.audiences.map((a) => (
              <li key={a} className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Why */}
      <section aria-labelledby="why" className="mt-28">
        <Eyebrow>{c.why.eyebrow}</Eyebrow>
        <h2 id="why" className="mt-3 max-w-2xl text-3xl sm:text-4xl">
          {c.why.title}
        </h2>
        <p className="mt-4 max-w-2xl font-light leading-relaxed text-muted-foreground">{c.why.body}</p>

        <div className="mt-10 hidden grid-cols-[1fr_auto_1fr] gap-x-6 text-xs font-bold uppercase tracking-widest text-muted-foreground md:grid">
          <span>{c.why.problemLabel}</span>
          <span className="w-9" />
          <span>{c.why.answerLabel}</span>
        </div>
        <ul className="mt-4 space-y-4">
          {c.why.pairs.map(([problem, answer]) => (
            <li key={problem.title} className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-6">
              <Card pair={problem} muted />
              <span className="mx-auto flex size-9 rotate-90 items-center justify-center rounded-full bg-primary text-primary-foreground md:rotate-0">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
              <Card pair={answer} />
            </li>
          ))}
        </ul>
        <div className="mt-8 flex gap-4 rounded-xl border border-l-4 border-l-primary bg-card p-5">
          <FlaskConical className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="font-bold">{c.why.asIsTitle}</p>
            <p className="mt-1 text-sm font-light text-muted-foreground">{c.why.asIsBody}</p>
          </div>
        </div>
      </section>

      {/* How we build: UX first */}
      <section aria-labelledby="how" className="mt-28">
        <Eyebrow>{c.how.eyebrow}</Eyebrow>
        <h2 id="how" className="mt-3 max-w-2xl text-3xl sm:text-4xl">
          {c.how.title}
        </h2>
        <p className="mt-4 max-w-2xl font-light leading-relaxed text-muted-foreground">{c.how.body}</p>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {c.how.steps.map((step, i) => (
            <li key={step.title} className="rounded-2xl border bg-card p-6 transition-colors hover:border-primary/50">
              <div className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-3xl font-bold text-primary" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-lg">{step.title}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Mission and vision */}
      <section aria-labelledby="mission" className="mt-28 rounded-3xl bg-foreground p-6 text-background sm:p-10">
        <p id="mission" className="text-xs font-bold uppercase tracking-widest opacity-70">
          {c.mission.eyebrow}
        </p>
        <div className="mt-6 grid gap-10 md:grid-cols-2 md:divide-x md:divide-background/20">
          <Statement title={c.mission.missionTitle} lead={c.mission.missionLead} body={c.mission.missionBody} />
          <Statement title={c.mission.visionTitle} lead={c.mission.visionLead} body={c.mission.visionBody} className="md:pl-10" />
        </div>
        <div className="mt-10 flex items-center gap-3" aria-hidden="true">
          <span className="size-2 rounded-full border border-background/60" />
          <span className="h-px flex-1 bg-background/30" />
          <span className="size-2 rounded-full border border-background/60" />
        </div>
        <p className="mt-6 text-center font-bold">{c.mission.motto}</p>
      </section>

      {/* Values */}
      <section aria-labelledby="values" className="mt-28">
        <Eyebrow>{c.values.eyebrow}</Eyebrow>
        <h2 id="values" className="mt-3 text-3xl sm:text-4xl">
          {c.values.title}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.values.items.map((v) => (
            <li key={v.title} className="flex gap-4 rounded-2xl border bg-card p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                <v.icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold">{v.title}</p>
                <p className="mt-1 text-sm font-light text-muted-foreground">{v.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Call to action */}
      <section className="mt-28 rounded-3xl border bg-card p-6 sm:p-10">
        <h2 className="text-3xl">{c.cta.title}</h2>
        <p className="mt-3 font-light text-muted-foreground">{c.cta.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={`/${locale}/projects`}>
              {c.cta.browse}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={GITHUB_ORG} target="_blank" rel="noreferrer">
              <GithubIcon className="size-4" />
              {c.cta.github}
            </a>
          </Button>
        </div>
        <p className="mt-8 text-xs font-bold">{c.cta.involved}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {c.cta.roles.map((r) => (
            <li key={r} className="rounded-full border px-3 py-1 text-xs">
              {r}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-primary">{children}</p>;
}

function Card({ pair, muted }: { pair: Pair; muted?: boolean }) {
  return (
    <div className={muted ? "flex gap-3 rounded-xl border border-dashed p-5" : "flex gap-3 rounded-xl border border-primary/40 bg-card p-5"}>
      <pair.icon className={muted ? "mt-0.5 size-5 shrink-0 text-muted-foreground" : "mt-0.5 size-5 shrink-0 text-primary"} aria-hidden="true" />
      <div>
        <p className="font-bold">{pair.title}</p>
        <p className="mt-1 text-sm font-light text-muted-foreground">{pair.body}</p>
      </div>
    </div>
  );
}

function Statement({ title, lead, body, className }: { title: string; lead: string; body: string; className?: string }) {
  return (
    <div className={className}>
      <p className="flex items-center gap-2 text-lg font-bold">
        <Quote className="size-5 text-primary" aria-hidden="true" />
        {title}
      </p>
      <p className="mt-4 text-xl font-bold leading-snug">{lead}</p>
      <p className="mt-4 text-sm font-light leading-relaxed opacity-80">{body}</p>
    </div>
  );
}
