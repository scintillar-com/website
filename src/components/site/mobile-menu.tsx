"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GithubIcon } from "./github-icon";
import { LocaleSwitcher } from "./nav-client";
import { ThemeToggle } from "./theme";

interface MobileMenuProps {
  locale: Locale;
  githubHref: string;
  links: { href: string; label: string }[];
  t: { menu: string; github: string; language: string; theme: string };
}

/** Hamburger menu shown below the md breakpoint, where the full navbar doesn't fit. */
export function MobileMenu({ locale, githubHref, links, t }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t.menu} className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-72 flex-col gap-0 p-0">
        <SheetTitle className="border-b px-6 py-5 text-sm uppercase tracking-widest text-muted-foreground">{t.menu}</SheetTitle>
        <nav className="flex flex-col p-3">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-3 text-lg transition-colors",
                  active ? "bg-accent font-bold text-accent-foreground" : "hover:bg-accent/60",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={githubHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-3 text-lg transition-colors hover:bg-accent/60"
          >
            <GithubIcon className="size-5" />
            {t.github}
          </a>
        </nav>
        <div className="mt-auto flex items-center justify-between border-t px-6 py-4">
          <LocaleSwitcher current={locale} label={t.language} />
          <ThemeToggle label={t.theme} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
