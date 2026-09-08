import { notFound } from "next/navigation";
import { getProduct } from "@/lib/cms/products";
import { listAllProductReviews } from "@/lib/cms/reviews";
import { listCategories } from "@/lib/cms/categories";
import { listColors } from "@/lib/cms/colors";
import { PageHeader } from "@/components/admin/AdminUI";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImageManager } from "@/components/admin/ProductImageManager";
import { ProductPricingManager } from "@/components/admin/ProductPricingManager";
import { ProductReviewManager } from "@/components/admin/ProductReviewManager";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, colors, allReviews] = await Promise.all([
    getProduct(id), listCategories(), listColors(), listAllProductReviews(),
  ]);
  if (!product) notFound();
  const reviews = allReviews.filter((review) => review.product_id === product.id);

  return (
    <div>
      <PageHeader title={product.name_en} description={`/${product.slug}`} />
      <div className="grid gap-6">
        <ProductImageManager productId={product.id} images={product.images ?? []} />
        <ProductPricingManager product={product} />
        <ProductForm categories={categories} colors={colors} product={product} />
        <ProductReviewManager productId={product.id} reviews={reviews} />
      </div>
    </div>
  );
}
