"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";

type Props = {
  productId: string;
  name: string;
  price: number;
  image: string;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  disabled,
}: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Button
      variant="primary"
      className="w-full sm:w-auto sm:min-w-[14rem]"
      disabled={disabled}
      onClick={() => addItem({ productId, name, price, image })}
    >
      {disabled ? "No disponible" : "Añadir al Carrito"}
    </Button>
  );
}
