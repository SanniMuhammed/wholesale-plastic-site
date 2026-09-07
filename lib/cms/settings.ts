import { createClient } from "@/lib/supabase/server";
import type {
  CompanySettings,
  DeliveryContent,
  WholesaleContent,
  HomepageSection,
} from "@/lib/cms/types";

export async function getCompanySettings(): Promise<CompanySettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("company_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}

export async function updateCompanySettings(input: Partial<CompanySettings>): Promise<CompanySettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_settings")
    .update(input)
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getDeliveryContent(): Promise<DeliveryContent> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("delivery_content").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}

export async function updateDeliveryContent(input: Partial<DeliveryContent>): Promise<DeliveryContent> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("delivery_content")
    .update(input)
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getWholesaleContent(): Promise<WholesaleContent> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("wholesale_content").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}

export async function updateWholesaleContent(input: Partial<WholesaleContent>): Promise<WholesaleContent> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wholesale_content")
    .update(input)
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listHomepageSections(): Promise<HomepageSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function updateHomepageSection(
  id: string,
  input: Partial<Omit<HomepageSection, "id" | "key">>
): Promise<HomepageSection> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_sections")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
