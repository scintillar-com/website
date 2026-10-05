import type { CoverKind } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * Cover art for a project: a small mock of the product's UI drawn with plain markup,
 * so covers stay crisp, themeable and light without screenshots.
 */
export function ProjectCover({
  kind,
  size = "md",
  className,
}: {
  kind: CoverKind;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "cover relative isolate flex items-center justify-center overflow-hidden rounded-xl border bg-[radial-gradient(120%_90%_at_10%_0%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%),linear-gradient(160deg,color-mix(in_oklab,var(--primary)_14%,var(--card)),var(--card))]",
        size === "sm" ? "aspect-[4/3] text-[6px]" : size === "lg" ? "aspect-[16/10] text-[11px] sm:text-[13px]" : "aspect-[16/10] text-[9px]",
        className,
      )}
    >
      <Grid />
      <div className="relative w-[78%] transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03]">
        {covers[kind]}
      </div>
    </div>
  );
}

function Grid() {
  return (
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--primary)_10%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--primary)_10%,transparent)_1px,transparent_1px)] bg-[size:2em_2em] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
  );
}

function Window({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[0.8em] border bg-background/95 shadow-xl shadow-primary/10", className)}>
      <div className="flex items-center gap-[0.5em] border-b px-[1em] py-[0.6em]">
        <span className="size-[0.7em] rounded-full bg-primary/70" />
        <span className="size-[0.7em] rounded-full bg-primary/40" />
        <span className="size-[0.7em] rounded-full bg-primary/20" />
        <span className="ml-[0.6em] truncate text-muted-foreground">{title}</span>
      </div>
      <div className="p-[1em]">{children}</div>
    </div>
  );
}

const Bar = ({ w, className }: { w: string; className?: string }) => (
  <span className={cn("block h-[0.6em] rounded-full bg-muted-foreground/25", className)} style={{ width: w }} />
);

const covers: Record<CoverKind, React.ReactNode> = {
  docs: (
    <Window title="docs / getting-started.mdx">
      <div className="flex gap-[1em]">
        <div className="w-[28%] space-y-[0.7em] border-r pr-[0.8em]">
          <span className="block rounded-[0.3em] bg-primary/15 px-[0.4em] py-[0.2em] font-bold text-primary">v2.8</span>
          {["Intro", "Install", "Config", "Theming"].map((x, i) => (
            <span key={x} className={cn("block truncate", i === 1 ? "font-bold text-primary" : "text-muted-foreground")}>
              {x}
            </span>
          ))}
        </div>
        <div className="flex-1 space-y-[0.7em]">
          <span className="block text-[1.5em] font-bold">Install</span>
          <Bar w="92%" />
          <Bar w="70%" />
          <span className="block rounded-[0.4em] bg-foreground px-[0.6em] py-[0.5em] text-background">$ npx registry-shell init</span>
          <Bar w="80%" />
        </div>
      </div>
    </Window>
  ),
  components: (
    <div className="grid grid-cols-2 gap-[0.8em]">
      <Window title="button" className="col-span-2">
        <div className="flex flex-wrap gap-[0.5em]">
          <span className="rounded-[0.4em] bg-primary px-[0.9em] py-[0.4em] font-bold text-primary-foreground">Primary</span>
          <span className="rounded-[0.4em] border px-[0.9em] py-[0.4em]">Outline</span>
          <span className="rounded-[0.4em] px-[0.9em] py-[0.4em] text-muted-foreground">Ghost</span>
        </div>
      </Window>
      <div className="rounded-[0.8em] border bg-background/95 p-[0.9em] shadow-lg">
        <span className="mb-[0.5em] block text-muted-foreground">Email</span>
        <span className="block rounded-[0.4em] border px-[0.6em] py-[0.4em]">ada@lovelace.dev</span>
      </div>
      <div className="flex items-center justify-between rounded-[0.8em] border bg-background/95 p-[0.9em] shadow-lg">
        <span>Live cursors</span>
        <span className="flex h-[1.4em] w-[2.4em] items-center justify-end rounded-full bg-primary p-[0.2em]">
          <span className="size-[1em] rounded-full bg-primary-foreground" />
        </span>
      </div>
    </div>
  ),
  tokens: (
    <Window title="tokens.json · conflict check">
      <div className="space-y-[0.6em]">
        {[
          ["color.surface.raised", "ok"],
          ["color.text.on-primary", "ok"],
          ["space.inset.card", "conflict"],
          ["radius.control", "ok"],
        ].map(([name, state]) => (
          <div key={name} className="flex items-center justify-between gap-[0.6em]">
            <span className="truncate">{name}</span>
            <span
              className={cn(
                "shrink-0 rounded-full px-[0.6em] py-[0.1em] font-bold",
                state === "ok" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive",
              )}
            >
              {state === "ok" ? "✓" : "0.94 → escalate"}
            </span>
          </div>
        ))}
      </div>
    </Window>
  ),
  brand: (
    <div className="flex items-end gap-[0.8em]">
      <Window title="brand-kit/" className="flex-1">
        <div className="space-y-[0.45em]">
          {["assets/", "fonts/", "logos/", "prints/", "guide.pdf", "estimate.csv"].map((x, i) => (
            <span key={x} className={cn("block", i > 3 ? "text-primary" : "text-muted-foreground")}>
              {i > 3 ? "▸ " : "▾ "}
              {x}
            </span>
          ))}
        </div>
      </Window>
      <div className="w-[38%] space-y-[0.5em] rounded-[0.8em] border bg-background/95 p-[0.9em] shadow-lg">
        <div className="flex gap-[0.4em]">
          <span className="size-[1.8em] rounded-[0.4em] bg-primary" />
          <span className="size-[1.8em] rounded-[0.4em] bg-primary/50" />
          <span className="size-[1.8em] rounded-[0.4em] bg-foreground" />
        </div>
        <span className="block text-[1.8em] font-bold leading-none">Aa</span>
        <Bar w="80%" />
      </div>
    </div>
  ),
  upvotes: (
    <Window title="feedback / my-product">
      <div className="space-y-[0.6em]">
        {[
          ["Dark mode for the editor", 128, true],
          ["Export to CSV", 87, false],
          ["SSO with Google", 54, false],
        ].map(([label, votes, active]) => (
          <div key={label as string} className="flex items-center gap-[0.7em] rounded-[0.5em] border p-[0.5em]">
            <span
              className={cn(
                "flex w-[3.2em] shrink-0 flex-col items-center rounded-[0.4em] py-[0.2em] font-bold",
                active ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              <span>▲</span>
              {votes as number}
            </span>
            <span className="truncate">{label as string}</span>
          </div>
        ))}
      </div>
    </Window>
  ),
  tickets: (
    <Window title="support · inbox">
      <div className="space-y-[0.55em]">
        {[
          ["#1042", "Can't reset password", "GitHub"],
          ["#1041", "Invoice in French?", "Notion"],
          ["#1040", "Webhook retries", "Inbox"],
        ].map(([id, subject, dest]) => (
          <div key={id} className="flex items-center gap-[0.6em]">
            <span className="text-muted-foreground">{id}</span>
            <span className="flex-1 truncate">{subject}</span>
            <span className="shrink-0 rounded-full border border-primary/40 px-[0.6em] text-primary">→ {dest}</span>
          </div>
        ))}
      </div>
    </Window>
  ),
  uptime: (
    <Window title="status.example.com">
      <div className="mb-[0.8em] flex items-center gap-[0.5em] font-bold">
        <span className="size-[0.8em] animate-pulse rounded-full bg-primary" />
        All systems operational
      </div>
      {["API", "Dashboard", "Webhooks"].map((name, row) => (
        <div key={name} className="mb-[0.5em] flex items-center gap-[0.6em]">
          <span className="w-[5.5em] shrink-0 text-muted-foreground">{name}</span>
          <div className="flex flex-1 gap-[0.15em]">
            {Array.from({ length: 30 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-[1.6em] flex-1 rounded-[0.15em]",
                  row === 1 && i === 21 ? "bg-destructive/70" : row === 2 && i === 9 ? "bg-primary/40" : "bg-primary",
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </Window>
  ),
  network: (
    <svg viewBox="0 0 200 120" className="w-full drop-shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_40%,transparent)]">
      <g stroke="var(--primary)" strokeOpacity="0.55" strokeWidth="1">
        <path d="M20 90 L60 40 L110 60 L150 20 L185 55 M60 40 L70 100 L130 95 L110 60 M130 95 L185 55" fill="none" />
      </g>
      {[
        [20, 90],
        [60, 40],
        [110, 60],
        [150, 20],
        [185, 55],
        [70, 100],
        [130, 95],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 2 ? 6 : 4} fill={i === 2 ? "var(--destructive)" : "var(--primary)"} />
      ))}
      <text x="116" y="52" fontSize="8" fill="var(--foreground)" fontFamily="inherit">
        root@node-3
      </text>
    </svg>
  ),
};
