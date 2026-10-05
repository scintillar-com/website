import { ImageResponse } from "next/og";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { BRAND, markDataUri, monoFont } from "@/lib/og";

export const alt = "Scintillar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "en");
  const title = t.home.title;
  const eyebrow = "scintillar.com";
  const fonts = (await Promise.all([monoFont(700, `Scintillar${title}`), monoFont(400, eyebrow)])).filter(
    (f): f is NonNullable<typeof f> => f !== null,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `radial-gradient(circle at 15% 0%, rgba(64,191,149,0.28), transparent 55%), ${BRAND.bg}`,
          color: BRAND.fg,
          fontFamily: "JetBrains Mono",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={await markDataUri()} width={104} height={80} alt="" />
          <span style={{ fontSize: 44, fontWeight: 700 }}>Scintillar</span>
        </div>
        <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>{title}</div>
        <div style={{ fontSize: 26, color: BRAND.primary }}>{eyebrow}</div>
      </div>
    ),
    { ...size, fonts },
  );
}
