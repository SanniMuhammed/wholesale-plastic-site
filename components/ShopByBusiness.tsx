import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import type { HomepageSection } from "@/lib/cms/types";

export function ShopByBusiness({ locale, dict, section, imageUrl, mobileImageUrl }: { locale: Locale; dict: Dictionary; section?: HomepageSection; imageUrl?: string | null; mobileImageUrl?: string | null }) {
  void locale;
  void dict;
  void imageUrl;
  void mobileImageUrl;
  if (section?.is_visible === false) return null;
  return null;
}
