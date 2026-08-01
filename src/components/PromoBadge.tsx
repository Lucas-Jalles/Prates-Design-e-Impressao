import { isPromoActive } from "@/lib/product";

export default function PromoBadge({
  promo,
  prazo,
  className = "absolute top-2 left-2",
}: {
  promo: string;
  prazo: string | null;
  className?: string;
}) {
  if (!isPromoActive(promo, prazo)) return null;
  return (
    <span className={`${className} bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow`}>
      Oferta
    </span>
  );
}