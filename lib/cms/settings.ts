import { createClient } from "@/lib/supabase/server";
import type { CompanySettings, DeliveryContent, WholesaleContent, HomepageSection } from "@/lib/cms/types";

const HOMEPAGE_IMAGES_BUCKET = "product-images";
const FINAL_CTA_FALLBACK_IMAGE = "/images/sherinab-truck-cta.webp";

export function buildHomepageImageUrl(storagePath: string): string {
  if (storagePath.startsWith("/") || storagePath.startsWith("http://") || storagePath.startsWith("https://")) return storagePath;
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
  if (oldPath && !oldPath.startsWith("/")) await supabase.storage.from(HOMEPAGE_IMAGES_BUCKET).remove([oldPath]);
  return updateHomepageSection(existing.id, slot === "desktop" ? { hero_image_path: storagePath } : { hero_mobile_image_path: storagePath });
}

export function uploadHomepageHeroImage(file: File) { return uploadHeroImage(file, "desktop"); }
export function uploadHomepageMobileHeroImage(file: File) { return uploadHeroImage(file, "mobile"); }

async function removeHeroImage(slot: "desktop" | "mobile"): Promise<HomepageSection> {
  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase.from("homepage_sections").select("*").eq("key", "hero").single();
  if (existingError) throw existingError;
  const path = slot === "desktop" ? existing.hero_image_path : existing.hero_mobile_image_path;
  if (path && !path.startsWith("/")) await supabase.storage.from(HOMEPAGE_IMAGES_BUCKET).remove([path]);
  return updateHomepageSection(existing.id, slot === "desktop" ? { hero_image_path: null } : { hero_mobile_image_path: null });
}

export function removeHomepageHeroImage() { return removeHeroImage("desktop"); }
export function removeHomepageMobileHeroImage() { return removeHeroImage("mobile"); }

async function uploadFinalCtaImage(file: File): Promise<HomepageSection> {
  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase.from("homepage_sections").select("*").eq("key", "final_cta").single();
  if (existingError) throw existingError;
  const extension = file.name.split(".").pop() || "jpg";
  const storagePath = `homepage/final-cta/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(HOMEPAGE_IMAGES_BUCKET).upload(storagePath, file, { contentType: file.type });
  if (uploadError) throw uploadError;
  if (existing.hero_image_path && !existing.hero_image_path.startsWith("/")) await supabase.storage.from(HOMEPAGE_IMAGES_BUCKET).remove([existing.hero_image_path]);
  return updateHomepageSection(existing.id, { hero_image_path: storagePath });
}

export async function removeFinalCtaImage(): Promise<HomepageSection> {
  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase.from("homepage_sections").select("*").eq("key", "final_cta").single();
  if (existingError) throw existingError;
  if (existing.hero_image_path && !existing.hero_image_path.startsWith("/")) await supabase.storage.from(HOMEPAGE_IMAGES_BUCKET).remove([existing.hero_image_path]);
  return updateHomepageSection(existing.id, { hero_image_path: null });
}

export function uploadHomepageFinalCtaImage(file: File) { return uploadFinalCtaImage(file); }

export async function getHomepageFinalCtaImageUrl(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("homepage_sections").select("hero_image_path").eq("key", "final_cta").single();
    return data?.hero_image_path ? buildHomepageImageUrl(data.hero_image_path) : FINAL_CTA_FALLBACK_IMAGE;
  } catch { return FINAL_CTA_FALLBACK_IMAGE; }
}

export async function getHomepageHeroImages(): Promise<{ desktop: string | null; mobile: string | null }> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("homepage_sections").select("hero_image_path, hero_mobile_image_path").eq("key", "hero").single();
    return { desktop: data?.hero_image_path ? buildHomepageImageUrl(data.hero_image_path) : null, mobile: data?.hero_mobile_image_path ? buildHomepageImageUrl(data.hero_mobile_image_path) : null };
  } catch { return { desktop: null, mobile: null }; }
}

export async function getHomepageHeroImageUrl(): Promise<string | null> {
  const images = await getHomepageHeroImages();
  return images.desktop;
}

const DELIVERY_FALLBACKS = {
  hero: "https://images.unsplash.com/photo-1779517225996-d5b751f80f48?auto=format&fit=crop&fm=jpg&q=82&w=1800",
  nigeria: "https://images.unsplash.com/photo-1713859272775-2e1cf7d777a1?auto=format&fit=crop&fm=jpg&q=82&w=1400",
  truck: "https://images.unsplash.com/photo-1620455800201-7f00aeef12ed?auto=format&fit=crop&fm=jpg&q=82&w=1400",
} as const;

export function buildDeliveryImageUrl(storagePath: string): string {
  return buildHomepageImageUrl(storagePath);
}

export async function getDeliveryImages(): Promise<{ hero: string; nigeria: string; truck: string; steps: Array<string | null> }> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("delivery_content").select("hero_image_path, nigeria_image_path, truck_image_path, step_1_image_path, step_2_image_path, step_3_image_path, step_4_image_path, step_5_image_path").eq("id", 1).single();
    return {
      hero: data?.hero_image_path ? buildDeliveryImageUrl(data.hero_image_path) : DELIVERY_FALLBACKS.hero,
      nigeria: data?.nigeria_image_path ? buildDeliveryImageUrl(data.nigeria_image_path) : DELIVERY_FALLBACKS.nigeria,
      truck: data?.truck_image_path ? buildDeliveryImageUrl(data.truck_image_path) : DELIVERY_FALLBACKS.truck,
      steps: [1, 2, 3, 4, 5].map((n) => {
        const path = data?.[`step_${n}_image_path`];
        return path ? buildDeliveryImageUrl(path) : null;
      }),
    };
  } catch {
    return { ...DELIVERY_FALLBACKS, steps: [null, null, null, null, null] };
  }
}

type DeliveryImageSlot = "hero" | "nigeria" | "truck" | "step_1" | "step_2" | "step_3" | "step_4" | "step_5";

export async function uploadDeliveryImage(file: File, slot: DeliveryImageSlot): Promise<DeliveryContent> {
  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase.from("delivery_content").select("*").eq("id", 1).single();
  if (existingError) throw existingError;
  const extension = file.name.split(".").pop() || "jpg";
  const storagePath = `delivery/${slot}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(HOMEPAGE_IMAGES_BUCKET).upload(storagePath, file, { contentType: file.type });
  if (uploadError) throw uploadError;
  const column = `${slot}_image_path` as keyof DeliveryContent;
  const oldPath = existing[column];
  if (typeof oldPath === "string" && oldPath && !oldPath.startsWith("/") && !oldPath.startsWith("http://") && !oldPath.startsWith("https://")) await supabase.storage.from(HOMEPAGE_IMAGES_BUCKET).remove([oldPath]);
  return updateDeliveryContent({ [column]: storagePath });
}

export async function removeDeliveryImage(slot: DeliveryImageSlot): Promise<DeliveryContent> {
  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase.from("delivery_content").select("*").eq("id", 1).single();
  if (existingError) throw existingError;
  const column = `${slot}_image_path` as keyof DeliveryContent;
  const path = existing[column];
  if (typeof path === "string" && path && !path.startsWith("/") && !path.startsWith("http://") && !path.startsWith("https://")) await supabase.storage.from(HOMEPAGE_IMAGES_BUCKET).remove([path]);
  return updateDeliveryContent({ [column]: null });
}
