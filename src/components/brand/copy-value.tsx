"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small button that copies a value (a hex code, a snippet) and confirms it. */
export function CopyValue({
  value,
  labels,
  children,
  className,
}: {
  value: string;
  labels: { copy: string; copied: string };
  children?: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const label = copied ? labels.copied : labels.copy;
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      aria-label={`${label}: ${value}`}
      title={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md text-xs transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      {children ?? <span className="font-bold">{value}</span>}
      {copied ? <Check className="size-3.5 shrink-0" aria-hidden="true" /> : <Copy className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />}
    </button>
  );
}
