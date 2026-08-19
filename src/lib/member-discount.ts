import { FIRST_PURCHASE_DISCOUNT } from "@/types/member";

export function memberDiscountPercent() {
  return Math.round(FIRST_PURCHASE_DISCOUNT * 100);
}

/** Unit / line price after first-purchase 15%. */
export function memberDiscountedPrice(price: number) {
  return Math.max(0, Math.round(price * (1 - FIRST_PURCHASE_DISCOUNT)));
}

export function calcFirstPurchaseDiscount(subtotal: number) {
  const discountAmount = Math.round(subtotal * FIRST_PURCHASE_DISCOUNT);
  return {
    discountPercent: memberDiscountPercent(),
    discountAmount,
    total: Math.max(0, subtotal - discountAmount),
  };
}
