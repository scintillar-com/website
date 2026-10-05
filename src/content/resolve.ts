import "server-only";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { CardProject } from "@/components/projects/project-card";
import type { Project } from "./projects";

/** Resolves a project to one locale for the card components. */
export function toCard(p: Project, locale: Locale, t: Dictionary): CardProject {
  return {
    slug: p.slug,
    href: `/${locale}/tools/${p.slug}`,
    name: p.name,
    kind: p.kind[locale],
    pitch: p.pitch[locale],
    status: p.status,
    statusLabel: t.status[p.status],
    category: p.category,
    tags: p.tags[locale],
    license: p.license,
    github: p.github,
    repoPrivate: p.repoPrivate,
    cover: p.cover,
    featured: p.featured,
  };
}

export function cardLabels(t: Dictionary) {
  return { privateRepo: t.projects.privateRepo, view: t.projects.view, github: t.project.github };
}
