import type { CartItem } from "@/types/product";

export type CheckoutCustomer = {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
};

export type PendingOrder = {
  ref: string;
  createdAt: string;
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: number;
};

export const ORDER_STORAGE_KEY = "prieta-pending-order";

export function createOrderRef() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PRI-${stamp}-${rand}`;
}
