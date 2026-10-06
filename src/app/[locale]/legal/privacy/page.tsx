import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

const UPDATED = "2026-10-05";

const content: Record<Locale, { title: string; updated: string; sections: [string, string][] }> = {
  en: {
    title: "Privacy policy",
    updated: `Last updated ${UPDATED}`,
    sections: [
      [
        "What this covers",
        "This policy covers the scintillar.com website. Each Scintillar tool you install or self-host runs on your own infrastructure and doesn't send data to Scintillar.",
      ],
      [
        "What we collect",
        "Nothing, unless you accept analytics. The site has no accounts, no forms and no newsletter. Your language and theme choices are stored in your own browser.",
      ],
      [
        "Analytics",
        "If you click Accept on the consent notice, the site loads Google Analytics to count visits and see which pages are useful. Google Analytics sets cookies and receives your IP address, browser details and the pages you view, and may process this data outside Québec. If you decline, Google Analytics never loads. You can change your mind by clearing this site's data in your browser; the notice will appear again.",
      ],
      [
        "Hosting",
        "The site is hosted on Vercel, which processes standard request logs (IP address, user agent, requested URL) to serve and protect the site.",
      ],
      [
        "Your rights",
        "You can ask what data concerns you, ask for it to be corrected or deleted, and withdraw consent at any time. To make a request or ask a question, open an issue on the scintillar-com/website repository on GitHub.",
      ],
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    updated: `Dernière mise à jour : ${UPDATED}`,
    sections: [
      [
        "Portée",
        "Cette politique s'applique au site scintillar.com. Chaque outil Scintillar que vous installez ou hébergez vous-même fonctionne sur votre propre infrastructure et n'envoie aucune donnée à Scintillar.",
      ],
      [
        "Ce que nous recueillons",
        "Rien, sauf si vous acceptez les statistiques. Le site n'a ni comptes, ni formulaires, ni infolettre. Vos choix de langue et de thème sont conservés dans votre propre navigateur.",
      ],
      [
        "Statistiques",
        "Si vous cliquez sur Accepter dans l'avis de consentement, le site charge Google Analytics pour compter les visites et voir quelles pages sont utiles. Google Analytics dépose des témoins et reçoit votre adresse IP, des informations sur votre navigateur et les pages consultées, et peut traiter ces données à l'extérieur du Québec. Si vous refusez, Google Analytics n'est jamais chargé. Vous pouvez changer d'avis en effaçant les données de ce site dans votre navigateur; l'avis réapparaîtra.",
      ],
      [
        "Hébergement",
        "Le site est hébergé par Vercel, qui traite les journaux de requêtes habituels (adresse IP, agent utilisateur, URL demandée) pour servir et protéger le site.",
      ],
      [
        "Vos droits",
        "Vous pouvez demander quelles données vous concernent, les faire corriger ou supprimer, et retirer votre consentement en tout temps. Pour faire une demande ou poser une question, ouvrez une issue sur le dépôt scintillar-com/website sur GitHub.",
      ],
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: content[locale].title, alternates: { canonical: `/${locale}/legal/privacy` } };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = content[locale];
  return (
    <div className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-20">
      <h1 className="text-4xl sm:text-5xl">{c.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{c.updated}</p>
      <div className="mt-12 space-y-10">
        {c.sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="text-xl">{title}</h2>
            <p className="mt-3 font-light leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
