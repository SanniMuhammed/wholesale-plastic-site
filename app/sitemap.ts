import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getAllProducts } from "@/lib/catalog/products";

function getSiteUrl(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!configured) return undefined;
  return configured.startsWith("http") ? configured : `https://${configured}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const base = siteUrl.replace(/\/$/, "");
  const products = await getAllProducts();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({ url: `${base}/${locale}`, changeFrequency: "weekly", priority: 1 });
    entries.push({ url: `${base}/${locale}/products`, changeFrequency: "daily", priority: 0.9 });
    entries.push({ url: `${base}/${locale}/how-it-works`, changeFrequency: "monthly", priority: 0.6 });

    for (const product of products) {
      entries.push({
        url: `${base}/${locale}/products/${encodeURIComponent(product.slug)}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
