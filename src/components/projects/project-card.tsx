import Link from "next/link";
import { ArrowUpRight, CircleCheck, Lightbulb, LoaderCircle, Lock, Scale } from "lucide-react";
import type { Category, CoverKind, Status } from "@/content/projects";
import { GithubIcon } from "@/components/site/github-icon";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./project-cover";

/** A project resolved to one locale: plain strings only, safe to pass to client components. */
export interface CardProject {
  slug: string;
  href: string;
  name: string;
  kind: string;
  pitch: string;
  status: Status;
  statusLabel: string;
  category: Category;
  tags: string[];
  license: string | null;
  github?: string;
  repoPrivate?: boolean;
  cover: CoverKind;
  featured?: boolean;
}

export interface CardLabels {
  privateRepo: string;
  view: string;
  github: string;
}

const statusIcon: Record<Status, typeof CircleCheck> = {
  available: CircleCheck,
  "in-progress": LoaderCircle,
  planned: Lightbulb,
};

export function StatusBadge({ status, label, className }: { status: Status; label: string; className?: string }) {
  const Icon = statusIcon[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        status === "available" && "border-primary/40 bg-primary/12 text-primary",
        status === "in-progress" && "border-primary/30 text-primary",
        status === "planned" && "border-border text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

function MetaBadges({ project, labels }: { project: CardProject; labels: CardLabels }) {
  return (
    <div className="relative z-10 flex flex-wrap items-center gap-1.5">
      <StatusBadge status={project.status} label={project.statusLabel} />
      {project.license && (
        <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
          <Scale className="size-3.5" aria-hidden="true" />
          {project.license}
        </span>
      )}
      {project.github ? (
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <GithubIcon className="size-3.5" />
          {labels.github}
        </a>
      ) : project.repoPrivate ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden="true" />
          {labels.privateRepo}
        </span>
      ) : null}
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag} className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** Title that is also the card's link; its ::after stretches over the whole card. */
function CardTitle({ project, className }: { project: CardProject; className?: string }) {
  return (
    <h3 className={className}>
      <Link
        href={project.href}
        className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
      >
        {project.name}
      </Link>
    </h3>
  );
}

const cardBase =
  "group relative rounded-2xl transition-colors duration-300 hover:bg-accent/40 p-2 -m-2";

/** Large card at the top of a category in Browse mode. */
export function FeatureCard({ project, labels }: { project: CardProject; labels: CardLabels }) {
  return (
    <article className={cardBase}>
      <ProjectCover kind={project.cover} size="lg" />
      <div className="mt-5 flex flex-col gap-3 px-1 pb-1">
        <div>
          <CardTitle project={project} className="text-3xl" />
          <p className="mt-1 text-xs text-muted-foreground">{project.kind}</p>
        </div>
        <p className="text-lg font-light">{project.pitch}</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MetaBadges project={project} labels={labels} />
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            {labels.view}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

/** Side-list card next to the feature card. */
export function CompactCard({ project, labels }: { project: CardProject; labels: CardLabels }) {
  return (
    <article className={cn(cardBase, "flex gap-4")}>
      <ProjectCover kind={project.cover} size="sm" className="w-32 shrink-0 sm:w-40" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <CardTitle project={project} className="text-lg" />
        <p className="-mt-1 text-xs text-muted-foreground">{project.kind}</p>
        <p className="text-sm font-light">{project.pitch}</p>
        <MetaBadges project={project} labels={labels} />
      </div>
    </article>
  );
}

/** Uniform card for grids. */
export function GridCard({ project, labels }: { project: CardProject; labels: CardLabels }) {
  return (
    <article className={cn(cardBase, "flex flex-col")}>
      <ProjectCover kind={project.cover} />
      <div className="mt-4 flex flex-1 flex-col gap-2 px-1 pb-1">
        <CardTitle project={project} className="text-xl" />
        <p className="-mt-1.5 text-xs text-muted-foreground">{project.kind}</p>
        <p className="text-sm font-light">{project.pitch}</p>
        <div className="mt-auto space-y-2 pt-2">
          <MetaBadges project={project} labels={labels} />
          <Tags tags={project.tags} />
        </div>
      </div>
    </article>
  );
}
