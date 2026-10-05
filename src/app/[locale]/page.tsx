import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, X } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProject, projects } from "@/content/projects";
import { cardLabels, toCard } from "@/content/resolve";
import { CompactCard, FeatureCard } from "@/components/projects/project-card";
import { ProjectCover } from "@/components/projects/project-cover";
import { GithubIcon } from "@/components/site/github-icon";
import { Button } from "@/components/ui/button";
import { GITHUB_ORG } from "@/lib/site";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const h = t.home;
  const labels = cardLabels(t);

  const lead = toCard(projects.find((p) => p.slug === "docs-shell")!, locale, t);
  const side = projects
    .filter((p) => p.slug !== "docs-shell" && p.status !== "someday")
    .slice(0, 4)
    .map((p) => toCard(p, locale, t));
  const someday = getProject("hacking-framework")!;

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-20 pt-24 text-left sm:px-6 md:pt-32 md:text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">{h.eyebrow}</p>
        <h1 className="mt-6 text-4xl leading-[1.1] sm:text-5xl md:text-6xl">{h.title}</h1>
        <p className="mx-auto mt-8 max-w-3xl text-lg font-thin leading-relaxed sm:text-xl">{h.lead}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row md:justify-center">
          <Button asChild size="lg">
            <Link href={`/${locale}/projects`}>
              {h.browse}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={GITHUB_ORG} target="_blank" rel="noreferrer">
              <GithubIcon className="size-4" />
              {h.github}
            </a>
          </Button>
        </div>
      </section>

      {/* Featured projects */}
      <section aria-labelledby="featured" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="featured" className="text-3xl sm:text-4xl">
              {h.featuredTitle}
            </h2>
            <p className="mt-2 font-light text-muted-foreground">{h.featuredLead}</p>
          </div>
          <Link
            href={`/${locale}/projects`}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            {h.allProjects}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[7fr_5fr]">
          <FeatureCard project={lead} labels={labels} />
          <div className="flex flex-col gap-7 lg:justify-center">
            {side.map((p) => (
              <CompactCard key={p.slug} project={p} labels={labels} />
            ))}
          </div>
        </div>
      </section>

      {/* Is / isn't */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <PrincipleList title={h.isTitle} items={h.is} positive />
          <PrincipleList title={h.isntTitle} items={h.isnt} />
        </div>
      </section>

      {/* Someday */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 rounded-3xl border border-dashed p-6 sm:p-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{h.somedayEyebrow}</p>
            <h2 className="mt-3 text-3xl">{h.somedayTitle}</h2>
            <p className="mt-4 font-light leading-relaxed text-muted-foreground">{h.somedayBody}</p>
            <Link
              href={`/${locale}/projects/${someday.slug}`}
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              {h.somedayCta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ProjectCover kind={someday.cover} className="opacity-80 grayscale-[40%]" />
        </div>
      </section>

      {/* Contribute */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl sm:text-4xl">{h.contributeTitle}</h2>
        <p className="mt-4 text-lg font-light text-muted-foreground">{h.contributeBody}</p>
        <Button asChild size="lg" className="mt-8">
          <a href={GITHUB_ORG} target="_blank" rel="noreferrer">
            <GithubIcon className="size-4" />
            {h.contributeCta}
          </a>
        </Button>
      </section>
    </>
  );
}

function PrincipleList({ title, items, positive }: { title: string; items: string[][]; positive?: boolean }) {
  const Icon = positive ? Check : X;
  return (
    <div className={positive ? "rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8" : "rounded-2xl border p-6 sm:p-8"}>
      <h2 className="text-2xl">{title}</h2>
      <ul className="mt-6 space-y-5">
        {items.map(([head, body]) => (
          <li key={head} className="flex gap-3">
            <Icon
              className={positive ? "mt-1 size-4 shrink-0 text-primary" : "mt-1 size-4 shrink-0 text-muted-foreground"}
              aria-hidden="true"
            />
            <div>
              <p className="font-bold">{head}</p>
              <p className="mt-1 text-sm font-light text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
