"use client";

import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface AssetFormat {
  label: string;
  detail: string;
  href: string;
}

/** Download button for one logo or icon file, with its SVG and PNG sizes in a menu. */
export function AssetDownload({ name, formats, label }: { name: string; formats: AssetFormat[]; label: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${label}: ${name}`}
        title={label}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border bg-background/80 text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Download className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel className="text-xs">{name}</DropdownMenuLabel>
        {formats.map((f) => (
          <DropdownMenuItem key={f.href} asChild>
            <a href={f.href} download className="flex justify-between gap-6">
              <span className="font-bold">{f.label}</span>
              <span className="text-xs font-light text-muted-foreground">{f.detail}</span>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
