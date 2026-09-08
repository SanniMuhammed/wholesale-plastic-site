import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

function getSiteUrl(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!configured) return undefined;
  return configured.startsWith("http") ? configured : `https://${configured}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const base = siteUrl.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({ url: `${base}/${locale}`, changeFrequency: "weekly", priority: 1 });
    entries.push({ url: `${base}/${locale}/products`, changeFrequency: "daily", priority: 0.9 });
    entries.push({ url: `${base}/${locale}/how-it-works`, changeFrequency: "monthly", priority: 0.6 });
  }

  return entries;
}
