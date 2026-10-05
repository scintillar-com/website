import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { projects } from "@/content/projects";
import { GITHUB_ORG } from "@/lib/site";
import { GithubIcon } from "./github-icon";

/** Solid primary block whose top corners curve up into the page, as on the original site. */
export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const available = projects.filter((p) => p.status === "available");
  return (
    <footer className="relative mt-24">
      <Arc className="left-0" />
      <Arc className="right-0 -scale-x-100" />
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="text-lg font-bold">Scintillar</p>
            <p className="mt-3 text-sm font-light opacity-90">{t.footer.tagline}</p>
            <a
              href={GITHUB_ORG}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
            >
              <GithubIcon className="size-4" /> github.com/scintillar-com
            </a>
          </div>
          <FooterColumn title={t.footer.explore}>
            <FooterLink href={`/${locale}/projects`}>{t.nav.projects}</FooterLink>
            {available.map((p) => (
              <FooterLink key={p.slug} href={`/${locale}/projects/${p.slug}`}>
                {p.name}
              </FooterLink>
            ))}
            <FooterLink href={`/${locale}/about`}>{t.nav.about}</FooterLink>
          </FooterColumn>
          <FooterColumn title={t.footer.legal}>
            <FooterLink href={`/${locale}/legal/privacy`}>{t.footer.privacy}</FooterLink>
          </FooterColumn>
        </div>
        <div className="mx-auto max-w-6xl border-t border-primary-foreground/20 px-4 py-6 text-xs font-light opacity-80 sm:px-6">
          © {new Date().getFullYear()} {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}

function Arc({ className }: { className: string }) {
  // Quarter circle in the primary color, with the page background cut out of it.
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className={`absolute -top-8 size-8 fill-primary ${className}`}
    >
      <path d="M0 0v32h32A32 32 0 0 1 0 0Z" />
    </svg>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest opacity-80">{title}</p>
      <ul className="mt-4 space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="font-light underline-offset-4 hover:underline">
        {children}
      </Link>
    </li>
  );
}
