import type { Locale } from "@/lib/i18n/config";
import en from "@/lib/i18n/en.json";
import fr from "@/lib/i18n/fr.json";

const dictionaries = { en, fr };

export type Dictionary = typeof en;

// Dictionaries are bundled JSON, so this can stay synchronous.
// If dictionaries grow large, switch to dynamic import() per locale.
export function getDictionary(locale: Locale): Dictionary {
  return (dictionaries[locale] ?? dictionaries.en) as Dictionary;
}
