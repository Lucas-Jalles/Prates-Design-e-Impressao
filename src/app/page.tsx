import { isPromoActive, effectivePrice, getCategoryLabel, getSubcategoryLabel } from "@/lib/product";
import { formatCurrency } from "@/lib/whatsapp";
import CategoryChips from "@/components/CategoryChips";
import PromoBadge from "@/components/PromoBadge";
import Header from "@/components/Header";
import CompactServiceCard from "@/components/CompactServiceCard";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ categoria?: string; subcategoria?: string; q?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { categoria, subcategoria, q } = await searchParams;
  let services: any[] = [];

  // Fetch from Sheets if URL configured - using immediate execution
  const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL;
  if (sheetsUrl) {
    // Execute fetch immediately
    (async () => {
      try {
        const res = await fetch(sheetsUrl, {
          cache: 'no-store',
          headers: { Accept: "application/json" }
        });
        if (res.ok) {
          const data = await res.json();
          let products = [];
          if (Array.isArray(data)) {
            products = data;
          } else if (data && data.products && Array.isArray(data.products)) {
            products = data.products;
          }
          if (products && Array.isArray(products)) {
            services = products.map(function(p) {
              return {
                id: p.id || 0,
                nome: p.nome || "",
                categoria: p.categoria || "",
                valor_original: typeof p.valor_original === "number" ? p.valor_original : 0,
                valor_desconto: typeof p.valor_desconto === "number" ? p.valor_desconto : null,
              };
            });
          }
        }
      } catch (e) {
        // Ignore fetch errors
      }
    })();
  }

  const searchQuery = q?.toLowerCase().trim() || "";

  const filtered = services.filter(function(s) {
    if (categoria && s.categoria !== categoria) return false;
    if (subcategoria && s.subcategoria !== subcategoria) return false;
    if (searchQuery) {
      var searchableText = [s.nome, s.descricao, s.especificacoes, s.categoria, s.subcategoria, s.relacionados]
        .filter(function(x) { return x; })
        .join(" ")
        .toLowerCase();
      if (!searchableText.includes(searchQuery)) return false;
    }
    return true;
  });

  var mainCategories = services.map(function(s) { return s.categoria; }).filter(function(x) { return x; }).sort();

  var subCategories = categoria
    ? services.filter(function(s) { return s.categoria === categoria; })
        .map(function(s) { return s.subcategoria; })
        .filter(function(x) { return x; })
        .sort()
    : [];

  var promos = services.filter(function(s) { return isPromoActive(s.promo_ativa, s.prazo_oferta) && s.valor_desconto !== null; }).slice(0, 6);

  var isSearching = searchQuery !== "";

  var sectionTitle = "Todos os servicos";
  if (isSearching) {
    sectionTitle = "Resultados para " + q;
  } else if (subcategoria) {
    sectionTitle = getSubcategoryLabel(subcategoria);
  } else if (categoria) {
    sectionTitle = getCategoryLabel(categoria);
  }

  return (
    <div className="max-w-md mx-auto">
      <Header />
      <CategoryChips
        categories={mainCategories.map(getCategoryLabel)}
        active={categoria ? getCategoryLabel(categoria) : "Todos"}
        paramName="categoria"
        values={mainCategories}
      />
      {categoria && subCategories.length > 0 && (
        <CategoryChips
          categories={subCategories.map(getSubcategoryLabel)}
          active={subcategoria ? getSubcategoryLabel(subcategoria) : "Todos"}
          paramName="subcategoria"
          values={subCategories}
          baseParams={{ categoria }}
        />
      )}
      <section className="px-4 py-3">
        <h2 className="text-base font-semibold mb-3">{sectionTitle}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map(function(s) {
            return <CompactServiceCard key={s.id} service={s} />;
          })}
        </div>
      </section>
    </div>
  );
}