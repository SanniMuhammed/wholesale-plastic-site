import { NextResponse } from "next/server";
import { recordOrder } from "@/lib/cms/orders";

interface QuoteRequestBody {
  customerName?: string;
  businessName?: string;
  otherInfo?: string;
  country?: string;
  city?: string;
  contact?: string;
  locale?: string;
  items?: Array<{ slug: string; name: string; capacity?: string; quantity: number }>;
}

const MAX_ITEMS = 100;
const MAX_TEXT_LENGTH = 500;
const MAX_SLUG_LENGTH = 160;
const MAX_QUANTITY = 1_000_000;

function cleanText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, MAX_TEXT_LENGTH);
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 64 * 1024) {
      return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
    }

    const body = (await request.json()) as QuoteRequestBody;

    if (!body || typeof body !== "object" || !Array.isArray(body.items) || body.items.length > MAX_ITEMS) {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    if (body.locale !== undefined && body.locale !== "en" && body.locale !== "fr") {
      return NextResponse.json({ ok: false, error: "Invalid locale" }, { status: 400 });
    }

    const items = body.items
      .filter(
        (item) =>
          item &&
          typeof item.slug === "string" &&
          item.slug.trim().length > 0 &&
          item.slug.length <= MAX_SLUG_LENGTH &&
          typeof item.name === "string" &&
          item.name.trim().length > 0 &&
          Number.isInteger(item.quantity) &&
          item.quantity >= 1 &&
          item.quantity <= MAX_QUANTITY
      )
      .map((item) => ({
        slug: item.slug.trim().slice(0, MAX_SLUG_LENGTH),
        name: item.name.trim().slice(0, MAX_TEXT_LENGTH),
        capacity: cleanText(item.capacity),
        quantity: item.quantity,
      }));

    if (items.length === 0 || items.length !== body.items.length) {
      return NextResponse.json({ ok: false, error: "Invalid product items" }, { status: 400 });
    }

    await recordOrder({
      channel: "fallback_form",
      customerName: cleanText(body.customerName),
      businessName: cleanText(body.businessName),
      contact: cleanText(body.contact),
      country: cleanText(body.country),
      city: cleanText(body.city),
      note: cleanText(body.otherInfo),
      locale: body.locale || "en",
      items,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Failed to process quote request:", err);
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
