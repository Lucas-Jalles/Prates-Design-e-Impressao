import { isPromoActive, effectivePrice, getCategoryLabel, getSubcategoryLabel } from "@/lib/product";
import { formatCurrency } from "@/lib/whatsapp";
import CategoryChips from "@/components/CategoryChips";
import PromoBadge from "@/components/PromoBadge";
import Header from "@/components/Header";
import CompactServiceCard from "@/components/CompactServiceCard";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ categoria?: string; subcategoria?: string; q?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { categoria, subcategoria, q } = await searchParams;
  let services: any[] = [];
  let error: string = "";

  // Try to fetch from Sheets API if configured, otherwise use cache
  try {
    const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL;
    
    if (sheetsUrl) {
      // Fetch from Google Sheets API - using global fetch
      const res = await fetch(sheetsUrl, { 
        cache: 'no-store',
        headers: { Accept: "application/json" }
      });
      
      if (res.ok) {
        const text = await res.text();
        let data = null;
        try {
          data = JSON.parse(text);
        } catch (e) {
          error = "Erro ao ler resposta da planilha";
        }
        
        if (data && typeof data === "object") {
          // Support both {"products": [...]} and direct array formats
          let products = [];
          if (Array.isArray(data)) {
            products = data;
          } else if (data.products && Array.isArray(data.products)) {
            products = data.products;
          }
          
          if (products && Array.isArray(products)) {
            // Format products to match expected structure
            services = products.map(function(p) {
              return {
                id: Number(p.id) || 0,
                nome: String(p.nome || ""),
                categoria: String(p.categoria || ""),
                valor_original: typeof p.valor_original === "number" ? p.valor_original : (p.valor_original ? Number(String(p.valor_original).replace(",", ".")) : 0),
                valor_desconto: typeof p.valor_desconto === "number" || typeof p.desconto === "number" 
                  ? (p.valor_desconto ?? p.desconto ?? 0) 
                  : null,
              };
            });
          }
        }
      } else {
        error = "Erro ao buscar da planilha: " + res.status;
      }
    } else {
      // Fallback: read from cache if no Sheets URL configured
      try {
        const cachePath = path.join(process.cwd(), "src", "data", "products-cache.json");
        const content = await readFile(cachePath, "utf-8");
        services = JSON.parse(content);
      } catch (e) {
        error = "Nao foi possivel carregar cache ou planilha";
      }
    }
  } catch (err) {
    error = (err as Error).message;
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

  // Write services to cache for later use
  try {
    var cachePath = path.join(process.cwd(), "src", "data", "products-cache.json");
    await writeFile(cachePath, JSON.stringify(services));
  } catch (e) {
    // Ignore cache write errors (EROFS in Vercel)
  }

  return services.length;
}