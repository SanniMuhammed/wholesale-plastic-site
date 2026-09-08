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

function cleanText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, MAX_TEXT_LENGTH);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteRequestBody;

    if (!body || typeof body !== "object" || !Array.isArray(body.items) || body.items.length > MAX_ITEMS) {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    const items = body.items
      .filter((item) => item && typeof item.slug === "string" && typeof item.name === "string")
      .map((item) => ({
        slug: item.slug.trim().slice(0, 160),
        name: item.name.trim().slice(0, MAX_TEXT_LENGTH),
        capacity: cleanText(item.capacity),
        quantity: Number.isInteger(item.quantity) ? Math.max(1, Math.min(item.quantity, 1_000_000)) : 1,
      }))
      .filter((item) => item.slug && item.name);

    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: "At least one product is required" }, { status: 400 });
    }

    await recordOrder({
      channel: "fallback_form",
      customerName: cleanText(body.customerName),
      businessName: cleanText(body.businessName),
      contact: cleanText(body.contact),
      country: cleanText(body.country),
      city: cleanText(body.city),
      note: cleanText(body.otherInfo),
      locale: body.locale === "fr" ? "fr" : "en",
      items,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Failed to process quote request:", err);
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
