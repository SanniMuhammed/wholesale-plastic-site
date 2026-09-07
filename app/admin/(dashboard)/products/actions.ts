"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  setProductColors,
  addProductImage,
  setMainProductImage,
  reorderProductImages,
  deleteProductImage,
} from "@/lib/cms/products";
import type { ProductInput } from "@/lib/cms/types";

export async function createProductAction(input: ProductInput, colorIds: string[]) {
  const product = await createProduct(input);
  if (colorIds.length > 0) await setProductColors(product.id, colorIds);
  revalidatePath("/admin/products");
  return product;
}

export async function updateProductAction(
  id: string,
  input: Partial<ProductInput>,
  colorIds: string[]
) {
  const product = await updateProduct(id, input);
  await setProductColors(id, colorIds);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return product;
}

export async function deleteProductAction(id: string) {
  await deleteProduct(id);
  revalidatePath("/admin/products");
}

export async function toggleProductStatusAction(id: string, status: "draft" | "published") {
  await updateProduct(id, { status });
  revalidatePath("/admin/products");
}

export async function uploadProductImageAction(productId: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");
  const image = await addProductImage(productId, file);
  revalidatePath(`/admin/products/${productId}`);
  return image;
}

export async function setMainProductImageAction(productId: string, imageId: string) {
  await setMainProductImage(productId, imageId);
  revalidatePath(`/admin/products/${productId}`);
}

export async function reorderProductImagesAction(productId: string, orderedIds: string[]) {
  await reorderProductImages(orderedIds);
  revalidatePath(`/admin/products/${productId}`);
}

export async function deleteProductImageAction(productId: string, imageId: string) {
  await deleteProductImage(imageId);
  revalidatePath(`/admin/products/${productId}`);
}
