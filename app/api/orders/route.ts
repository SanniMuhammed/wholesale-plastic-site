import { NextResponse } from "next/server";
import { recordOrder } from "@/lib/cms/orders";
import type { NewOrderPayload } from "@/lib/cms/types";

/**
 * Records a copy of the order for the admin's "Orders" log. This never
 * changes what the customer sees or does -- the WhatsApp link still opens
 * exactly as before; this just fires alongside it (see
 * components/OrderSummaryClient.tsx and components/cart/CartDrawer.tsx)
 * so the site owner has visibility into what went out, since the sale
 * itself is still negotiated and closed in WhatsApp.
 *
 * Uses sendBeacon-friendly semantics: always returns quickly, and a
 * failure here must never block or interrupt the WhatsApp hand-off.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NewOrderPayload;

    if (!body.channel || !Array.isArray(body.items)) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const id = await recordOrder(body);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("Failed to record order:", err);
    // Intentionally 200: the customer-facing flow doesn't depend on this
    // succeeding, and the caller (fire-and-forget) doesn't read the body.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
