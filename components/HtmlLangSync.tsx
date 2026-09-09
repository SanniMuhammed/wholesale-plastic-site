"use client";

import { useEffect } from "react";

// The root layout cannot read the locale segment, so sync it here.
export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
