"use server";

import { revalidatePath } from "next/cache";
import { createCategory, updateCategory, deleteCategory } from "@/lib/cms/categories";
import type { Category } from "@/lib/cms/types";

export async function createCategoryAction(input: Omit<Category, "id">) {
  const category = await createCategory(input);
  revalidatePath("/admin/categories");
  return category;
}

export async function updateCategoryAction(id: string, input: Partial<Omit<Category, "id">>) {
  const category = await updateCategory(id, input);
  revalidatePath("/admin/categories");
  return category;
}

export async function deleteCategoryAction(id: string) {
  await deleteCategory(id);
  revalidatePath("/admin/categories");
}
