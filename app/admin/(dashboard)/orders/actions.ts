"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "@/lib/cms/orders";
import type { OrderStatus } from "@/lib/cms/types";

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  await updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
