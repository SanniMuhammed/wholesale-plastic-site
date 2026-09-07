import type { NewOrderPayload } from "@/lib/cms/types";

/**
 * Fires a copy of the order to /api/orders right as the customer heads to
 * WhatsApp, purely so it shows up in the admin's Orders log. Deliberately
 * fire-and-forget: this must never delay, block, or be able to fail the
 * actual WhatsApp hand-off, which is the real, load-bearing part of the
 * flow. Call this from the WhatsApp link's onClick -- do not await it and
 * do not call preventDefault on the link.
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
    // Never let order logging get in the way of the customer's WhatsApp flow.
  }
}
