import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Pedido",
  description:
    "Confirmá tu pedido Prieta por transferencia. San Luis, Argentina.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
