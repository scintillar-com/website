import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { categories, categoryInfo, projects } from "@/content/projects";
import { cardLabels, toCard } from "@/content/resolve";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.projects.title, description: t.projects.lead, alternates: { canonical: `/${locale}/projects` } };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const cards = projects.map((p) => toCard(p, locale, t));
  const cats = categories.map((id) => ({
    id,
    title: categoryInfo[id].title[locale],
    description: categoryInfo[id].description[locale],
  }));
  const labels = {
    ...cardLabels(t),
    browse: t.projects.browse,
    filter: t.projects.filter,
    search: t.projects.search,
    category: t.projects.category,
    tag: t.projects.tag,
    status: t.projects.status,
    license: t.projects.license,
    clear: t.projects.clear,
    count: t.projects.count,
    emptyTitle: t.projects.emptyTitle,
    emptyBody: t.projects.emptyBody,
    noLicense: t.project.noLicense,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
      <h1 className="text-5xl sm:text-6xl">{t.projects.title}</h1>
      <p className="mt-4 max-w-2xl text-lg font-light text-muted-foreground">{t.projects.lead}</p>
      <div className="mt-8">
        <Suspense>
          <ProjectsExplorer projects={cards} categories={cats} statusLabels={t.status} labels={labels} />
        </Suspense>
      </div>
    </div>
  );
}
