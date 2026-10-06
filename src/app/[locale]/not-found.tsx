"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { Button } from "@/components/ui/button";

// not-found pages don't receive params, so the locale comes from the URL.
const copy = {
  en: { title: "Page not found", body: "This page doesn't exist, or it moved.", home: "Back home" },
  fr: { title: "Page introuvable", body: "Cette page n'existe pas ou a été déplacée.", home: "Retour à l'accueil" },
};

export default function NotFound() {
  const first = usePathname().split("/")[1] ?? "";
  const locale = isLocale(first) ? first : defaultLocale;
  const t = copy[locale];
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="mt-6 text-3xl">{t.title}</h1>
      <p className="mt-3 font-light text-muted-foreground">{t.body}</p>
      <Button asChild className="mt-8">
        <Link href={`/${locale}`}>{t.home}</Link>
      </Button>
    </div>
  );
}
