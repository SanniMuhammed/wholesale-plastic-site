"use server";

import { revalidatePath } from "next/cache";
import {
  updateCompanySettings,
  updateDeliveryContent,
  updateWholesaleContent,
  updateHomepageSection,
} from "@/lib/cms/settings";
import type { CompanySettings, DeliveryContent, WholesaleContent, HomepageSection } from "@/lib/cms/types";

export async function updateCompanySettingsAction(input: Partial<CompanySettings>) {
  const settings = await updateCompanySettings(input);
  revalidatePath("/admin/content/company");
  return settings;
}

export async function updateDeliveryContentAction(input: Partial<DeliveryContent>) {
  const content = await updateDeliveryContent(input);
  revalidatePath("/admin/content/delivery");
  return content;
}

export async function updateWholesaleContentAction(input: Partial<WholesaleContent>) {
  const content = await updateWholesaleContent(input);
  revalidatePath("/admin/content/wholesale");
  return content;
}

export async function updateHomepageSectionAction(
  id: string,
  input: Partial<Omit<HomepageSection, "id" | "key">>
) {
  const section = await updateHomepageSection(id, input);
  revalidatePath("/admin/content/homepage");
  return section;
}
