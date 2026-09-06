import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // TODO: this only logs the request right now. Before launch, wire this
    // up to real delivery -- e.g. email via Resend/Nodemailer to
    // process.env.QUOTE_NOTIFICATION_EMAIL, or write it to a database/CRM.
    console.log("New wholesale quote request:", JSON.stringify(body, null, 2));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
