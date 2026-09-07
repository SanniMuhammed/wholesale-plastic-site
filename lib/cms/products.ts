import { createClient } from "@/lib/supabase/server";
import type { Product, ProductInput, ProductImage, Color } from "@/lib/cms/types";

const PRODUCT_IMAGES_BUCKET = "product-images";

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  images:product_images(*),
  colors:product_colors(color:colors(*))
`;

/** Flattens the `colors:product_colors(color:colors(*))` join shape into a
 *  plain Color[], and sorts images by their sort_order. Supabase returns
 *  nested joins as-is; this is just normalizing the shape for callers. */
function normalizeProduct(row: any): Product {
  return {
    ...row,
    images: (row.images ?? []).sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order),
    colors: (row.colors ?? []).map((c: any) => c.color).filter(Boolean) as Color[],
  };
}

export async function listProducts(opts?: { status?: "draft" | "published" }): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (opts?.status) query = query.eq("status", opts.status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(normalizeProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? normalizeProduct(data) : null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").insert(input).select(PRODUCT_SELECT).single();
  if (error) throw error;
  return normalizeProduct(data);
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select(PRODUCT_SELECT)
    .single();
  if (error) throw error;
  return normalizeProduct(data);
}

/** Hard delete -- removes the row and every stored photo. Prefer
 *  updateProduct(id, { status: "draft" }) (unpublish) for the common case;
 *  this is for when the owner explicitly wants the product gone for good. */
export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: images } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", id);

  if (images && images.length > 0) {
    await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove(images.map((i) => i.storage_path));
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function setProductColors(productId: string, colorIds: string[]): Promise<void> {
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("product_colors")
    .delete()
    .eq("product_id", productId);
  if (deleteError) throw deleteError;

  if (colorIds.length === 0) return;

  const { error: insertError } = await supabase
    .from("product_colors")
    .insert(colorIds.map((color_id) => ({ product_id: productId, color_id })));
  if (insertError) throw insertError;
}

/** Uploads a photo and attaches it to the product. If this is the
 *  product's first photo, it's automatically set as the main image. */
export async function addProductImage(
  productId: string,
  file: File
): Promise<ProductImage> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);
  const isFirstImage = (count ?? 0) === 0;

  const extension = file.name.split(".").pop() || "jpg";
  const storagePath = `${productId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(storagePath, file, { contentType: file.type });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      storage_path: storagePath,
      sort_order: count ?? 0,
      is_main: isFirstImage,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function setMainProductImage(productId: string, imageId: string): Promise<void> {
  const supabase = await createClient();
  // Unique index (one main per product) means the old main must be
  // cleared before the new one can be set.
  const { error: clearError } = await supabase
    .from("product_images")
    .update({ is_main: false })
    .eq("product_id", productId);
  if (clearError) throw clearError;

  const { error } = await supabase
    .from("product_images")
    .update({ is_main: true })
    .eq("id", imageId);
  if (error) throw error;
}

export async function reorderProductImages(
  orderedImageIds: string[]
): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    orderedImageIds.map((id, index) =>
      supabase.from("product_images").update({ sort_order: index }).eq("id", id)
    )
  );
}

export async function deleteProductImage(imageId: string): Promise<void> {
  const supabase = await createClient();
  const { data: image, error: fetchError } = await supabase
    .from("product_images")
    .select("storage_path, product_id, is_main")
    .eq("id", imageId)
    .single();
  if (fetchError) throw fetchError;

  await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([image.storage_path]);

  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) throw error;

  // If that was the main image, promote whichever photo is now first.
  if (image.is_main) {
    const { data: remaining } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", image.product_id)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (remaining) {
      await supabase.from("product_images").update({ is_main: true }).eq("id", remaining.id);
    }
  }
}
