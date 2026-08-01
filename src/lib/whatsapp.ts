import type { Service } from "@/types";

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getDisplayName(s: Service): string {
  return s.nome || `Serviço ${s.id}`;
}

export function buildServiceMessage(s: Service, quantity: number): string {
  const price = s.valor_desconto !== null ? s.valor_desconto : s.valor_original;
  const total = price * quantity;
  return [
    `*${getDisplayName(s)}*`,
    `Qtd: ${quantity}`,
    `Valor unit: ${formatCurrency(price)}`,
    `Subtotal: ${formatCurrency(total)}`,
  ].join("\n");
}

export function buildCartMessage(items: { service: Service; quantity: number }[]): string {
  const header = "*Olá! Gostaria de finalizar meu pedido:*\n";
  const body = items
    .map((item) => {
      const price = item.service.valor_desconto !== null ? item.service.valor_desconto : item.service.valor_original;
      const total = price * item.quantity;
      return [
        "",
        `*${getDisplayName(item.service)}*`,
        `Qtd: ${item.quantity}`,
        `Valor unit: ${formatCurrency(price)}`,
        `Subtotal: ${formatCurrency(total)}`,
      ].join("\n");
    })
    .join("\n---\n");

  const grandTotal = items.reduce((sum, item) => {
    const price = item.service.valor_desconto !== null ? item.service.valor_desconto : item.service.valor_original;
    return sum + price * item.quantity;
  }, 0);

  const footer = `\n\n*Total geral: ${formatCurrency(grandTotal)}*`;
  return `${header}${body}${footer}`;
}

export function getWhatsAppUrl(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const cleanNumber = number.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buyNowUrl(s: Service): string {
  return getWhatsAppUrl(buildServiceMessage(s, 1));
}