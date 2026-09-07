const CATEGORY_IMAGES_BUCKET = "product-images";

export function buildCategoryImageUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${CATEGORY_IMAGES_BUCKET}/${storagePath}`;
}
