import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ThemeProvider } from "@/components/site/theme";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Analytics } from "@/components/site/analytics";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: "%s · Scintillar" },
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: { siteName: "Scintillar", type: "website", locale: locale === "fr" ? "fr_CA" : "en_CA" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f4f3" },
    { media: "(prefers-color-scheme: dark)", color: "#020e0a" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const gaId = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID : undefined;

  return (
    <html lang={locale} suppressHydrationWarning className={mono.variable}>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <Navbar locale={locale} t={t} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={locale} t={t} />
          <Analytics gaId={gaId} privacyHref={`/${locale}/legal/privacy`} t={t.consent} />
        </ThemeProvider>
      </body>
    </html>
  );
}
