const PRODUCT_IMAGES_BUCKET = "product-images";

/**
 * Builds the public URL for a stored product photo.
 * Local public paths are returned as-is. Remote catalogue photos are routed
 * through our own image proxy so hosts that block hotlinking do not leave
 * blank product cards in the browser.
 */
export function buildProductImageUrl(storagePath: string): string {
  if (storagePath.startsWith("/")) {
    return storagePath;
  }

  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return `/api/product-image?url=${encodeURIComponent(storagePath)}`;
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${storagePath}`;
}
