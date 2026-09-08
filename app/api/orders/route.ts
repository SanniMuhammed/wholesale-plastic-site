import { NextResponse } from "next/server";
import { recordOrder } from "@/lib/cms/orders";
import type { NewOrderPayload } from "@/lib/cms/types";

const MAX_ITEMS = 100;
const MAX_TEXT_LENGTH = 500;
const MAX_SLUG_LENGTH = 160;
const MAX_QUANTITY = 1_000_000;
const ALLOWED_CHANNELS = new Set<NewOrderPayload["channel"]>(["whatsapp", "fallback_form"]);

function cleanText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, MAX_TEXT_LENGTH) : undefined;
}

function isValidItems(value: unknown): value is NewOrderPayload["items"] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= MAX_ITEMS &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.slug === "string" &&
        item.slug.trim().length > 0 &&
        item.slug.length <= MAX_SLUG_LENGTH &&
        typeof item.name === "string" &&
        item.name.trim().length > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= MAX_QUANTITY
    )
  );
}

function parsePayload(value: unknown): NewOrderPayload | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Partial<NewOrderPayload>;

  if (!ALLOWED_CHANNELS.has(body.channel as NewOrderPayload["channel"])) return null;
  if (!isValidItems(body.items)) return null;
  if (body.locale !== "en" && body.locale !== "fr") return null;

  return {
    channel: body.channel as NewOrderPayload["channel"],
    customerName: cleanText(body.customerName),
    businessName: cleanText(body.businessName),
    contact: cleanText(body.contact),
    country: cleanText(body.country),
    city: cleanText(body.city),
    note: cleanText(body.note),
    locale: body.locale,
    items: body.items.map((item) => ({
      slug: item.slug.trim().slice(0, MAX_SLUG_LENGTH),
      name: item.name.trim().slice(0, MAX_TEXT_LENGTH),
      capacity: cleanText(item.capacity),
      quantity: item.quantity,
    })),
  };
}

/**
 * Records a copy of the order for the admin's "Orders" log. This never
 * changes what the customer sees or does -- the WhatsApp link still opens
 * exactly as before; this just fires alongside it.
 */
export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 64 * 1024) {
      return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
    }

    const body = parsePayload(await request.json());
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const id = await recordOrder(body);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("Failed to record order:", err);
    // Logging is intentionally best-effort and must never block WhatsApp.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
