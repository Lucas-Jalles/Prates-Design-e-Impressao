import { isPromoActive } from "@/lib/product";
import type { Service } from "@/types";

type BadgeType = "promo" | "novo" | "mais_vendido" | "destaque";

interface BadgeConfig {
  label: string;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
}

const BADGE_CONFIGS: Record<BadgeType, BadgeConfig> = {
  promo: {
    label: "Oferta",
    bgColor: "bg-primary",
    textColor: "text-white",
  },
  novo: {
    label: "Novo",
    bgColor: "bg-accent",
    textColor: "text-white",
  },
  mais_vendido: {
    label: "Mais vendido",
    bgColor: "bg-warning",
    textColor: "text-foreground",
  },
  destaque: {
    label: "Destaque",
    bgColor: "bg-action",
    textColor: "text-white",
  },
};

function getActiveBadges(service: Service): BadgeType[] {
  const badges: BadgeType[] = [];
  if (isPromoActive(service.promo_ativa, service.prazo_oferta) && service.valor_desconto !== null) {
    badges.push("promo");
  }
  if (service.badge_novo === "SIM") badges.push("novo");
  if (service.badge_mais_vendido === "SIM") badges.push("mais_vendido");
  if (service.badge_destaque === "SIM") badges.push("destaque");
  return badges;
}

interface ProductBadgesProps {
  service: Service;
  className?: string;
  maxBadges?: number;
}

export default function ProductBadges({
  service,
  className = "absolute top-2 left-2 flex flex-col gap-1",
  maxBadges = 2,
}: ProductBadgesProps) {
  const activeBadges = getActiveBadges(service).slice(0, maxBadges);

  if (activeBadges.length === 0) return null;

  return (
    <div className={className}>
      {activeBadges.map((type) => {
        const config = BADGE_CONFIGS[type];
        return (
          <span
            key={type}
            className={`${config.bgColor} ${config.textColor} text-[10px] font-bold px-2 py-1 rounded-full shadow`}
          >
            {config.label}
          </span>
        );
      })}
    </div>
  );
}

// Re-export para compatibilidade
export { isPromoActive } from "@/lib/product";