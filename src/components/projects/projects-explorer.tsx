"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, LayoutGrid, Search, SlidersHorizontal, X } from "lucide-react";
import type { Category, Status } from "@/content/projects";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { CompactCard, FeatureCard, GridCard, type CardLabels, type CardProject } from "./project-card";

export interface ExplorerLabels extends CardLabels {
  browse: string;
  filter: string;
  search: string;
  category: string;
  tag: string;
  status: string;
  license: string;
  clear: string;
  count: { one: string; other: string };
  emptyTitle: string;
  emptyBody: string;
  noLicense: string;
}

interface ExplorerProps {
  projects: CardProject[];
  categories: { id: Category; title: string; description: string }[];
  statusLabels: Record<Status, string>;
  labels: ExplorerLabels;
}

type View = "browse" | "filter";
type FilterKey = "category" | "tag" | "status" | "license";
const NO_LICENSE = "none";

/** Projects page body: a "Browse" tour by category and a "Filter" search grid, both synced to the URL. */
export function ProjectsExplorer({ projects, categories, statusLabels, labels }: ExplorerProps) {
  const params = useSearchParams();
  const [view, setView] = useState<View>(params.get("view") === "filter" ? "filter" : "browse");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [filters, setFilters] = useState<Record<FilterKey, string[]>>(() => ({
    category: split(params.get("category")),
    tag: split(params.get("tag")),
    status: split(params.get("status")),
    license: split(params.get("license")),
  }));

  // Keep the URL shareable without triggering a navigation.
  useEffect(() => {
    const next = new URLSearchParams();
    if (view === "filter") next.set("view", "filter");
    if (view === "filter" && query) next.set("q", query);
    if (view === "filter") {
      for (const [key, values] of Object.entries(filters)) if (values.length) next.set(key, values.join(","));
    }
    const search = next.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
  }, [view, query, filters]);

  return (
    <div>
      <div className="-mx-4 flex flex-wrap items-center gap-3 px-4 py-3 sm:-mx-6 sm:px-6 md:sticky md:top-16 md:z-30 md:bg-background/85 md:backdrop-blur-md">
        <div role="tablist" aria-label={`${labels.browse} / ${labels.filter}`} className="flex w-full rounded-full border bg-muted/60 p-1 sm:w-auto">
          <ViewTab active={view === "browse"} onClick={() => setView("browse")} icon={LayoutGrid}>
            {labels.browse}
          </ViewTab>
          <ViewTab active={view === "filter"} onClick={() => setView("filter")} icon={SlidersHorizontal}>
            {labels.filter}
          </ViewTab>
        </div>
        <span className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
        {view === "browse" ? (
          <CategoryChips categories={categories} />
        ) : (
          <FilterBar
            projects={projects}
            categories={categories}
            statusLabels={statusLabels}
            labels={labels}
            query={query}
            setQuery={setQuery}
            filters={filters}
            setFilters={setFilters}
          />
        )}
      </div>

      {view === "browse" ? (
        <BrowseView projects={projects} categories={categories} labels={labels} />
      ) : (
        <FilterView
          projects={projects}
          labels={labels}
          query={query}
          filters={filters}
          onClear={() => {
            setQuery("");
            setFilters({ category: [], tag: [], status: [], license: [] });
          }}
        />
      )}
    </div>
  );
}

function split(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

function ViewTab({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutGrid;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-1.5 text-sm transition-all sm:flex-none",
        active ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Browse: one section per category; chips follow the scroll.
 * -------------------------------------------------------------------------------------------- */

function CategoryChips({ categories }: { categories: ExplorerProps["categories"] }) {
  const [active, setActive] = useState<Category>(categories[0]?.id);
  const clicked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (clicked.current) return;
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace("cat-", "") as Category);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const c of categories) {
      const el = document.getElementById(`cat-${c.id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [categories]);

  const go = (id: Category) => {
    setActive(id);
    clicked.current = true;
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => (clicked.current = false), 900);
  };

  return (
    <nav aria-label="Categories" className="flex w-full min-w-0 flex-wrap gap-1 sm:w-auto sm:flex-1">
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => go(c.id)}
          aria-current={active === c.id ? "true" : undefined}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm transition-all duration-300",
            active === c.id
              ? "bg-primary font-medium text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          {c.title}
        </button>
      ))}
    </nav>
  );
}

function BrowseView({
  projects,
  categories,
  labels,
}: {
  projects: CardProject[];
  categories: ExplorerProps["categories"];
  labels: CardLabels;
}) {
  return (
    <div className="mt-6 divide-y">
      {categories.map((c) => {
        const items = projects.filter((p) => p.category === c.id);
        if (!items.length) return null;
        const feature = items.find((p) => p.featured) ?? items[0];
        const rest = items.filter((p) => p !== feature);
        const side = rest.slice(0, 3);
        const grid = rest.slice(3);
        return (
          <section key={c.id} id={`cat-${c.id}`} aria-labelledby={`cat-${c.id}-title`} className="scroll-mt-24 py-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 id={`cat-${c.id}-title`} className="text-3xl sm:text-4xl">
              {c.title}
            </h2>
            <p className="mt-2 max-w-2xl font-light text-muted-foreground">{c.description}</p>
            <div className={cn("mt-8 grid gap-10", side.length ? "lg:grid-cols-[7fr_5fr]" : "max-w-3xl")}>
              <FeatureCard project={feature} labels={labels} />
              {side.length > 0 && (
                <div className="flex flex-col gap-8 lg:justify-center">
                  {side.map((p) => (
                    <CompactCard key={p.slug} project={p} labels={labels} />
                  ))}
                </div>
              )}
            </div>
            {grid.length > 0 && (
              <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {grid.map((p) => (
                  <GridCard key={p.slug} project={p} labels={labels} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Filter: search + dropdowns over a uniform grid.
 * -------------------------------------------------------------------------------------------- */

interface FilterBarProps {
  projects: CardProject[];
  categories: ExplorerProps["categories"];
  statusLabels: Record<Status, string>;
  labels: ExplorerLabels;
  query: string;
  setQuery: (q: string) => void;
  filters: Record<FilterKey, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<FilterKey, string[]>>>;
}

function FilterBar({ projects, categories, statusLabels, labels, query, setQuery, filters, setFilters }: FilterBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Focus search on wider screens only; on phones it would pop the keyboard over the results.
  useEffect(() => {
    if (window.matchMedia("(min-width: 640px)").matches) inputRef.current?.focus();
  }, []);

  const options = useMemo(() => {
    const tags = [...new Set(projects.flatMap((p) => p.tags))].sort((a, b) => a.localeCompare(b));
    const licenses = [...new Set(projects.map((p) => p.license ?? NO_LICENSE))];
    const statuses = [...new Set(projects.map((p) => p.status))];
    return {
      category: categories.map((c) => ({ value: c.id as string, label: c.title })),
      tag: tags.map((t) => ({ value: t, label: t })),
      status: statuses.map((s) => ({ value: s as string, label: statusLabels[s] })),
      license: licenses.map((l) => ({ value: l, label: l === NO_LICENSE ? labels.noLicense : l })),
    };
  }, [projects, categories, statusLabels, labels.noLicense]);

  const toggle = useCallback(
    (key: FilterKey, value: string) =>
      setFilters((f) => ({
        ...f,
        [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
      })),
    [setFilters],
  );

  return (
    <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:flex-1">
      <div className="relative w-full sm:w-64">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.search}
          aria-label={labels.search}
          className="rounded-full pl-9"
        />
      </div>
      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
      {(["category", "tag", "status", "license"] as const).map((key) => (
        <FilterMenu
          key={key}
          label={labels[key]}
          options={options[key]}
          selected={filters[key]}
          onToggle={(value) => toggle(key, value)}
        />
      ))}
      </div>
    </div>
  );
}

function FilterMenu({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("w-full justify-between rounded-full sm:w-auto sm:justify-center", selected.length > 0 && "border-primary/50 text-primary")}
        >
          {label}
          {selected.length > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{selected.length}</span>
          )}
          <ChevronDown className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-48">
        {options.map((o) => (
          <DropdownMenuCheckboxItem
            key={o.value}
            checked={selected.includes(o.value)}
            onCheckedChange={() => onToggle(o.value)}
            onSelect={(e) => e.preventDefault()}
          >
            {o.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FilterView({
  projects,
  labels,
  query,
  filters,
  onClear,
}: {
  projects: CardProject[];
  labels: ExplorerLabels;
  query: string;
  filters: Record<FilterKey, string[]>;
  onClear: () => void;
}) {
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (q && ![p.name, p.kind, p.pitch, ...p.tags].join(" ").toLowerCase().includes(q)) return false;
      if (filters.category.length && !filters.category.includes(p.category)) return false;
      if (filters.status.length && !filters.status.includes(p.status)) return false;
      if (filters.license.length && !filters.license.includes(p.license ?? NO_LICENSE)) return false;
      if (filters.tag.length && !filters.tag.some((t) => p.tags.includes(t))) return false;
      return true;
    });
  }, [projects, query, filters]);

  const active = query.trim() !== "" || Object.values(filters).some((v) => v.length);
  const countLabel = (results.length === 1 ? labels.count.one : labels.count.other).replace("{n}", String(results.length));

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p aria-live="polite">{countLabel}</p>
        {active && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="size-3.5" />
            {labels.clear}
          </Button>
        )}
      </div>
      {results.length ? (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => (
            <div key={p.slug} className="animate-in fade-in zoom-in-95 duration-300">
              <GridCard project={p} labels={labels} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState className="py-20">
          <EmptyStateIcon>
            <Search />
          </EmptyStateIcon>
          <EmptyStateTitle>{labels.emptyTitle}</EmptyStateTitle>
          <EmptyStateDescription>{labels.emptyBody}</EmptyStateDescription>
          <Button variant="outline" size="sm" className="mt-4" onClick={onClear}>
            {labels.clear}
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
