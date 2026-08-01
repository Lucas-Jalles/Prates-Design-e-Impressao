import type { Service } from "@/types";

export function isPromoActive(promo: string, prazo: string | null): boolean {
  if (promo.trim().toUpperCase() !== "SIM") return false;
  if (!prazo) return true;
  const expires = new Date(prazo).getTime();
  if (!Number.isFinite(expires)) return true;
  return expires > Date.now();
}

export function effectivePrice(s: Pick<Service, "valor_original" | "valor_desconto" | "promo_ativa" | "prazo_oferta">): number {
  if (s.valor_desconto !== null && isPromoActive(s.promo_ativa, s.prazo_oferta)) {
    return s.valor_desconto;
  }
  return s.valor_original;
}

export function getCategoryLabel(categoria: string): string {
  const labels: Record<string, string> = {
    impressao: "Impressão",
    design: "Design",
  };
  return labels[categoria] || categoria;
}

export function getSubcategoryLabel(sub: string): string {
  const labels: Record<string, string> = {
    impressao: "Impressão",
    xerox: "Xerox",
    adesivos: "Adesivos",
    panfletos: "Panfletos",
    "foto-3x4": "Foto 3x4",
    curriculo: "Currículo",
    design: "Design",
    "adesivos-personalizados": "Adesivos Personalizados",
    "artes-digitais": "Artes Digitais",
    "panfletos-personalizados": "Panfletos Personalizados",
    "posters-personalizados": "Pôsters Personalizados",
    "topo-de-bolo": "Topo de Bolo",
    "cartao-visita": "Cartão de Visita",
  };
  return labels[sub] || sub;
}