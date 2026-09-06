"use client";

import { useEffect } from "react";

// The <html> tag lives in the root layout, above the [locale] segment, so it
// can't read the locale param directly. This keeps `lang` correct for
// accessibility/SEO once we know which locale is active.
export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
