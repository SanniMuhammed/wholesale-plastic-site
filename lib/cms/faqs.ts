import { createClient } from "@/lib/supabase/server";
import type { Faq } from "@/lib/cms/types";

export async function listFaqs(opts?: { publishedOnly?: boolean }): Promise<Faq[]> {
  const supabase = await createClient();
  let query = supabase.from("faqs").select("*").order("sort_order", { ascending: true });
  if (opts?.publishedOnly) query = query.eq("is_published", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createFaq(input: Omit<Faq, "id">): Promise<Faq> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faqs").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateFaq(id: string, input: Partial<Omit<Faq, "id">>): Promise<Faq> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faqs").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteFaq(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderFaqs(orderedIds: string[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) => supabase.from("faqs").update({ sort_order: index }).eq("id", id))
  );
}
