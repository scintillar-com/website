import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { projects } from "@/content/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/tools", "/about", "/brand", "/legal/privacy", ...projects.map((p) => `/tools/${p.slug}`)];
  return paths.map((path) => ({
    url: `${SITE_URL}/en${path}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
  }));
}
