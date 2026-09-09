import { createClient } from "@/lib/supabase/server";
import type { Order, OrderStatus, NewOrderPayload } from "@/lib/cms/types";

export async function listOrders(opts?: { status?: OrderStatus }): Promise<Order[]> {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });
  if (opts?.status) query = query.eq("status", opts.status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getOrder(id: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

/** Called from the public order API. Uses a client-generated UUID so the
 * function never needs SELECT access to the newly inserted order. Product
 * names are resolved from the published catalog rather than trusted from
 * browser input. */
export async function recordOrder(payload: NewOrderPayload): Promise<string> {
  const supabase = await createClient();
  const slugs = [...new Set(payload.items.map((item) => item.slug))];

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("slug,name_en,name_fr,capacity")
    .in("slug", slugs)
    .eq("status", "published");

  if (productsError) throw productsError;
  if (!products || products.length !== slugs.length) {
    throw new Error("One or more products are unavailable.");
  }

  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const orderId = crypto.randomUUID();

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    channel: payload.channel,
    customer_name: payload.customerName || null,
    business_name: payload.businessName || null,
    contact: payload.contact || null,
    country: payload.country || null,
    city: payload.city || null,
    note: payload.note || null,
    locale: payload.locale,
  });

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from("order_items").insert(
    payload.items.map((item) => {
      const product = bySlug.get(item.slug);
      if (!product) throw new Error("Product validation failed.");
      return {
        order_id: orderId,
        product_slug: product.slug,
        product_name: payload.locale === "fr" ? product.name_fr : product.name_en,
        capacity: product.capacity || null,
        quantity: item.quantity,
      };
    })
  );

  if (itemsError) throw itemsError;
  return orderId;
}
