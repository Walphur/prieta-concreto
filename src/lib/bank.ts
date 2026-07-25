/**
 * Datos para transferencia bancaria.
 * Completá alias, CBU y WhatsApp reales antes de vender.
 */
export const bankTransfer = {
  holder: "Prieta Concreto",
  bank: "Completar banco",
  alias: "prieta.concreto",
  cbu: "0000000000000000000000",
  whatsapp: "5492664000000",
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
