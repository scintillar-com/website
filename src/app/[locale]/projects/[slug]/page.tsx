import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, FlaskConical, Globe, Lock, Package } from "lucide-react";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { categoryInfo, getProject, projects } from "@/content/projects";
import { cardLabels, toCard } from "@/content/resolve";
import { ProjectCover } from "@/components/projects/project-cover";
import { GridCard, StatusBadge } from "@/components/projects/project-card";
import { CopyCommand } from "@/components/projects/copy-command";
import { GithubIcon } from "@/components/site/github-icon";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) return {};
  return {
    title: project.name,
    description: project.pitch[locale],
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/projects/${slug}`])),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) notFound();
  const t = getDictionary(locale);
  const tp = t.project;

  const related = projects
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .concat(projects.filter((p) => p.slug !== project.slug && p.category !== project.category && p.status === "available"))
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <Link
        href={`/${locale}/projects`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {tp.back}
      </Link>

      <header className="mt-8 grid items-center gap-10 lg:grid-cols-[5fr_6fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-primary">{categoryInfo[project.category].title[locale]}</p>
          <h1 className="mt-3 text-5xl sm:text-6xl">{project.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{project.kind[locale]}</p>
          <p className="mt-6 text-xl font-light">{project.pitch[locale]}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <StatusBadge status={project.status} label={t.status[project.status]} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.github ? (
              <Button asChild>
                <a href={project.github} target="_blank" rel="noreferrer">
                  <GithubIcon className="size-4" />
                  {tp.github}
                </a>
              </Button>
            ) : project.repoPrivate ? (
              <Button disabled variant="outline">
                <Lock className="size-4" />
                {t.projects.privateRepo}
              </Button>
            ) : null}
            {project.links?.live && (
              <Button asChild variant="outline">
                <a href={project.links.live} target="_blank" rel="noreferrer">
                  <Globe className="size-4" />
                  {tp.live}
                  <ArrowUpRight className="size-3.5 opacity-60" />
                </a>
              </Button>
            )}
            {project.links?.npm && (
              <Button asChild variant="outline">
                <a href={project.links.npm} target="_blank" rel="noreferrer">
                  <Package className="size-4" />
                  {tp.npm}
                  <ArrowUpRight className="size-3.5 opacity-60" />
                </a>
              </Button>
            )}
          </div>
        </div>
        <ProjectCover kind={project.cover} size="lg" className="shadow-2xl shadow-primary/10" />
      </header>

      <div className="mt-20 grid gap-14 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-14">
          <section aria-labelledby="overview">
            <h2 id="overview" className="text-2xl">
              {tp.overview}
            </h2>
            <p className="mt-4 text-lg font-light leading-relaxed">{project.description[locale]}</p>
          </section>

          <section aria-labelledby="features">
            <h2 id="features" className="text-2xl">
              {tp.features}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {project.features[locale].map((f) => (
                <li key={f} className="flex gap-3 rounded-lg border p-4 font-light">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          {project.install ? (
            <section aria-labelledby="get-started">
              <h2 id="get-started" className="text-2xl">
                {tp.getStarted}
              </h2>
              <div className="mt-5 space-y-2">
                {project.install.map((cmd) => (
                  <CopyCommand key={cmd} command={cmd} labels={{ copy: tp.copy, copied: tp.copied }} />
                ))}
              </div>
            </section>
          ) : project.roadmap ? (
            <section aria-labelledby="roadmap">
              <h2 id="roadmap" className="text-2xl">
                {tp.roadmap}
              </h2>
              <p className="mt-4 rounded-lg border border-dashed p-5 font-light">{project.roadmap[locale]}</p>
            </section>
          ) : null}
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6 lg:sticky lg:top-24">
          <dl className="space-y-5 text-sm">
            <Meta label={tp.status}>{t.status[project.status]}</Meta>
            <Meta label={tp.category}>{categoryInfo[project.category].title[locale]}</Meta>
            <Meta label={tp.license}>{project.license ?? tp.noLicense}</Meta>
            <Meta label={tp.links}>
              {project.github || project.links ? (
                <ul className="flex flex-wrap gap-2">
                  {project.github && (
                    <IconLink href={project.github} label={tp.github}>
                      <GithubIcon className="size-4" />
                    </IconLink>
                  )}
                  {project.links?.live && (
                    <IconLink href={project.links.live} label={tp.live}>
                      <Globe className="size-4" />
                    </IconLink>
                  )}
                  {project.links?.npm && (
                    <IconLink href={project.links.npm} label={tp.npm}>
                      <Package className="size-4" />
                    </IconLink>
                  )}
                </ul>
              ) : (
                <span className="text-muted-foreground">{project.repoPrivate ? t.projects.privateRepo : t.projects.noRepo}</span>
              )}
            </Meta>
          </dl>
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {project.tags[locale].map((tag) => (
              <li key={tag} className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {tag}
              </li>
            ))}
          </ul>
          <p className="mt-6 flex gap-2 border-t pt-5 text-xs font-light text-muted-foreground">
            <FlaskConical className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {tp.asIs}
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-24">
          <h2 id="related" className="text-2xl">
            {tp.related}
          </h2>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <GridCard key={p.slug} project={toCard(p, locale, t)} labels={cardLabels(t)} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        title={href}
        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors hover:border-primary/50 hover:text-primary"
      >
        {children}
        {label}
      </a>
    </li>
  );
}
