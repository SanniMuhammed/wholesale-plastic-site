"use server";

import { updateProduct } from "@/lib/cms/products";
import type { PricingMode } from "@/lib/cms/types";

export async function updateProductPricingAction(productId: string, pricingMode: PricingMode, price: number | null, priceUnit: string | null) {
  return updateProduct(productId, {
    pricing_mode: pricingMode,
    price: pricingMode === "quote" ? null : price,
    price_unit: pricingMode === "quote" ? null : priceUnit,
  });
}
