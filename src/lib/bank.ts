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
    `Hola Prieta Concreto, realicé / voy a realizar una transferencia.`,
    `Pedido: ${orderRef}`,
    `Monto: ${totalLabel}`,
    `Adjunto el comprobante.`,
  ].join("\n");

  return `https://wa.me/${bankTransfer.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function whatsappGeneralUrl(message?: string) {
  const text = message ?? "Hola Prieta Concreto, quiero consultar por una bacha.";
  return `https://wa.me/${bankTransfer.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Pedido a medida por modelo/color (ejemplos del catálogo). */
export function whatsappMadeToOrderUrl(opts: {
  name: string;
  color?: string;
  shape?: string;
}) {
  const lines = [
    `Hola Prieta Concreto, quiero pedir una bacha a medida.`,
    `Modelo/color de referencia: ${opts.name}`,
  ];
  if (opts.shape) lines.push(`Modelo: ${opts.shape}`);
  if (opts.color) lines.push(`Color: ${opts.color}`);
  lines.push(
    `Entiendo demora aprox. ${madeToOrder.leadDays} días por ${madeToOrder.reason}.`,
    `Precio total: ${fullPriceLabel()} · Seña: ${depositLabel()}.`,
    `¿Me confirman disponibilidad y cómo transferir la seña?`,
  );

  return `https://wa.me/${bankTransfer.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** Consulta mayorista (corralones, ferreterías, etc.). */
export function whatsappWholesaleUrl() {
  const text = [
    `Hola Prieta Concreto, soy de un negocio (corralón / ferretería / distribuidor).`,
    `Quiero consultar precios mayoristas de bachas.`,
    `¿Me pasan condiciones y lista de precios?`,
  ].join("\n");

  return `https://wa.me/${bankTransfer.whatsapp}?text=${encodeURIComponent(text)}`;
}
