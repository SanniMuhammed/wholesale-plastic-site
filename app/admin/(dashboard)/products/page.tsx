import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { listProducts } from "@/lib/cms/products";
import { buildProductImageUrl } from "@/lib/cms/productImages";
import { PageHeader } from "@/components/admin/AdminUI";
import { ProductRowActions } from "./ProductRowActions";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${products.length} product${products.length === 1 ? "" : "s"}`}
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded bg-brand px-4 py-2.5 text-sm font-medium text-surface hover:bg-brand-dark"
          >
            <Plus size={16} /> Add product
          </Link>
        }
      />

      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
          No products yet. Add your first one to get started.
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {products.map((product) => {
            const mainImage = product.images?.find((i) => i.is_main) || product.images?.[0];
            return (
              <li key={product.id} className="flex items-center gap-3 p-3 sm:p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded bg-background">
                  {mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={buildProductImageUrl(mainImage.storage_path)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Star size={18} className="text-border" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="truncate text-sm font-medium text-ink hover:underline"
                  >
                    {product.name_en}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {product.category?.name_en || "Uncategorized"}
                    {product.capacity ? ` \u00b7 ${product.capacity}` : ""}
                  </p>
                </div>

                <span
                  className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-block ${
                    product.status === "published"
                      ? "bg-brand-light text-brand-dark"
                      : "bg-border text-ink-soft"
                  }`}
                >
                  {product.status}
                </span>

                <ProductRowActions product={product} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
