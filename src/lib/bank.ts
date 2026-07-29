import { depositLabel, fullPriceLabel, madeToOrder } from "@/lib/order-policy";

/**
 * Datos para transferencia (Mercado Pago) + WhatsApp.
 */
export const bankTransfer = {
  holder: "Juan Cruz Gagliano",
  bank: "Mercado Pago",
  alias: "dsl.store",
  cbu: "0000003100031803769513",
  /** CBU/CVU label shown in checkout */
  accountLabel: "CVU",
  whatsapp: "5492665031950",
  city: "San Luis, Argentina",
} as const;

export function whatsappOrderUrl(orderRef: string, totalLabel: string) {
  const text = [
    `Hola Prieta, transferí / voy a transferir.`,
    `Pedido: ${orderRef}`,
    `Monto: ${totalLabel}`,
    `Adjunto el comprobante.`,
  ].join("\n");

  return `https://wa.me/${bankTransfer.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function whatsappGeneralUrl(message?: string) {
  const text = message ?? "Hola Prieta, quiero consultar por una pieza.";
  return `https://wa.me/${bankTransfer.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Pedido a medida por modelo/color (ejemplos del catálogo). */
export function whatsappMadeToOrderUrl(opts: {
  name: string;
  color?: string;
  shape?: string;
}) {
  const lines = [
    `Hola Prieta, quiero encargar una bacha.`,
    `Referencia: ${opts.name}`,
  ];
  if (opts.shape) lines.push(`Modelo: ${opts.shape}`);
  if (opts.color) lines.push(`Color: ${opts.color}`);
  lines.push(
    `Entiendo ~${madeToOrder.leadDays} días por ${madeToOrder.reason}.`,
    `Total: ${fullPriceLabel()} · Seña: ${depositLabel()}.`,
    `¿Me confirman cómo seguir con la seña?`,
  );

  return `https://wa.me/${bankTransfer.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** Consulta mayorista (corralones, ferreterías, etc.). */
export function whatsappWholesaleUrl() {
  const text = [
    `Hola Prieta, escribo desde un negocio (corralón / ferretería / distribuidor).`,
    `Quiero consultar condiciones mayoristas de bachas.`,
  ].join("\n");

  return `https://wa.me/${bankTransfer.whatsapp}?text=${encodeURIComponent(text)}`;
}
