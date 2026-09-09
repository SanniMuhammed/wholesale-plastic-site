"use server";

import { revalidatePath } from "next/cache";
import {
  updateCompanySettings,
  updateDeliveryContent,
  updateWholesaleContent,
  updateHomepageSection,
  uploadHomepageHeroImage,
  uploadHomepageMobileHeroImage,
  removeHomepageHeroImage,
  removeHomepageMobileHeroImage,
  uploadHomepageFinalCtaImage,
  removeFinalCtaImage,
  uploadHomepageSectionImage,
  removeHomepageSectionImage,
  uploadDeliveryImage,
  removeDeliveryImage,
} from "@/lib/cms/settings";
import type { CompanySettings, DeliveryContent, WholesaleContent, HomepageSection } from "@/lib/cms/types";

export async function updateCompanySettingsAction(input: Partial<CompanySettings>) { const settings = await updateCompanySettings(input); revalidatePath("/admin/content/company"); return settings; }
export async function updateDeliveryContentAction(input: Partial<DeliveryContent>) { const content = await updateDeliveryContent(input); revalidatePath("/admin/content/delivery"); revalidatePath("/[locale]/delivery", "page"); return content; }
export async function updateWholesaleContentAction(input: Partial<WholesaleContent>) { const content = await updateWholesaleContent(input); revalidatePath("/admin/content/wholesale"); return content; }

export async function updateHomepageSectionAction(id: string, input: Partial<Omit<HomepageSection, "id" | "key">>) {
  const section = await updateHomepageSection(id, input);
  revalidatePath("/admin/content/homepage");
  revalidatePath("/[locale]", "page");
  return section;
}

export async function uploadHomepageSectionImageAction(formData: FormData) {
  const file = formData.get("file") as File | null;
  const sectionId = String(formData.get("sectionId") || "");
  const slot = formData.get("slot");
  if (!file) throw new Error("No file provided");
  if (!sectionId) throw new Error("Missing homepage section");
  if (slot !== "desktop" && slot !== "mobile") throw new Error("Invalid image slot");
  const section = await uploadHomepageSectionImage(file, sectionId, slot);
  revalidatePath("/admin/content/homepage"); revalidatePath("/[locale]", "page");
  return section;
}

export async function removeHomepageSectionImageAction(sectionId: string, slot: "desktop" | "mobile" = "desktop") {
  if (!sectionId) throw new Error("Missing homepage section");
  const section = await removeHomepageSectionImage(sectionId, slot);
  revalidatePath("/admin/content/homepage"); revalidatePath("/[locale]", "page");
  return section;
}

export async function uploadHomepageHeroImageAction(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");
  const section = await uploadHomepageHeroImage(file);
  revalidatePath("/admin/content/homepage"); revalidatePath("/[locale]", "page");
  return section;
}

export async function uploadHomepageMobileHeroImageAction(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");
  const section = await uploadHomepageMobileHeroImage(file);
  revalidatePath("/admin/content/homepage"); revalidatePath("/[locale]", "page");
  return section;
}

export async function removeHomepageHeroImageAction() {
  const section = await removeHomepageHeroImage();
  revalidatePath("/admin/content/homepage"); revalidatePath("/[locale]", "page");
  return section;
}

export async function removeHomepageMobileHeroImageAction() {
  const section = await removeHomepageMobileHeroImage();
  revalidatePath("/admin/content/homepage"); revalidatePath("/[locale]", "page");
  return section;
}

export async function uploadHomepageFinalCtaImageAction(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");
  const section = await uploadHomepageFinalCtaImage(file);
  revalidatePath("/admin/content/homepage"); revalidatePath("/[locale]", "page");
  return section;
}

export async function removeHomepageFinalCtaImageAction() {
  const section = await removeFinalCtaImage();
  revalidatePath("/admin/content/homepage"); revalidatePath("/[locale]", "page");
  return section;
}

const DELIVERY_IMAGE_SLOTS = ["hero", "nigeria", "truck", "step_1", "step_2", "step_3", "step_4", "step_5"] as const;
type DeliveryImageSlot = (typeof DELIVERY_IMAGE_SLOTS)[number];

export async function uploadDeliveryImageAction(formData: FormData) {
  const file = formData.get("file") as File | null;
  const slot = formData.get("slot");
  if (!file) throw new Error("No file provided");
  if (!DELIVERY_IMAGE_SLOTS.includes(slot as DeliveryImageSlot)) throw new Error("Invalid delivery image slot");
  const content = await uploadDeliveryImage(file, slot as DeliveryImageSlot);
  revalidatePath("/admin/content/delivery"); revalidatePath("/[locale]/delivery", "page");
  return content;
}

export async function removeDeliveryImageAction(slot: DeliveryImageSlot) {
  if (!DELIVERY_IMAGE_SLOTS.includes(slot)) throw new Error("Invalid delivery image slot");
  const content = await removeDeliveryImage(slot);
  revalidatePath("/admin/content/delivery"); revalidatePath("/[locale]/delivery", "page");
  return content;
}
