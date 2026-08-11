import type { Service } from "@/types";

<<<<<<< HEAD
=======
let cachedServices: Service[] | null = null;
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_URL!;

export async function fetchServices(): Promise<Service[]> {
  if (!SHEETS_URL) throw new Error("NEXT_PUBLIC_SHEETS_URL não definida");

  const res = await fetch(SHEETS_URL, { 
    cache: 'no-store',
    headers: { Accept: "application/json" }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Sheets HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch (e) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resposta não é JSON: ${text.slice(0, 200)}`);
  }

  if (!data || typeof data !== "object") {
    throw new Error("Resposta inválida: não é objeto");
  }
  const { products, error } = data as { products?: unknown; error?: string };
  if (error) throw new Error(`Apps Script error: ${error}`);
  if (!Array.isArray(products)) {
    throw new Error(`Campo "products" ausente ou não é array: ${JSON.stringify(data).slice(0, 200)}`);
  }

  return products.map((p: unknown, i: number) => {
    const obj = p as Record<string, unknown>;
    return {
      id: Number(obj.id ?? i + 1),
      nome: String(obj.nome ?? ""),
      imagem_url: String(obj.imagem_url ?? ""),
      imagem_url_2: String(obj.imagem_url_2 ?? ""),
      imagem_url_3: String(obj.imagem_url_3 ?? ""),
      imagem_url_4: String(obj.imagem_url_4 ?? ""),
      imagem_url_5: String(obj.imagem_url_5 ?? ""),
<<<<<<< HEAD
      imagem_blur_url: obj.imagem_blur_url ? String(obj.imagem_blur_url) : undefined,
=======
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
      valor_original: Number(obj.valor_original ?? 0),
      valor_desconto: obj.valor_desconto === null || obj.valor_desconto === undefined || obj.valor_desconto === ""
        ? null
        : Number(obj.valor_desconto),
      categoria: String(obj.categoria ?? ""),
      subcategoria: String(obj.subcategoria ?? ""),
      promo_ativa: String(obj.promo_ativa ?? "NAO").toUpperCase(),
      prazo_oferta: obj.prazo_oferta ? String(obj.prazo_oferta) : null,
      prazo_entrega: obj.prazo_entrega ? String(obj.prazo_entrega) : null,
      relacionados: obj.relacionados ? String(obj.relacionados) : null,
      descricao: obj.descricao ? String(obj.descricao) : null,
      especificacoes: obj.especificacoes ? String(obj.especificacoes) : null,
<<<<<<< HEAD
      // Badges estratégicos
      badge_novo: obj.badge_novo ? String(obj.badge_novo).toUpperCase() : "NAO",
      badge_mais_vendido: obj.badge_mais_vendido ? String(obj.badge_mais_vendido).toUpperCase() : "NAO",
      badge_destaque: obj.badge_destaque ? String(obj.badge_destaque).toUpperCase() : "NAO",
=======
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
    } as Service;
  });
}

export async function getServices(): Promise<Service[]> {
<<<<<<< HEAD
  return fetchServices();
=======
  if (cachedServices) return cachedServices;
  cachedServices = await fetchServices();
  return cachedServices;
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
}

export async function getServiceById(id: number): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.id === id) || null;
}

export function clearCache(): void {
<<<<<<< HEAD
  // No-op: in-memory cache removed because it doesn't work on Vercel serverless.
  // Each function invocation has isolated memory. Cache invalidation should be
  // handled at the Google Apps Script level or via Vercel KV/Redis if needed.
=======
  cachedServices = null;
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
}