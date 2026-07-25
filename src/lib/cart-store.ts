"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/product";
import { products } from "@/lib/products";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      addItem: (productId, quantity = 1) => {
        const product = products.find((p) => p.id === productId);
        if (!product || product.stock <= 0 || product.comingSoon) return;

        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          if (existing) {
            const nextQty = Math.min(
              existing.quantity + quantity,
              product.stock,
            );
            return {
              items: state.items.map((i) =>
                i.productId === productId ? { ...i, quantity: nextQty } : i,
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              { productId, quantity: Math.min(quantity, product.stock) },
            ],
            isOpen: true,
          };
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      setQuantity: (productId, quantity) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return;
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, product.stock) }
              : i,
          ),
        }));
      },
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((acc, item) => {
          const product = products.find((p) => p.id === item.productId);
          return acc + (product?.price ?? 0) * item.quantity;
        }, 0),
    }),
    { name: "prieta-cart" },
  ),
);
