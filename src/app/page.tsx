import { getServices } from "@/lib/googleSheets";
import { isPromoActive, effectivePrice, getCategoryLabel, getSubcategoryLabel } from "@/lib/product";
import { formatCurrency } from "@/lib/whatsapp";
import CategoryChips from "@/components/CategoryChips";
import PromoBadge from "@/components/PromoBadge";
import Header from "@/components/Header";
import CompactServiceCard from "@/components/CompactServiceCard";

export const dynamic = "force-dynamic";

interface PageProps {
<<<<<<< HEAD
  searchParams: Promise<{ categoria?: string; subcategoria?: string; q?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { categoria, subcategoria, q } = await searchParams;
=======
  searchParams: Promise<{ categoria?: string; subcategoria?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { categoria, subcategoria } = await searchParams;
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
  let services: Awaited<ReturnType<typeof getServices>> = [];
  let error: string | null = null;

  try {
    services = await getServices();
  } catch (e) {
    error = (e as Error).message;
  }

<<<<<<< HEAD
  const searchQuery = q?.toLowerCase().trim() || "";

  const filtered = services.filter((s) => {
    if (categoria && s.categoria !== categoria) return false;
    if (subcategoria && s.subcategoria !== subcategoria) return false;
    if (searchQuery) {
      const searchableText = [
        s.nome,
        s.descricao,
        s.especificacoes,
        s.categoria,
        s.subcategoria,
        s.relacionados,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!searchableText.includes(searchQuery)) return false;
    }
    return true;
  });

=======
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
  // Categorias principais (impressao, design)
  const mainCategories = Array.from(
    new Set(services.map((s) => s.categoria).filter(Boolean))
  ).sort();

  // Subcategorias da categoria selecionada
  const subCategories = categoria
    ? Array.from(
        new Set(
          services
            .filter((s) => s.categoria === categoria)
            .map((s) => s.subcategoria)
            .filter(Boolean)
        )
      ).sort()
    : [];

<<<<<<< HEAD
=======
  const filtered = services.filter((s) => {
    if (categoria && s.categoria !== categoria) return false;
    if (subcategoria && s.subcategoria !== subcategoria) return false;
    return true;
  });

>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
  const promos = services
    .filter((s) => isPromoActive(s.promo_ativa, s.prazo_oferta) && s.valor_desconto !== null)
    .slice(0, 6);

<<<<<<< HEAD
  const isSearching = !!searchQuery;
  const sectionTitle = isSearching
    ? searchQuery
      ? `Resultados para "${q}"`
      : "Todos os serviços"
    : subcategoria
    ? getSubcategoryLabel(subcategoria)
    : categoria
    ? getCategoryLabel(categoria)
    : "Todos os serviços";

=======
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
  return (
    <div className="max-w-md mx-auto">
      <Header />
      {/* Categorias principais */}
<<<<<<< HEAD
      {!isSearching && (
        <CategoryChips
          categories={mainCategories.map(getCategoryLabel)}
          active={categoria ? getCategoryLabel(categoria) : "Todos"}
          paramName="categoria"
          values={mainCategories}
        />
      )}

      {/* Subcategorias */}
      {!isSearching && categoria && subCategories.length > 0 && (
=======
      <CategoryChips
        categories={mainCategories.map(getCategoryLabel)}
        active={categoria ? getCategoryLabel(categoria) : "Todos"}
        paramName="categoria"
        values={mainCategories}
      />

      {/* Subcategorias */}
      {categoria && subCategories.length > 0 && (
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
        <CategoryChips
          categories={subCategories.map(getSubcategoryLabel)}
          active={subcategoria ? getSubcategoryLabel(subcategoria) : "Todos"}
          paramName="subcategoria"
          values={subCategories}
          baseParams={{ categoria }}
        />
      )}

      {error && (
        <div className="px-4 py-6 text-center text-alert text-sm">
          Não foi possível carregar os serviços: {error}
        </div>
      )}

<<<<<<< HEAD
      {!error && promos.length > 0 && !categoria && !isSearching && (
=======
      {!error && promos.length > 0 && !categoria && (
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
        <section className="px-4 py-3">
          <h2 className="text-base font-semibold mb-2">🔥 Ofertas</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
            {promos.map((s) => (
              <CompactServiceCard key={s.id} service={s} fixedWidth />
            ))}
          </div>
        </section>
      )}

      <section className="px-4 py-3">
<<<<<<< HEAD
        <h2 className="text-base font-semibold mb-3">{sectionTitle}</h2>
=======
        <h2 className="text-base font-semibold mb-3">
          {subcategoria
            ? getSubcategoryLabel(subcategoria)
            : categoria
            ? getCategoryLabel(categoria)
            : "Todos os serviços"}
        </h2>
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((s) => (
            <CompactServiceCard key={s.id} service={s} />
          ))}
        </div>
        {!error && filtered.length === 0 && (
          <p className="text-center text-sm text-muted py-8">
<<<<<<< HEAD
            {isSearching
              ? `Nenhum resultado encontrado para "${q}".`
              : "Nenhum serviço encontrado."}
=======
            Nenhum serviço encontrado.
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
          </p>
        )}
      </section>
    </div>
  );
}