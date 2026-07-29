import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

type Props = { params: Promise<{ ref: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ref } = await params;
  return {
    title: `Pedido ${ref}`,
    description: "Datos para transferir tu pedido Prieta.",
  };
}

export default async function PedidoPage({ params }: Props) {
  const { ref } = await params;
  return <OrderConfirmation refId={ref} />;
}
