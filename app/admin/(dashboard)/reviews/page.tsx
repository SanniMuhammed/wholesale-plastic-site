import { MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminUI";
import { ReviewApprovalList } from "@/components/admin/ReviewApprovalList";
import { listAllProductReviews } from "@/lib/cms/reviews";
import { listProducts } from "@/lib/cms/products";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const [reviews, products] = await Promise.all([listAllProductReviews(), listProducts()]);
  const productNames = new Map(products.map((product) => [product.id, product.name_en]));
  const reviewsWithProducts = reviews.map((review) => ({ ...review, productName: productNames.get(review.product_id) ?? "Unknown product" }));
  const pending = reviewsWithProducts.filter((review) => !review.is_published).length;

  return (
    <div>
      <PageHeader title="Reviews" description={pending ? `${pending} review${pending === 1 ? "" : "s"} waiting for approval` : "Manage customer reviews"} />
      {reviewsWithProducts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface p-10 text-center">
          <MessageSquare size={22} className="mx-auto text-muted" />
          <p className="mt-3 text-sm font-medium text-ink">No customer reviews yet</p>
          <p className="mt-1 text-xs text-muted">New reviews submitted from product pages will appear here.</p>
        </div>
      ) : (
        <ReviewApprovalList reviews={reviewsWithProducts} />
      )}
    </div>
  );
}
