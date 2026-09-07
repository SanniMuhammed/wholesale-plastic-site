import { createClient } from "@/lib/supabase/server";
import type { CompanySettings, DeliveryContent, WholesaleContent, HomepageSection } from "@/lib/cms/types";

const HOMEPAGE_IMAGES_BUCKET = "product-images";

export function buildHomepageImageUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${HOMEPAGE_IMAGES_BUCKET}/${storagePath}`;
}

export async function getCompanySettings(): Promise<CompanySettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("company_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}

export async function updateCompanySettings(input: Partial<CompanySettings>): Promise<CompanySettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("company_settings").update(input).eq("id", 1).select().single();
  if (error) throw error;
  return data;
}

export async function getDeliveryContent(): Promise<DeliveryContent> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("delivery_content").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}

export async function updateDeliveryContent(input: Partial<DeliveryContent>): Promise<DeliveryContent> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("delivery_content").update(input).eq("id", 1).select().single();
  if (error) throw error;
  return data;
}

export async function getWholesaleContent(): Promise<WholesaleContent> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("wholesale_content").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}

export async function updateWholesaleContent(input: Partial<WholesaleContent>): Promise<WholesaleContent> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("wholesale_content").update(input).eq("id", 1).select().single();
  if (error) throw error;
  return data;
}

export async function listHomepageSections(): Promise<HomepageSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("homepage_sections").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function updateHomepageSection(id: string, input: Partial<Omit<HomepageSection, "id" | "key">>): Promise<HomepageSection> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("homepage_sections").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

async function uploadHeroImage(file: File, slot: "desktop" | "mobile"): Promise<HomepageSection> {
  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase.from("homepage_sections").select("*").eq("key", "hero").single();
  if (existingError) throw existingError;

  const extension = file.name.split(".").pop() || "jpg";
  const storagePath = `homepage/hero/${slot}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(HOMEPAGE_IMAGES_BUCKET).upload(storagePath, file, { contentType: file.type });
  if (uploadError) throw uploadError;

  const oldPath = slot === "desktop" ? existing.hero_image_path : existing.hero_mobile_image_path;
  if (oldPath) await supabase.storage.from(HOMEPAGE_IMAGES_BUCKET).remove([oldPath]);

  return updateHomepageSection(existing.id, slot === "desktop" ? { hero_image_path: storagePath } : { hero_mobile_image_path: storagePath });
}

export function uploadHomepageHeroImage(file: File) {
  return uploadHeroImage(file, "desktop");
}

export function uploadHomepageMobileHeroImage(file: File) {
  return uploadHeroImage(file, "mobile");
}

async function removeHeroImage(slot: "desktop" | "mobile"): Promise<HomepageSection> {
  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase.from("homepage_sections").select("*").eq("key", "hero").single();
  if (existingError) throw existingError;

  const path = slot === "desktop" ? existing.hero_image_path : existing.hero_mobile_image_path;
  if (path) await supabase.storage.from(HOMEPAGE_IMAGES_BUCKET).remove([path]);

  return updateHomepageSection(existing.id, slot === "desktop" ? { hero_image_path: null } : { hero_mobile_image_path: null });
}

export function removeHomepageHeroImage() {
  return removeHeroImage("desktop");
}

export function removeHomepageMobileHeroImage() {
  return removeHeroImage("mobile");
}

export async function getHomepageHeroImages(): Promise<{ desktop: string | null; mobile: string | null }> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("homepage_sections").select("hero_image_path, hero_mobile_image_path").eq("key", "hero").single();
    return {
      desktop: data?.hero_image_path ? buildHomepageImageUrl(data.hero_image_path) : null,
      mobile: data?.hero_mobile_image_path ? buildHomepageImageUrl(data.hero_mobile_image_path) : null,
    };
  } catch {
    return { desktop: null, mobile: null };
  }
}

export async function getHomepageHeroImageUrl(): Promise<string | null> {
  const images = await getHomepageHeroImages();
  return images.desktop;
}
