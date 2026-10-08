import { FIRST_PURCHASE_DISCOUNT } from "@/types/member";

export type DiscountableItem = {
  productId: string;
  quantity: number;
  price?: number;
};

export type SecondUnitDiscount = {
  discountPercent: number;
  discountAmount: number;
  total: number;
  /** Segunda unidad del carrito (la que lleva el 15%). */
  discountedProductId: string | null;
  applies: boolean;
};

export function memberDiscountPercent() {
  return Math.round(FIRST_PURCHASE_DISCOUNT * 100);
}

/** Precio de una unidad con 15%. */
export function memberDiscountedPrice(price: number) {
  return Math.max(0, Math.round(price * (1 - FIRST_PURCHASE_DISCOUNT)));
}

/**
 * La primera unidad paga el total.
 * La segunda unidad lleva 15%. El resto, si hay, también a precio de lista.
 */
export function calcSecondUnitDiscount(
  items: DiscountableItem[],
): SecondUnitDiscount {
  const units: { productId: string; price: number }[] = [];
  for (const item of items) {
    const qty = Math.max(0, item.quantity || 0);
    for (let i = 0; i < qty; i += 1) {
      units.push({ productId: item.productId, price: item.price ?? 0 });
    }
  }

  const subtotal = units.reduce((acc, unit) => acc + unit.price, 0);
  const percent = memberDiscountPercent();

  if (units.length < 2) {
    return {
      discountPercent: percent,
      discountAmount: 0,
      total: subtotal,
      discountedProductId: null,
      applies: false,
    };
  }

  const second = units[1];
  const discountAmount = Math.round(second.price * FIRST_PURCHASE_DISCOUNT);

  return {
    discountPercent: percent,
    discountAmount,
    total: Math.max(0, subtotal - discountAmount),
    discountedProductId: second.productId,
    applies: discountAmount > 0,
  };
}
