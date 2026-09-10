import { createClient } from "@/lib/supabase/server";

export interface AdminAuditEntry {
  id: string;
  admin_user_id: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  table_name: string;
  record_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string;
}

export async function listAdminAuditLog(limit = 100): Promise<AdminAuditEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("admin_audit_log").select("id,admin_user_id,action,table_name,record_id,old_data,new_data,created_at").order("created_at", { ascending: false }).limit(Math.min(Math.max(limit, 1), 200));
  if (error) throw error;
  return (data ?? []) as AdminAuditEntry[];
}

export function auditLabel(tableName: string): string {
  const labels: Record<string, string> = { products: "Product", product_images: "Product image", product_colors: "Product colours", categories: "Category", colors: "Colour", product_reviews: "Product review", faqs: "FAQ", company_settings: "Company information", delivery_content: "Delivery content", homepage_sections: "Homepage section", site_settings: "Website settings", orders: "Order" };
  return labels[tableName] ?? tableName.replaceAll("_", " ");
}

export function changedFields(entry: AdminAuditEntry): string[] {
  if (entry.action === "INSERT") return Object.keys(entry.new_data ?? {}).filter((key) => !["created_at", "updated_at"].includes(key));
  if (entry.action === "DELETE") return Object.keys(entry.old_data ?? {}).filter((key) => !["created_at", "updated_at"].includes(key));
  const oldData = entry.old_data ?? {};
  const newData = entry.new_data ?? {};
  return Object.keys({ ...oldData, ...newData }).filter((key) => !["created_at", "updated_at"].includes(key) && JSON.stringify(oldData[key]) !== JSON.stringify(newData[key]));
}
