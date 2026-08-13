import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cachePath = path.join(process.cwd(), "src", "data", "products-cache.json");
    
    // Tentar ler cache atual
    let currentCache: any[] = [];
    try {
      const content = await readFile(cachePath, "utf-8");
      currentCache = JSON.parse(content);
    } catch (e) {
      currentCache = [];
    }

    // Verificar se tem URL da planilha configurada
    const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL;
    
    // Se tiver URL, tentar buscar da planilha e atualizar cache
    if (sheetsUrl) {
      try {
        const res = await fetch(sheetsUrl, { 
          cache: 'no-store',
          headers: { Accept: "application/json" }
        });
        
        if (res.ok) {
          const data = await res.json();
          const { products } = data;
          if (products && Array.isArray(products)) {
            // Atualizar cache com dados da planilha
            const formattedProducts = products.map((p: any) => ({
              id: Number(p.id ?? currentCache.length + 1),
              nome: String(p.nome ?? ""),
              categoria: String(p.categoria ?? ""),
              valor_original: Number(p.valor_original ?? 0),
              valor_desconto: typeof p.valor_desconto === "number" ? p.valor_desconto : null,
            }));
            await writeFile(cachePath, JSON.stringify(formattedProducts, null, 2));
            return NextResponse.json({ 
              success: true, 
              message: "Cache atualizado da planilha",
              count: formattedProducts.length,
              fromCache: false
            });
          }
        }
      } catch (sheetsError) {
        // Se falhar ao buscar planilha, continua com cache atual
      }
    }

    // Se não conseguiu buscar da planilha, retorna cache atual
    return NextResponse.json({ 
      success: true, 
      message: currentCache.length > 0 ? "Cache consultado" : "Cache vazio - nenhum dado encontrado",
      count: currentCache.length,
      fromCache: true,
      note: currentCache.length === 0 && !sheetsUrl ? "Nenhum dado no cache. Configure NEXT_PUBLIC_SHEETS_URL para buscar da planilha." : ""
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}