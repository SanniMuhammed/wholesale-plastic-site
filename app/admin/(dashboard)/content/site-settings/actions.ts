"use server";
import { revalidatePath } from "next/cache";
import { updateSiteSettings } from "@/lib/cms/site-settings";
import type { SiteSettings } from "@/lib/cms/site-settings";
export async function updateSiteSettingsAction(input: Partial<SiteSettings>) {
  const result = await updateSiteSettings(input);
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]", "page");
  revalidatePath("/admin/content/site-settings");
  return result;
}
