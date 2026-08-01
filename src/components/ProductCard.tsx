import Link from "next/link";
import type { Service } from "@/types";
import { isPromoActive, effectivePrice } from "@/lib/product";
import { formatCurrency } from "@/lib/whatsapp";
import PromoBadge from "./PromoBadge";
import CountdownTimer from "./CountdownTimer";
import AddToCartButton from "./AddToCartButton";

export default function ServiceCard({ service }: { service: Service }) {
  const hasPromo = isPromoActive(service.promo_ativa, service.prazo_oferta) && service.valor_desconto !== null;
  const price = effectivePrice(service);
  const originalPrice = service.valor_original;

  return (
    <Link href={`/servico/${service.id}`} className="block bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Imagem - ~60% do card */}
      <div className="relative aspect-[4/3] bg-gray-50">
        <img
          src={service.imagem_url}
          alt={service.nome}
          className="w-full h-full object-contain p-4"
          loading="lazy"
        />
        <PromoBadge promo={service.promo_ativa} prazo={service.prazo_oferta} />
      </div>

      {/* Conteúdo - flex-col para alinhar tudo embaixo */}
      <div className="p-3 flex flex-col flex-1">
        {/* Nome do produto */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 min-h-[2.5rem] mb-2">
          {service.nome}
        </h3>

        {/* Subcategoria */}
        <span className="text-xs text-muted capitalize mb-1">
          {service.subcategoria || service.categoria}
        </span>

        {/* Área de preços */}
        <div className="flex flex-col gap-0.5 mb-2">
          {hasPromo && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
          <span className="text-2xl font-bold text-accent">
            {formatCurrency(price)}
          </span>
        </div>

        {/* Info complementar - parcelamento */}
        {hasPromo && (
          <p className="text-xs text-muted mb-2">
            até 3x sem juros
          </p>
        )}

        {/* Contador de oferta */}
        {hasPromo && (
          <CountdownTimer deadline={service.prazo_oferta} className="self-start mb-2" />
        )}

        {/* Botão de ação - sempre no final */}
        <div className="mt-auto">
          <AddToCartButton service={service} compact />
        </div>
      </div>
    </Link>
  );
}