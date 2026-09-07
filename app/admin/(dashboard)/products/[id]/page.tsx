import { notFound } from "next/navigation";
import { getProduct } from "@/lib/cms/products";
import { listCategories } from "@/lib/cms/categories";
import { listColors } from "@/lib/cms/colors";
import { PageHeader } from "@/components/admin/AdminUI";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImageManager } from "@/components/admin/ProductImageManager";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, colors] = await Promise.all([
    getProduct(id),
    listCategories(),
    listColors(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <PageHeader title={product.name_en} description={`/${product.slug}`} />
      <div className="grid gap-6">
        <ProductImageManager productId={product.id} images={product.images ?? []} />
        <ProductForm categories={categories} colors={colors} product={product} />
      </div>
    </div>
  );
}
