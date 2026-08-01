import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getServices, getServiceById } from "@/lib/googleSheets";
import { isPromoActive, effectivePrice, getCategoryLabel, getSubcategoryLabel } from "@/lib/product";
import { formatCurrency, buyNowUrl } from "@/lib/whatsapp";
import AddToCartButton from "@/components/AddToCartButton";
import PromoBadge from "@/components/PromoBadge";
import CompactServiceCard from "@/components/CompactServiceCard";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) return { title: "Serviço" };
  const service = await getServiceById(numId);
  return { title: service?.nome ?? "Serviço" };
}

export default async function ServicePage({ params }: PageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) notFound();

  const service = await getServiceById(numId);
  if (!service) notFound();

  const hasPromo = isPromoActive(service.promo_ativa, service.prazo_oferta) && service.valor_desconto !== null;
  const price = effectivePrice(service);
  const discountPct = hasPromo
    ? Math.round(((service.valor_original - price) / service.valor_original) * 100)
    : 0;

  let relacionados: Awaited<ReturnType<typeof getServices>> = [];
  if (service.relacionados) {
    const ids = service.relacionados
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n));
    if (ids.length > 0) {
      const all = await getServices();
      relacionados = all.filter((s) => ids.includes(s.id));
    }
  }

  const specs = (service.especificacoes || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const allImages = [
    service.imagem_url,
    service.imagem_url_2,
    service.imagem_url_3,
    service.imagem_url_4,
    service.imagem_url_5,
  ];

  // Get URL for share button
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const shareUrl = `${protocol}://${host}/servico/${id}`;

  return (
    <div className="max-w-md mx-auto pb-6">
      <div className="mx-4 relative rounded-xl">
        <ProductImageCarousel images={allImages} />
        {/* Back button on top of image */}
        <Link
          href="/"
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg text-foreground/70 hover:bg-white transition active:scale-95 z-10"
          aria-label="Voltar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        {/* Share button on top of image */}
        <ShareButton serviceName={service.nome} price={price} url={shareUrl} />
        {/* Promo badge at bottom of image */}
        <PromoBadge promo={service.promo_ativa} prazo={service.prazo_oferta} className="absolute bottom-3 left-3" />
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{service.nome}</h1>

        {hasPromo && (
          <span className="text-sm text-gray-500 line-through">
            {formatCurrency(service.valor_original)}
          </span>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {formatCurrency(price)}
          </span>
          {hasPromo && (
            <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-1 rounded">
              -{discountPct}%
            </span>
          )}
        </div>

        {service.prazo_entrega && (
          <p className="text-sm text-foreground/70">
            ⏱ Prazo: {service.prazo_entrega}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
            {getCategoryLabel(service.categoria)}
          </span>
          {service.subcategoria && (
            <span className="text-xs font-medium px-2 py-1 bg-accent/10 text-accent rounded-full">
              {getSubcategoryLabel(service.subcategoria)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <a
            href={buyNowUrl(service)}
            className="text-center font-semibold rounded-xl py-3 text-sm transition active:scale-95 bg-action text-white"
          >
            Comprar agora
          </a>
          <AddToCartButton service={service} />
        </div>

        {service.descricao && (
          <section className="mt-3">
            <h2 className="text-base font-semibold mb-1">Descrição</h2>
            <p className="text-sm text-foreground/80 whitespace-pre-line">
              {service.descricao}
            </p>
          </section>
        )}

        {specs.length > 0 && (
          <section className="mt-3">
            <h2 className="text-base font-semibold mb-1">Especificações</h2>
            <ul className="text-sm text-foreground/80 list-disc pl-5">
              {specs.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {relacionados.length > 0 && (
          <section className="mt-5">
            <h2 className="text-base font-semibold mb-3">
              Você também pode gostar
            </h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
              {relacionados.map((s) => (
                <CompactServiceCard key={s.id} service={s} fixedWidth />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}