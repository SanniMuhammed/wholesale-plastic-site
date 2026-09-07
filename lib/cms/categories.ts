import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/cms/types";

const CATEGORY_IMAGES_BUCKET = "product-images";

export function buildCategoryImageUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${CATEGORY_IMAGES_BUCKET}/${storagePath}`;
}

export async function listCategories(opts?: { activeOnly?: boolean }): Promise<Category[]> {
  const supabase = await createClient();
  let query = supabase.from("categories").select("*").order("sort_order", { ascending: true });
  if (opts?.activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createCategory(input: Omit<Category, "id">): Promise<Category> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, input: Partial<Omit<Category, "id">>): Promise<Category> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Categories in use by a product can't be safely deleted (products.category_id
 *  would dangle to null); hiding via is_active is the normal path. This is
 *  for once a category has no products left. */
export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

/** Replaces the category's cover photo (deleting the old one, if any) and
 *  stores it under categories/{id}/... in the same bucket products use. */
export async function uploadCategoryImage(categoryId: string, file: File): Promise<Category> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("categories")
    .select("cover_image_path")
    .eq("id", categoryId)
    .single();

  const extension = file.name.split(".").pop() || "jpg";
  const storagePath = `categories/${categoryId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(CATEGORY_IMAGES_BUCKET)
    .upload(storagePath, file, { contentType: file.type });
  if (uploadError) throw uploadError;

  if (existing?.cover_image_path) {
    await supabase.storage.from(CATEGORY_IMAGES_BUCKET).remove([existing.cover_image_path]);
  }

  return updateCategory(categoryId, { cover_image_path: storagePath });
}

export async function removeCategoryImage(categoryId: string): Promise<Category> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("categories")
    .select("cover_image_path")
    .eq("id", categoryId)
    .single();

  if (existing?.cover_image_path) {
    await supabase.storage.from(CATEGORY_IMAGES_BUCKET).remove([existing.cover_image_path]);
  }

  return updateCategory(categoryId, { cover_image_path: null });
}

/** Public, failure-safe lookup used by the homepage: slug -> photo URL, for
 *  whichever categories have one set. Never throws -- if the database isn't
 *  reachable for any reason, the caller just gets an empty map and falls
 *  back to the illustration, exactly as if no photos had been uploaded. */
export async function getCategoryCoverImageMap(): Promise<Record<string, string>> {
  try {
    const categories = await listCategories({ activeOnly: true });
    const map: Record<string, string> = {};
    for (const category of categories) {
      if (category.cover_image_path) {
        map[category.slug] = buildCategoryImageUrl(category.cover_image_path);
      }
    }
    return map;
  } catch {
    return {};
  }
}
