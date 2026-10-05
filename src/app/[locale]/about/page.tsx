import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { GITHUB_ORG } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.nav.about, description: t.about.lead, alternates: { canonical: `/${locale}/about` } };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-20">
      <h1 className="text-5xl sm:text-6xl">{t.about.title}</h1>
      <p className="mt-6 text-xl font-light text-primary">{t.about.lead}</p>

      <section className="mt-14">
        <h2 className="text-2xl">{t.about.mission}</h2>
        <p className="mt-4 text-lg font-light leading-relaxed">{t.home.lead}</p>
      </section>

      <section className="mt-14 grid gap-10 sm:grid-cols-2">
        <List title={t.home.isTitle} items={t.home.is} positive />
        <List title={t.home.isntTitle} items={t.home.isnt} />
      </section>

      <section className="mt-14">
        <h2 className="text-2xl">{t.about.contribute}</h2>
        <p className="mt-4 font-light leading-relaxed">{t.about.contributeBody}</p>
        <a href={GITHUB_ORG} className="mt-4 inline-block text-primary underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
          github.com/scintillar-com
        </a>
      </section>
    </div>
  );
}

function List({ title, items, positive }: { title: string; items: string[][]; positive?: boolean }) {
  const Icon = positive ? Check : X;
  return (
    <div>
      <h2 className="text-xl">{title}</h2>
      <ul className="mt-5 space-y-4">
        {items.map(([head, body]) => (
          <li key={head} className="flex gap-3">
            <Icon className={`mt-1 size-4 shrink-0 ${positive ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
            <div>
              <p className="font-bold">{head}</p>
              <p className="mt-1 text-sm font-light text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
