import type { Dictionary } from "@/lib/getDictionary";
import { interpolate } from "@/lib/utils";

export function getWhatsAppNumber(): string {
  // TODO: set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local -- see .env.example.
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
}

export function buildWhatsAppLink(message: string): string {
  const number = getWhatsAppNumber();
  const text = encodeURIComponent(message);
  // wa.me works with or without a number; omitting it just opens the picker.
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function generalInquiryLink(dict: Dictionary): string {
  return buildWhatsAppLink(dict.whatsapp.general);
}

export function productInquiryLink(
  dict: Dictionary,
  params: { product: string; quantity: string | number; city?: string; country?: string }
): string {
  const message = interpolate(dict.whatsapp.productInquiry, {
    product: params.product,
    quantity: params.quantity,
    city: params.city || "—",
    country: params.country || "—",
  });
  return buildWhatsAppLink(message);
}

export interface OrderLineForMessage {
  name: string;
  quantity: number;
}

/**
 * Builds the WhatsApp deep link for the order-summary page. The customer
 * builds and reviews their order on the site, then this pre-fills a
 * WhatsApp message with everything a rep needs to pick up the
 * conversation -- identity, business, order lines, and any free-form note
 * -- with no fields required to unlock it.
 */
export function orderInquiryLink(
  dict: Dictionary,
  params: {
    items: OrderLineForMessage[];
    customerName?: string;
    businessName?: string;
    note?: string;
  }
): string {
  const lines: string[] = [dict.whatsapp.general, ""];

  if (params.customerName) lines.push(`${dict.whatsapp.nameLabel}: ${params.customerName}`);
  if (params.businessName) lines.push(`${dict.whatsapp.businessLabel}: ${params.businessName}`);

  if (params.items.length > 0) {
    lines.push("", `${dict.whatsapp.orderLabel}:`);
    for (const item of params.items) {
      lines.push(`- ${item.name} (${dict.whatsapp.quantityLabel}: ${item.quantity})`);
    }
  }

  if (params.note) lines.push("", `${dict.whatsapp.noteLabel}: ${params.note}`);

  return buildWhatsAppLink(lines.join("\n"));
}
