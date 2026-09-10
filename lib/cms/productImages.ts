const PRODUCT_IMAGES_BUCKET = "product-images";

/**
 * Builds the public URL for a stored product photo.
 * Local public paths and approved external photo URLs are also supported so
 * product catalogue data can use real product photography without requiring
 * every image to be uploaded into Supabase Storage first.
 */
export function buildProductImageUrl(storagePath: string): string {
  if (storagePath.startsWith("/") || storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return storagePath;
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${storagePath}`;
}
