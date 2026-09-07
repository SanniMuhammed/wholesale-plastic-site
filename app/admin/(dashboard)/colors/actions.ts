"use server";

import { revalidatePath } from "next/cache";
import { createColor, updateColor, deleteColor } from "@/lib/cms/colors";
import type { Color } from "@/lib/cms/types";

export async function createColorAction(input: Omit<Color, "id">) {
  const color = await createColor(input);
  revalidatePath("/admin/colors");
  return color;
}

export async function updateColorAction(id: string, input: Partial<Omit<Color, "id">>) {
  const color = await updateColor(id, input);
  revalidatePath("/admin/colors");
  return color;
}

export async function deleteColorAction(id: string) {
  await deleteColor(id);
  revalidatePath("/admin/colors");
}
