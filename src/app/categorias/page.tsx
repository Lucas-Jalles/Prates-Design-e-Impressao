import { isPromoActive, effectivePrice, getCategoryLabel, getSubcategoryLabel } from "@/lib/product";
import Header from "@/components/Header";
import CompactServiceCard from "@/components/CompactServiceCard";
import Link from "next/link";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ categoria?: string; subcategoria?: string }>;
}

export default async function CategoriasPage({ searchParams }: PageProps) {
  const { categoria, subcategoria } = await searchParams;
  let services: any[] = [];
  let error: string | null = null;

  try {
    const cachePath = path.join(process.cwd(), "src", "data", "products-cache.json");
    const content = await readFile(cachePath, "utf-8");
    services = JSON.parse(content);
  } catch (e) {
    error = (e as Error).message;
  }

  // Categorias principais disponíveis
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

  const filtered = services.filter((s) => {
    if (categoria && s.categoria !== categoria) return false;
    if (subcategoria && s.subcategoria !== subcategoria) return false;
    return true;
  });

  const hasCategorySelected = !!categoria;
  const currentCategoryLabel = categoria ? getCategoryLabel(categoria) : null;
  const currentSubcategoryLabel = subcategoria ? getSubcategoryLabel(subcategoria) : null;

  // Promos por categoria (quando nenhuma categoria selecionada, mostra geral)
  const getPromosForCategory = (cat?: string) => {
    const base = cat ? services.filter((s) => s.categoria === cat) : services;
    return base
      .filter((s) => isPromoActive(s.promo_ativa, s.prazo_oferta) && s.valor_desconto !== null)
      .slice(0, 6);
  };

  return (
    <div className="max-w-md mx-auto">
      <Header />
      
      {!hasCategorySelected ? (
        // Tela inicial: lista de categorias principais + ofertas por categoria
        <>
          {mainCategories.map((cat) => {
            const promos = getPromosForCategory(cat);
            const count = services.filter((s) => s.categoria === cat).length;
            if (promos.length === 0) return null;
            return (
              <section key={cat} className="px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold flex items-center gap-2">
                    {getCategoryIcon(cat)} {getCategoryLabel(cat)}
                  </h2>
                  <Link
                    href={`/categorias?categoria=${cat}`}
                    className="text-sm text-primary font-medium"
                  >
                    Ver todos
                  </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
                  {promos.map((s) => (
                    <CompactServiceCard key={s.id} service={s} fixedWidth />
                  ))}
                </div>
              </section>
            );
          })}
          
          <section className="px-4 py-4">
            <h2 className="text-base font-semibold mb-3">Todas as Categorias</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mainCategories.map((cat) => {
                const count = services.filter((s) => s.categoria === cat).length;
                return (
                  <Link
                    key={cat}
                    href={`/categorias?categoria=${cat}`}
                    className="bg-white rounded-xl shadow-sm p-4 text-center transition hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl">{getCategoryIcon(cat)}</span>
                    </div>
                    <h3 className="font-semibold text-sm">{getCategoryLabel(cat)}</h3>
                    <p className="text-xs text-muted mt-0.5">{count} serviços</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        // Tela com categoria selecionada
        <>
          {/* Breadcrumb / Navegação de volta */}
          <div className="px-4 py-3">
            <Link
              href="/categorias"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Todas as categorias
            </Link>
          </div>

          {/* Ofertas da categoria selecionada */}
          {(() => {
            const promos = getPromosForCategory(categoria);
            if (promos.length === 0) return null;
            return (
              <section className="px-4 py-3">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  🔥 Ofertas em {currentCategoryLabel}
                </h2>
                <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
                  {promos.map((s) => (
                    <CompactServiceCard key={s.id} service={s} fixedWidth />
                  ))}
                </div>
              </section>
            );
          })()}

          {/* Categoria atual + Subcategorias */}
          <div className="px-4 pb-2">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              {getCategoryIcon(categoria!)} {currentCategoryLabel}
            </h2>
            
            {subCategories.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                <Link
                  href={`/categorias?categoria=${categoria}`}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition active:scale-95 ${
                    !subcategoria
                      ? "bg-primary text-white"
                      : "bg-white text-foreground/80 border border-gray-200"
                  }`}
                >
                  Todos
                </Link>
                {subCategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/categorias?categoria=${categoria}&subcategoria=${sub}`}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition active:scale-95 ${
                      sub === subcategoria
                        ? "bg-primary text-white"
                        : "bg-white text-foreground/80 border border-gray-200"
                    }`}
                  >
                    {getSubcategoryLabel(sub)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Produtos filtrados */}
          <section className="px-4 py-2">
            <h3 className="text-sm font-medium text-muted mb-3">
              {currentSubcategoryLabel ? currentSubcategoryLabel : `Todos os ${currentCategoryLabel?.toLowerCase()}`}
              <span className="text-foreground/60 ml-2">({filtered.length})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((s) => (
                <CompactServiceCard key={s.id} service={s} />
              ))}
            </div>
            {!error && filtered.length === 0 && (
              <p className="text-center text-sm text-muted py-8">
                Nenhum serviço encontrado nesta categoria.
              </p>
            )}
          </section>
        </>
      )}

      {error && (
        <div className="px-4 py-6 text-center text-alert text-sm">
          Não foi possível carregar os serviços: {error}
        </div>
      )}
    </div>
  );
}

function getCategoryIcon(categoria: string): string {
  const icons: Record<string, string> = {
    impressao: "🖨️",
    design: "🎨",
  };
  return icons[categoria] || "📦";
}