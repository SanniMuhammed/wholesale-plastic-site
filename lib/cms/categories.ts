import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/cms/types";

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
