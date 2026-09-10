import { NextResponse } from "next/server";
import { searchPublishedProducts } from "@/lib/cms/products";
import { buildProductImageUrl } from "@/lib/cms/productImages";
import type { Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const locale: Locale = url.searchParams.get("locale") === "fr" ? "fr" : "en";

  if (query.length < 2) return NextResponse.json({ results: [] });

  const matches = await searchPublishedProducts(query);
  const results = matches.map((product) => ({
    slug: product.slug,
    name: locale === "fr" ? product.name_fr || product.name_en : product.name_en,
    image: product.image_path ? buildProductImageUrl(product.image_path) : undefined,
    category: product.category_slug,
  }));

  return NextResponse.json(
    { results },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
      },
    },
  );
}
