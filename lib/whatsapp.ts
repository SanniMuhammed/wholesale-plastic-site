import type { Dictionary } from "@/lib/getDictionary";
import { interpolate } from "@/lib/utils";

export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
}

export function buildWhatsAppLink(message: string): string {
  const number = getWhatsAppNumber();
  const text = encodeURIComponent(message);
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

export interface OrderLineForMessage { name: string; quantity: number; }

export interface OrderInquiryParams {
  items: OrderLineForMessage[];
  customerName?: string;
  businessName?: string;
  country?: string;
  city?: string;
  deliveryPreference?: string;
  note?: string;
}

/** Builds the human-readable order message shared with WhatsApp and the PDF flow. */
export function buildOrderMessage(dict: Dictionary, params: OrderInquiryParams): string {
  const isFrench = dict.locale === "fr";
  const labels = isFrench
    ? { name: "Nom", business: "Entreprise", destination: "Destination", country: "Pays", city: "Ville", delivery: "Livraison", order: "Commande", qty: "Qté", note: "Note" }
    : { name: "Name", business: "Business", destination: "Destination", country: "Country", city: "City", delivery: "Delivery preference", order: "Order", qty: "Qty", note: "Note" };
  const lines: string[] = [dict.whatsapp.general, ""];

  if (params.customerName) lines.push(`${labels.name}: ${params.customerName}`);
  if (params.businessName) lines.push(`${labels.business}: ${params.businessName}`);
  if (params.country || params.city) {
    lines.push("", `${labels.destination}:`);
    if (params.country) lines.push(`- ${labels.country}: ${params.country}`);
    if (params.city) lines.push(`- ${labels.city}: ${params.city}`);
  }
  if (params.deliveryPreference) lines.push(`${labels.delivery}: ${params.deliveryPreference}`);

  if (params.items.length > 0) {
    lines.push("", `${labels.order}:`);
    for (const item of params.items) lines.push(`- ${item.name} (${labels.qty}: ${item.quantity.toLocaleString()})`);
  }
  if (params.note) lines.push("", `${labels.note}: ${params.note}`);

  return lines.join("\n");
}

/** Builds the WhatsApp deep link for an order. */
export function orderInquiryLink(dict: Dictionary, params: OrderInquiryParams): string {
  return buildWhatsAppLink(buildOrderMessage(dict, params));
}
