import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_NAME = 80;
const MAX_OPTIONAL = 120;
const MAX_REVIEW = 1200;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Quiet honeypot for simple bots. Real visitors never see or fill this field.
    if (clean(body.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    const productId = clean(body.productId, 80);
    const customerName = clean(body.customerName, MAX_NAME);
    const businessName = clean(body.businessName, MAX_OPTIONAL);
    const location = clean(body.location, MAX_OPTIONAL);
    const review = clean(body.review, MAX_REVIEW);
    const rating = Number(body.rating);

    if (!productId || !customerName || customerName.length < 2 || !review || review.length < 10) {
      return NextResponse.json({ error: "Please provide your name and a review of at least 10 characters." }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Please choose a rating from 1 to 5 stars." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .eq("status", "published")
      .maybeSingle();

    if (productError) throw productError;
    if (!product) {
      return NextResponse.json({ error: "This product is not available for reviews." }, { status: 404 });
    }

    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      customer_name: customerName,
      business_name: businessName || null,
      location: location || null,
      rating,
      review_en: review,
      review_fr: review,
      is_published: false,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Product review submission failed", error);
    return NextResponse.json({ error: "We couldn't submit your review. Please try again." }, { status: 500 });
  }
}
