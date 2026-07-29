import { BACHA_PRICE } from "@/types/product";
import { formatPrice } from "@/lib/catalog-shared";

/** Política de pedidos a medida (sin stock inmediato). */
export const madeToOrder = {
  leadDays: 15,
  /** Seña para iniciar fabricación */
  deposit: 50_000,
  fullPrice: BACHA_PRICE,
  reason: "secado y fraguado del concreto",
} as const;

export function depositLabel() {
  return formatPrice(madeToOrder.deposit);
}

export function fullPriceLabel() {
  return formatPrice(madeToOrder.fullPrice);
}

export function madeToOrderSummary() {
  return `Si no hay stock del modelo o color que buscás, lo fabricamos por pedido · demora aprox. ${madeToOrder.leadDays} días (${madeToOrder.reason}) · seña ${depositLabel()} · precio total ${fullPriceLabel()}.`;
}
