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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteRequestBody;

    // Still logged for now as a zero-dependency backstop -- see
    // QUOTE_NOTIFICATION_EMAIL in .env.example if email delivery is added
    // later (e.g. Resend/Nodemailer).
    console.log("New wholesale quote request:", JSON.stringify(body, null, 2));

    await recordOrder({
      channel: "fallback_form",
      customerName: body.customerName,
      businessName: body.businessName,
      contact: body.contact,
      country: body.country,
      city: body.city,
      note: body.otherInfo,
      locale: body.locale || "en",
      items: body.items ?? [],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to process quote request:", err);
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
