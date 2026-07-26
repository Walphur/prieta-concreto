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
