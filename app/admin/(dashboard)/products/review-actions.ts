"use server";

import { createClient } from "@/lib/supabase/server";

function validateReview(input: { customerName: string; businessName?: string; location?: string; rating: number; reviewEn: string; reviewFr: string }) {
  if (input.customerName.trim().length < 2 || input.customerName.trim().length > 200) throw new Error("Customer name must be between 2 and 200 characters.");
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) throw new Error("Rating must be between 1 and 5.");
  if (input.reviewEn.trim().length < 10 || input.reviewEn.trim().length > 2000) throw new Error("English review must be between 10 and 2,000 characters.");
  if (input.reviewFr.trim().length < 10 || input.reviewFr.trim().length > 2000) throw new Error("French review must be between 10 and 2,000 characters.");
  if ((input.businessName?.trim().length ?? 0) > 200) throw new Error("Business name is too long.");
  if ((input.location?.trim().length ?? 0) > 200) throw new Error("Location is too long.");
}

export async function createProductReviewAction(input: { productId: string; customerName: string; businessName?: string; location?: string; rating: number; reviewEn: string; reviewFr: string; published: boolean }) {
  validateReview(input);
  const supabase = await createClient();
  const { data, error } = await supabase.from("product_reviews").insert({ product_id: input.productId, customer_name: input.customerName.trim(), business_name: input.businessName?.trim() || null, location: input.location?.trim() || null, rating: input.rating, review_en: input.reviewEn.trim(), review_fr: input.reviewFr.trim(), is_published: input.published }).select().single();
  if (error) throw error;
  return data;
}

export async function updateProductReviewAction(id: string, input: { customerName: string; businessName?: string; location?: string; rating: number; reviewEn: string; reviewFr: string; published: boolean }) {
  validateReview(input);
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
