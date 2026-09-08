"use client";

import { useEffect } from "react";

/**
 * The Web Share API can present Android's generic share sheet instead of
 * opening the business WhatsApp chat. For the order hand-off we deliberately
 * disable file sharing so the existing direct wa.me flow remains predictable.
 * The order PDF is downloaded immediately before the WhatsApp hand-off.
 */
export function WhatsAppDirectMode() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("canShare" in navigator)) return;
    const original = navigator.canShare?.bind(navigator);
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: () => false,
    });
    return () => {
      if (!original) return;
      try {
        Object.defineProperty(navigator, "canShare", {
          configurable: true,
          value: original,
        });
      } catch {
        // Some browsers expose canShare as a non-configurable property.
      }
    };
  }, []);

  return null;
}
