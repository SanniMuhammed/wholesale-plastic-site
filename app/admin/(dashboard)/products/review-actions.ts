"use server";

import { createClient } from "@/lib/supabase/server";

export async function createProductReviewAction(input: { productId: string; customerName: string; businessName?: string; location?: string; rating: number; reviewEn: string; reviewFr: string; published: boolean }) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("product_reviews").insert({ product_id: input.productId, customer_name: input.customerName.trim(), business_name: input.businessName?.trim() || null, location: input.location?.trim() || null, rating: input.rating, review_en: input.reviewEn.trim(), review_fr: input.reviewFr.trim(), is_published: input.published }).select().single();
  if (error) throw error;
  return data;
}

export async function updateProductReviewAction(id: string, input: { customerName: string; businessName?: string; location?: string; rating: number; reviewEn: string; reviewFr: string; published: boolean }) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("product_reviews").update({ customer_name: input.customerName.trim(), business_name: input.businessName?.trim() || null, location: input.location?.trim() || null, rating: input.rating, review_en: input.reviewEn.trim(), review_fr: input.reviewFr.trim(), is_published: input.published }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProductReviewAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("product_reviews").delete().eq("id", id);
  if (error) throw error;
}
