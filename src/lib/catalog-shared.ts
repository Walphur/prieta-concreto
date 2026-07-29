import type { Product, ProductStatus } from "@/types/product";

export function formatPrice(amount: number, currency: "ARS" = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isPurchasable(product: Product) {
  return (
    product.status === "available" &&
    !product.comingSoon &&
    product.category === "bachas"
  );
}

export function isInStock(product: Product) {
  return isPurchasable(product);
}

export function statusLabel(status: ProductStatus) {
  switch (status) {
    case "available":
      return "En stock";
    case "sold":
      return "Vendida";
    case "example":
    default:
      return "Por pedido";
  }
}
