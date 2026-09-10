"use server";
import { revalidatePath } from "next/cache";
import { updateOrderStatus, updateOrderWorkflow } from "@/lib/cms/orders";
import type { OrderStatus, PaymentStatus, DeliveryStatus } from "@/lib/cms/types";
export async function updateOrderStatusAction(id:string,status:OrderStatus){await updateOrderStatus(id,status);revalidatePath("/admin/orders");revalidatePath(`/admin/orders/${id}`)}
export async function updateOrderWorkflowAction(id:string,input:{internal_note?:string|null;quote_amount?:number|null;quote_currency?:string;payment_status?:PaymentStatus;delivery_status?:DeliveryStatus;payment_note?:string|null;delivery_note?:string|null;assigned_to?:string|null}){await updateOrderWorkflow(id,input);revalidatePath("/admin/orders");revalidatePath(`/admin/orders/${id}`)}
