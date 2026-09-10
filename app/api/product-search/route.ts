import { NextResponse } from "next/server";
import { getAllProducts, searchProducts } from "@/lib/catalog/products";
import type { Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const locale = url.searchParams.get("locale") === "fr" ? "fr" : "en";

  if (query.length < 2) return NextResponse.json({ results: [] });

  const products = await getAllProducts();
  const matches = searchProducts(products, query).slice(0, 6);
  const results = matches.map((product) => ({
    slug: product.slug,
    name: product.name[locale as Locale] ?? product.name.en,
    image: product.image,
    category: product.category,
  }));

  return NextResponse.json({ results });
}
