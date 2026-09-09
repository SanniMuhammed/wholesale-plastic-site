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
} from "@/lib/cms/settings";
import type { CompanySettings, DeliveryContent, WholesaleContent, HomepageSection } from "@/lib/cms/types";

export async function updateCompanySettingsAction(input: Partial<CompanySettings>) { const settings = await updateCompanySettings(input); revalidatePath("/admin/content/company"); return settings; }
export async function updateDeliveryContentAction(input: Partial<DeliveryContent>) { const content = await updateDeliveryContent(input); revalidatePath("/admin/content/delivery"); return content; }
export async function updateWholesaleContentAction(input: Partial<WholesaleContent>) { const content = await updateWholesaleContent(input); revalidatePath("/admin/content/wholesale"); return content; }

export async function updateHomepageSectionAction(id: string, input: Partial<Omit<HomepageSection, "id" | "key">>) {
  const section = await updateHomepageSection(id, input);
  revalidatePath("/admin/content/homepage");
  revalidatePath("/[locale]", "page");
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
