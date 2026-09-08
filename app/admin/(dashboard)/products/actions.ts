"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  setProductColors,
  addProductImage,
  setMainProductImage,
  reorderProductImages,
  deleteProductImage,
} from "@/lib/cms/products";
import type { ProductInput } from "@/lib/cms/types";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

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
  if (status === "published") {
    const product = await getProduct(id);
    if (!product) throw new Error("Product not found.");
    if (!product.images || product.images.length === 0) {
      throw new Error("Add at least one product photo before publishing.");
    }
    if (!product.images.some((image) => image.is_main)) {
      throw new Error("Set a main product photo before publishing.");
    }
  }

  await updateProduct(id, { status });
  revalidatePath("/admin/products");
}

export async function uploadProductImageAction(productId: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Please select an image.");
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, or WebP image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 8 MB or smaller.");
  }

  const image = await addProductImage(productId, file);
  revalidatePath(`/admin/products/${productId}`);
  return image;
}

export async function setMainProductImageAction(productId: string, imageId: string) {
  await setMainProductImage(productId, imageId);
  revalidatePath(`/admin/products/${productId}`);
}

export async function reorderProductImagesAction(productId: string, orderedIds: string[]) {
  if (!Array.isArray(orderedIds) || orderedIds.length > 20) {
    throw new Error("Invalid image order.");
  }
  await reorderProductImages(orderedIds);
  revalidatePath(`/admin/products/${productId}`);
}

export async function deleteProductImageAction(productId: string, imageId: string) {
  const product = await getProduct(productId);
  if (!product) throw new Error("Product not found.");
  if (product.status === "published" && (product.images?.length ?? 0) <= 1) {
    throw new Error("A published product must keep at least one photo. Unpublish it first to remove the last photo.");
  }
  await deleteProductImage(imageId);
  revalidatePath(`/admin/products/${productId}`);
}
