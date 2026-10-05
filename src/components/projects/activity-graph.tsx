"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Sequential single-hue ramp for commit counts (validated with the dataviz ordinal checks).
 * Light ends on the brand primary; dark has its own steps against the dark surface.
 */
const LEVELS = [
  "bg-muted",
  "bg-[#59c5a1] dark:bg-[#1a4d3b]",
  "bg-[#1fa077] dark:bg-[#2a7e62]",
  "bg-[#00754e] dark:bg-[#40bf95]",
  "bg-[#005c3d] dark:bg-[#85e0c2]",
];

export interface ActivityGraphLabels {
  less: string;
  more: string;
  /** "{n} commits on {date}" */
  day: { one: string; other: string };
  /** "{n} commits in the last year" */
  total: { one: string; other: string };
}

interface ActivityGraphProps {
  weeks: { week: number; days: number[] }[];
  locale: string;
  labels: ActivityGraphLabels;
}

function plural(t: { one: string; other: string }, n: number) {
  return (n === 1 ? t.one : t.other).replace("{n}", n.toLocaleString());
}

/** GitHub-style contribution heatmap: one column per week, one cell per day. */
export function ActivityGraph({ weeks, locale, labels }: ActivityGraphProps) {
  const [hover, setHover] = useState<{ text: string; x: number; y: number } | null>(null);

  const max = Math.max(1, ...weeks.flatMap((w) => w.days));
  const total = weeks.reduce((sum, w) => sum + w.days.reduce((a, b) => a + b, 0), 0);
  // Quartile buckets relative to the busiest day, so quiet repos still show texture.
  const level = (n: number) => (n === 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4)));

  const dateFmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const monthFmt = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
  const dayDate = (week: number, i: number) => new Date((week + i * 86400) * 1000);

  // Month label above the first week that starts in a new month.
  const months = weeks.map((w, i) => {
    const m = new Date(w.week * 1000).getUTCMonth();
    const prev = i > 0 ? new Date(weeks[i - 1].week * 1000).getUTCMonth() : -1;
    return m !== prev && i < weeks.length - 2 ? monthFmt.format(new Date(w.week * 1000)) : "";
  });

  return (
    <figure className="relative">
      {/* Columns share the available width, so the whole year fits on any screen without scrolling. */}
      <div onPointerLeave={() => setHover(null)}>
        <div
          className="grid grid-flow-col gap-[2px] sm:gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`, gridTemplateRows: "auto repeat(7, auto)" }}
        >
          {weeks.map((w, wi) => (
            <div key={w.week} className="contents">
              <span className="h-4 overflow-visible whitespace-nowrap text-[9px] leading-none text-muted-foreground sm:text-[10px]" aria-hidden="true">
                {months[wi]}
              </span>
              {w.days.map((n, di) => {
                const text = plural(labels.day, n).replace("{date}", dateFmt.format(dayDate(w.week, di)));
                return (
                  <span
                    key={di}
                    role="img"
                    aria-label={text}
                    tabIndex={-1}
                    onPointerEnter={(e) => {
                      const box = (e.currentTarget.closest("figure") as HTMLElement).getBoundingClientRect();
                      const cell = e.currentTarget.getBoundingClientRect();
                      // Keep the tooltip inside the figure so it never widens the page.
                      const x = Math.min(Math.max(cell.left - box.left + cell.width / 2, 90), box.width - 90);
                      setHover({ text, x, y: cell.top - box.top });
                    }}
                    className={cn(
                      "aspect-square w-full rounded-[2px] outline-offset-1 transition-[outline-color] hover:outline hover:outline-2 hover:outline-foreground/60",
                      LEVELS[level(n)],
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {hover && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md"
          style={{ left: hover.x, top: hover.y - 6 }}
        >
          {hover.text}
        </div>
      )}

      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{plural(labels.total, total)}</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          {labels.less}
          {LEVELS.map((c) => (
            <span key={c} className={cn("size-[11px] rounded-[2px]", c)} />
          ))}
          {labels.more}
        </span>
      </figcaption>
    </figure>
  );
}
