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

    // Verificar se tem URL da planilha configurada (PRIORIDADE: buscar da planilha se configurado)
    const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL;
    const hasSheetsUrl = !!sheetsUrl;
    
    // SEMPRE tentar buscar da planilha se a URL estiver configurada, mesmo que cache esteja vazio
    if (hasSheetsUrl) {
      try {
        const res = await fetch(sheetsUrl, { 
          cache: 'no-store',
          headers: { Accept: "application/json" }
        });
        
        const status = res.status;
        const text = await res.text();
        
        if (res.ok) {
          try {
            const data = JSON.parse(text);
            
            // Tentar extrair produtos - suportar dois formatos
            let products = [];
            
            if (Array.isArray(data)) {
              // Formato: [{id:1, nome:"..."}, {id:2, nome:"..."}]
              products = data;
            } else if (data && typeof data === 'object' && Array.isArray(data.products)) {
              // Formato: {"products": [{id:1, nome:"..."}, ...]}
              products = data.products;
            }
            
            if (products && Array.isArray(products) && products.length > 0) {
              // Formatar produtos para o formato do nosso sistema
              const formattedProducts = products.map((p: any) => ({
                id: Number(p.id ?? currentCache.length + 1),
                nome: String(p.nome ?? p.titulo ?? p.nome_servico ?? "Serviço"),
                categoria: String(p.categoria ?? p.categoria_servico ?? p.categoria ?? ""),
                valor_original: Number(p.valor_original ?? p.preco ?? p.valor ?? 0),
                valor_desconto: typeof p.valor_desconto === "number" || typeof p.desconto === "number" 
                  ? (p.valor_desconto ?? p.desconto ?? 0) 
                  : null,
              }));
              
              // Atualizar cache com dados da planilha
              await writeFile(cachePath, JSON.stringify(formattedProducts, null, 2));
              
              return NextResponse.json({ 
                success: true, 
                message: "Cache atualizado da planilha",
                count: formattedProducts.length,
                fromCache: false
              });
            }
            
            // Se não tiver produtos na planilha, mas conseguimos conectar
            return NextResponse.json({ 
              success: true, 
              message: "Planilha conectada, mas sem produtos encontrados",
              count: 0,
              fromCache: false,
              debug: { status, dataStructure: Object.keys(data), productsFound: 0 }
            });
            
          } catch (parseError) {
            // Erro ao fazer parse JSON
            return NextResponse.json({ 
              success: false, 
              message: "Erro ao ler resposta da planilha",
              count: 0,
              fromCache: false,
              debug: { error: (parseError as Error).message, status }
            });
          }
        } else {
          // Erro da planilha (403, 404, etc.)
          return NextResponse.json({ 
            success: false, 
            message: `Erro ${status} ao acessar planilha`,
            count: 0,
            fromCache: false,
            debug: { status }
          });
        }
      } catch (fetchError) {
        console.error("Erro ao buscar planilha:", fetchError);
        // Se falhar ao buscar planilha, continua com o que tem (cache vazio ou antigo)
      }
    }

    // Se não conseguiu buscar da planilha (URL não configurada ou erro), usa cache atual
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