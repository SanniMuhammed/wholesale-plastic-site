import { createClient } from "@/lib/supabase/server";
import type { Color } from "@/lib/cms/types";

export async function listColors(opts?: { activeOnly?: boolean }): Promise<Color[]> {
  const supabase = await createClient();
  let query = supabase.from("colors").select("*").order("sort_order", { ascending: true });
  if (opts?.activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createColor(input: Omit<Color, "id">): Promise<Color> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("colors").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateColor(id: string, input: Partial<Omit<Color, "id">>): Promise<Color> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("colors").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteColor(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("colors").delete().eq("id", id);
  if (error) throw error;
}
