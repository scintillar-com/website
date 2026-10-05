import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Logo } from "./logo";
import { LocaleSwitcher, NavLink } from "./nav-client";
import { ThemeToggle } from "./theme";
import { GithubIcon } from "./github-icon";
import { GITHUB_ORG } from "@/lib/site";

export function Navbar({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {t.nav.skip}
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link href={`/${locale}`} aria-label="Scintillar" className="mr-2 shrink-0">
          <Logo variant="horizontal" className="hidden w-[132px] sm:inline-flex" />
          <Logo variant="standalone" className="w-9 sm:hidden" />
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink href={`/${locale}/projects`}>{t.nav.projects}</NavLink>
          <NavLink href={`/${locale}/about`}>{t.nav.about}</NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <a
            href={GITHUB_ORG}
            target="_blank"
            rel="noreferrer"
            aria-label={t.nav.github}
            title={t.nav.github}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <GithubIcon className="size-4" />
          </a>
          <LocaleSwitcher current={locale} label={t.nav.language} />
          <ThemeToggle label={t.nav.theme} />
        </div>
      </div>
    </header>
  );
}
