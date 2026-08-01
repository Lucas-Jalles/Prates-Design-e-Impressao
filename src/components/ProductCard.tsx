import Link from "next/link";
import type { Service } from "@/types";
import { isPromoActive, effectivePrice } from "@/lib/product";
import { formatCurrency } from "@/lib/whatsapp";
import PromoBadge from "./PromoBadge";
import CountdownTimer from "./CountdownTimer";
import AddToCartButton from "./AddToCartButton";
import { getDriveImageUrl } from "@/lib/image-utils";

export default function ServiceCard({ service }: { service: Service }) {
  const hasPromo = isPromoActive(service.promo_ativa, service.prazo_oferta) && service.valor_desconto !== null;
  const price = effectivePrice(service);
  const originalPrice = service.valor_original;

  return (
    <Link href={`/servico/${service.id}`} className="block bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Imagem - ~60% do card */}
      <div className="relative aspect-[4/3] bg-gray-50">
        <img
          src={getDriveImageUrl(service.imagem_url)}
          alt={service.nome}
          className="w-full h-full object-contain p-4"
          loading="lazy"
        />
        <PromoBadge promo={service.promo_ativa} prazo={service.prazo_oferta} />
      </div>

      {/* Conteúdo - flex-col para alinhar tudo embaixo */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <Link href={`/servico/${service.id}`}>
          <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
            {service.nome}
          </h3>
        </Link>
        <span className="text-xs text-muted capitalize">{service.subcategoria || service.categoria}</span>
        {hasPromo && (
          <span className="text-xs text-gray-500 line-through">
            {formatCurrency(service.valor_original)}
          </span>
        )}
        <span className="text-lg font-bold text-foreground">
          {formatCurrency(price)}
        </span>
        {hasPromo && (
          <CountdownTimer deadline={service.prazo_oferta} />
        )}
        <AddToCartButton service={service} compact />
      </div>
    </Link>
  );
}