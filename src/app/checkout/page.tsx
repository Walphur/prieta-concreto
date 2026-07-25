import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Finalizá tu pedido Prieta Concreto por transferencia bancaria. San Luis, Argentina.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
