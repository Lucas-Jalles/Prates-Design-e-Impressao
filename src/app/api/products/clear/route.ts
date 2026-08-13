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
    const hasSheetsUrl = !!sheetsUrl;
    
    // Se tiver URL, tentar buscar da planilha e atualizar cache
    if (hasSheetsUrl) {
      try {
        const res = await fetch(sheetsUrl, { 
          cache: 'no-store',
          headers: { Accept: "application/json" }
        });
        
        // Capturar resposta completa para depuração
        const status = res.status;
        const headers = Object.fromEntries(res.headers.entries());
        const text = await res.text();
        
        // Tentar fazer parse como JSON
        let data = null;
        try {
          data = JSON.parse(text);
        } catch (e) {
          // Não é JSON, retornar erro
          return NextResponse.json({ 
            success: false, 
            message: "Resposta da planilha não é JSON",
            count: 0,
            fromCache: false,
            debug: { status, headers, rawText: text.slice(0, 500) }
          });
        }
        
        // Verificar se resposta ok
        if (!res.ok) {
          return NextResponse.json({ 
            success: false, 
            message: `Erro ${status} da planilha`,
            count: 0,
            fromCache: false,
            debug: { status, headers, rawText: text.slice(0, 500) }
          });
        }
        
        // O formato pode ser: {"products": [...]} ou apenas [...]
        let products = [];
        
        // Tentar formato com campo 'products'
        if (data && typeof data === 'object' && Array.isArray(data.products)) {
          products = data.products;
        } else if (Array.isArray(data)) {
          // Formato direto: o array está no topo nível
          products = data;
        }
        
        // Se tiver produtos, atualizar cache
        if (products && Array.isArray(products) && products.length > 0) {
          // Formatar produtos para o formato do nosso sistema
          const formattedProducts = products.map((p: any) => ({
            id: Number(p.id ?? currentCache.length + 1),
            nome: String(p.nome ?? p.titulo ?? p.nome_servico ?? ""),
            categoria: String(p.categoria ?? p.categoria_servico ?? p.categoria ?? ""),
            valor_original: Number(p.valor_original ?? p.preco ?? p.valor ?? 0),
            valor_desconto: typeof p.valor_desconto === "number" || typeof p.desconto === "number" 
              ? (p.valor_desconto ?? p.desconto ?? 0) 
              : null,
          }));
          
          // Escrever no cache
          await writeFile(cachePath, JSON.stringify(formattedProducts, null, 2));
          
          return NextResponse.json({ 
            success: true, 
            message: "Cache atualizado da planilha",
            count: formattedProducts.length,
            fromCache: false,
            debug: { status, productCount: products.length, format: 'fromSheets' }
          });
        }
        
        // Se não conseguiu extrair produtos
        return NextResponse.json({ 
          success: true, 
          message: "Planilha consultada, mas sem dados de produtos válidos",
          count: 0,
          fromCache: false,
          debug: { status, dataStructure: Object.keys(data), productsFound: products.length }
        });
        
      } catch (fetchError) {
        console.error("Erro ao buscar planilha:", fetchError);
        // Se falhar, continua com cache atual
      }
    }

    // Se não conseguiu buscar da planilha OU URL não configurada, retorna cache atual
    const cacheMessage = currentCache.length > 0 ? "Cache consultado com dados antigos" : "Cache vazio - nenhum dado encontrado";
    const note = currentCache.length === 0 && !hasSheetsUrl ? "Nenhum dado no cache. Configure NEXT_PUBLIC_SHEETS_URL para buscar da planilha." : "";
    
    return NextResponse.json({ 
      success: true, 
      message: cacheMessage,
      count: currentCache.length,
      fromCache: true,
      debug: { 
        sheetsUrlConfigured: hasSheetsUrl, 
        cacheLength: currentCache.length,
        note: note
      }
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}