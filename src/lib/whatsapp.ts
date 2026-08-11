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
<<<<<<< HEAD
    `🛒 *Lista de Produtos*`,
    ``,
    `1. *${getDisplayName(s)}*`,
    `   Quantidade: ${quantity}`,
    `   Valor unitário: ${formatCurrency(price)}`,
    `   Subtotal: ${formatCurrency(total)}`,
    ``,
    `*Resumo do pedido*`,
    `Total de itens: ${quantity}`,
    `Valor total: ${formatCurrency(total)}`,
=======
    `*${getDisplayName(s)}*`,
    `Qtd: ${quantity}`,
    `Valor unit: ${formatCurrency(price)}`,
    `Subtotal: ${formatCurrency(total)}`,
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
  ].join("\n");
}

export function buildCartMessage(items: { service: Service; quantity: number }[]): string {
<<<<<<< HEAD
  const lines: string[] = [
    `🛒 *Lista de Produtos*`,
    ``,
  ];

  items.forEach((item, index) => {
    const price = item.service.valor_desconto !== null ? item.service.valor_desconto : item.service.valor_original;
    const total = price * item.quantity;
    lines.push(
      `${index + 1}. *${getDisplayName(item.service)}*`,
      `   Quantidade: ${item.quantity}`,
      `   Valor unitário: ${formatCurrency(price)}`,
      `   Subtotal: ${formatCurrency(total)}`,
      ``
    );
  });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
=======
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

>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
  const grandTotal = items.reduce((sum, item) => {
    const price = item.service.valor_desconto !== null ? item.service.valor_desconto : item.service.valor_original;
    return sum + price * item.quantity;
  }, 0);

<<<<<<< HEAD
  lines.push(
    `*Resumo do pedido*`,
    `Total de itens: ${totalItems}`,
    `Valor total: ${formatCurrency(grandTotal)}`
  );

  return lines.join("\n");
=======
  const footer = `\n\n*Total geral: ${formatCurrency(grandTotal)}*`;
  return `${header}${body}${footer}`;
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
}

export function getWhatsAppUrl(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const cleanNumber = number.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buyNowUrl(s: Service): string {
  return getWhatsAppUrl(buildServiceMessage(s, 1));
}