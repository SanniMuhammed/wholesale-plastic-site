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

/** Called from app/api/orders/route.ts (public, unauthenticated) when a
 *  customer completes the WhatsApp hand-off or submits the fallback form.
 *  RLS allows anon inserts on orders/order_items and nothing else, so this
 *  is safe to call without an admin session. */
export async function recordOrder(payload: NewOrderPayload): Promise<string> {
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      channel: payload.channel,
      customer_name: payload.customerName || null,
      business_name: payload.businessName || null,
      contact: payload.contact || null,
      country: payload.country || null,
      city: payload.city || null,
      note: payload.note || null,
      locale: payload.locale,
    })
    .select("id")
    .single();

  if (orderError) throw orderError;

  if (payload.items.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(
      payload.items.map((item) => ({
        order_id: order.id,
        product_slug: item.slug,
        product_name: item.name,
        capacity: item.capacity || null,
        quantity: item.quantity,
      }))
    );
    if (itemsError) throw itemsError;
  }

  return order.id;
}
