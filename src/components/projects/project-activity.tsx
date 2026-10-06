import Image from "next/image";
import { Lock } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getCommitActivity, getContributors, repoFromUrl } from "@/lib/github";
import { ActivityGraph } from "./activity-graph";

/** Commit heatmap and contributor avatars for a project's public GitHub repo. */
export async function ProjectActivity({ github, locale, t }: { github?: string; locale: Locale; t: Dictionary["activity"] }) {
  if (!github) {
    return <p className="flex items-center gap-2 rounded-lg border border-dashed p-5 text-sm font-light text-muted-foreground"><Lock className="size-4 shrink-0" />{t.notPublic}</p>;
  }

  const repo = repoFromUrl(github);
  const [weeks, contributors] = await Promise.all([getCommitActivity(repo), getContributors(repo)]);

  if (!weeks && !contributors) {
    return <p className="rounded-lg border border-dashed p-5 text-sm font-light text-muted-foreground">{t.unavailable}</p>;
  }

  return (
    <div className="space-y-8 rounded-2xl border p-5 sm:p-6">
      {weeks && weeks.length > 0 && (
        <ActivityGraph
          weeks={weeks}
          locale={locale}
          labels={{ less: t.less, more: t.more, day: t.day, total: t.total, recent: t.recent }}
        />
      )}
      {contributors && contributors.length > 0 && (
        <div>
          <h3 className="text-sm font-bold">
            {t.contributors} <span className="font-light text-muted-foreground">({contributors.length})</span>
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {contributors.map((c) => {
              const label = (c.contributions === 1 ? t.commits.one : t.commits.other)
                .replace("{n}", c.contributions.toLocaleString(locale))
                .replace("{login}", c.login);
              return (
                <li key={c.login}>
                  <a href={c.profileUrl} target="_blank" rel="noreferrer" title={label} aria-label={label} className="group block rounded-full">
                    <Image
                      src={`${c.avatarUrl}${c.avatarUrl.includes("?") ? "&" : "?"}s=80`}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 rounded-full border-2 border-background ring-1 ring-border transition-transform group-hover:-translate-y-0.5 group-hover:ring-primary"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
