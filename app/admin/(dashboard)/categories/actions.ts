"use server";

import { revalidatePath } from "next/cache";
import { createCategory, updateCategory, deleteCategory, uploadCategoryImage, removeCategoryImage } from "@/lib/cms/categories";
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

export async function uploadCategoryImageAction(categoryId: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");
  const category = await uploadCategoryImage(categoryId, file);
  revalidatePath("/admin/categories");
  revalidatePath("/[locale]", "page");
  return category;
}

export async function removeCategoryImageAction(categoryId: string) {
  const category = await removeCategoryImage(categoryId);
  revalidatePath("/admin/categories");
  revalidatePath("/[locale]", "page");
  return category;
}
