import type { NewOrderPayload } from "@/lib/cms/types";

/**
 * Logs the order without holding up the customer's move to WhatsApp.
 * Keep this fire-and-forget; the WhatsApp flow should work even if logging fails.
 */
export function recordOrderOnWhatsAppClick(payload: NewOrderPayload) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/orders", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/orders", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Logging is best-effort.
  }
}
