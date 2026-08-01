"use client";

import Link from "next/link";
import type { Service } from "@/types";
import { isPromoActive, effectivePrice } from "@/lib/product";
import { formatCurrency } from "@/lib/whatsapp";
import PromoBadge from "@/components/PromoBadge";
import { getDriveImageUrl } from "@/lib/image-utils";
import { useCart } from "@/lib/cart";
import { useFlyToCart } from "@/lib/flyToCart";

interface CompactServiceCardProps {
  service: Service;
  fixedWidth?: boolean;
}

export default function CompactServiceCard({ service, fixedWidth = false }: CompactServiceCardProps) {
  const hasPromo = isPromoActive(service.promo_ativa, service.prazo_oferta) && service.valor_desconto !== null;
  const price = effectivePrice(service);

  const discountPct = hasPromo
    ? Math.round(((service.valor_original - price) / service.valor_original) * 100)
    : 0;

  const { addItem } = useCart();
  const { triggerFly } = useFlyToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(service, 1);
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    triggerFly(getDriveImageUrl(service.imagem_url), rect);
  };

  return (
    <Link href={`/servico/${service.id}`} className="block">
      <div className={`bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0 ${fixedWidth ? 'w-[150px]' : ''}`}>
        <div className="relative aspect-square bg-gray-50">
          <img
            src={getDriveImageUrl(service.imagem_url)}
            alt={service.nome}
            className="w-full h-full object-contain p-3"
            loading="lazy"
          />
          <PromoBadge promo={service.promo_ativa} prazo={service.prazo_oferta} />
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg text-accent hover:bg-accent/10 transition active:scale-95 z-10"
            aria-label="Adicionar ao carrinho"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold">+</span>
          </button>
        </div>
        <div className="p-2 flex flex-col gap-1">
          <span className="text-xs font-medium line-clamp-1">{service.nome}</span>
          {hasPromo && (
            <span className="text-[10px] text-gray-500 line-through">{formatCurrency(service.valor_original)}</span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-foreground">{formatCurrency(price)}</span>
            {hasPromo && (
              <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                -{discountPct}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}