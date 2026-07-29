import { FIRST_PURCHASE_DISCOUNT } from "@/types/member";

export function calcFirstPurchaseDiscount(subtotal: number) {
  const discountAmount = Math.round(subtotal * FIRST_PURCHASE_DISCOUNT);
  return {
    discountPercent: Math.round(FIRST_PURCHASE_DISCOUNT * 100),
    discountAmount,
    total: Math.max(0, subtotal - discountAmount),
  };
}
