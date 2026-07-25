"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/product";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: {
    productId: string;
    name: string;
    price: number;
    image: string;
  }) => void;
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
      addItem: ({ productId, name, price, image }) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          if (existing) {
            return { isOpen: true };
          }
          return {
            items: [
              ...state.items,
              { productId, quantity: 1, name, price, image },
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
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        // Piezas únicas: máximo 1
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: 1 } : i,
          ),
        }));
      },
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (acc, item) => acc + (item.price ?? 0) * item.quantity,
          0,
        ),
    }),
    { name: "prieta-cart" },
  ),
);
