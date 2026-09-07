"use server";

import { revalidatePath } from "next/cache";
import { createFaq, updateFaq, deleteFaq, reorderFaqs } from "@/lib/cms/faqs";
import type { Faq } from "@/lib/cms/types";

export async function createFaqAction(input: Omit<Faq, "id">) {
  const faq = await createFaq(input);
  revalidatePath("/admin/content/faqs");
  return faq;
}

export async function updateFaqAction(id: string, input: Partial<Omit<Faq, "id">>) {
  const faq = await updateFaq(id, input);
  revalidatePath("/admin/content/faqs");
  return faq;
}

export async function deleteFaqAction(id: string) {
  await deleteFaq(id);
  revalidatePath("/admin/content/faqs");
}

export async function reorderFaqsAction(orderedIds: string[]) {
  await reorderFaqs(orderedIds);
  revalidatePath("/admin/content/faqs");
}
