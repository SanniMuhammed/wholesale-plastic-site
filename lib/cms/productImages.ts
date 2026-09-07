const PRODUCT_IMAGES_BUCKET = "product-images";

/**
 * Builds the public URL for a stored product photo.
 * This helper is intentionally independent of the server-only Supabase client
 * so it can safely be used by Client Components.
 */
export function buildProductImageUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${storagePath}`;
}
