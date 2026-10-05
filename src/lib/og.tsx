import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** The standalone mark for the dark theme, as a data URI for ImageResponse. */
export async function markDataUri() {
  const svg = await readFile(join(process.cwd(), "public/brand/scintillar-logo-standalone-dark.svg"), "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** JetBrains Mono for ImageResponse; falls back to the default font if Google Fonts is unreachable. */
export async function monoFont(weight: 400 | 700, text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@${weight}&text=${encodeURIComponent(text)}`,
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return null;
    const data = await fetch(url).then((r) => r.arrayBuffer());
    return { name: "JetBrains Mono", data, weight, style: "normal" as const };
  } catch {
    return null;
  }
}

export const BRAND = { bg: "#020e0a", primary: "#40bf95", fg: "#f4f4f4", muted: "#bfe0d4" };
