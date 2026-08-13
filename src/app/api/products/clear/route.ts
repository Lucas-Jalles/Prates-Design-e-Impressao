import { NextResponse } from "next/server";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL;
    
    if (!sheetsUrl) {
      return NextResponse.json({ 
        success: false, 
        message: "NEXT_PUBLIC_SHEETS_URL não configurada",
        count: 0,
        fromCache: false
      });
    }

    try {
      const res = await fetch(sheetsUrl, { 
        cache: 'no-store',
        headers: { Accept: "application/json" }
      });
      
      const status = res.status;
      const text = await res.text();
      
      if (!res.ok) {
        return NextResponse.json({ 
          success: false, 
          message: `Erro ${status} da planilha`,
          count: 0,
          fromCache: false,
          debug: { status }
        });
      }
      
      let data = null;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return NextResponse.json({ 
          success: false, 
          message: "Resposta da planilha não é JSON",
          count: 0,
          fromCache: false,
          debug: { error: (e as Error).message, textPreview: text.slice(0, 200) }
        });
      }
      
      // O formato da sua Google Script retorna: { products: [...] } 
      // ou pode ser apenas o array direto
      let products = [];
      
      if (Array.isArray(data)) {
        // Formato: [{id:1, nome:"...", ...}, ...]
        products = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.products)) {
        // Formato: {"products": [{id:1, nome:"...", ...}, ...]}
        products = data.products;
      }
      
      if (!products || !Array.isArray(products)) {
        return NextResponse.json({ 
          success: false, 
          message: "Nenhum produto encontrado na planilha",
          count: 0,
          fromCache: false,
          debug: { dataStructure: data ? Object.keys(data) : null }
        });
      }
      
      // Formatar produtos para o formato do nosso sistema (sem gravar no disco - dá erro EROFS no Vercel)
      const formattedProducts = products.map((p: any) => ({
        id: Number(p.id) || 0,
        nome: String(p.nome ?? ''),
        imagem_url: String(p.imagem_url ?? ''),
        imagem_url_2: String(p.imagem_url_2 ?? ''),
        imagem_url_3: String(p.imagem_url_3 ?? ''),
        imagem_url_4: String(p.imagem_url_4 ?? ''),
        imagem_url_5: String(p.imagem_url_5 ?? ''),
        valor_original: typeof p.valor_original === 'number' ? p.valor_original : (p.valor_original ? Number(String(p.valor_original).replace(',', '.')) : 0),
        valor_desconto: (typeof p.valor_desconto === 'number' ? p.valor_desconto : 
          (p.valor_desconto ? Number(String(p.valor_desconto).replace(',', '.')) : null)),
        categoria: String(p.categoria ?? ''),
        promo_ativa: String(p.promo_ativa ?? 'NAO').trim().toUpperCase(),
        prazo_oferta: String(p.prazo_oferta ?? '').trim() || null,
        prazo_entrega: String(p.prazo_entrega ?? '').trim() || null,
      }));
      
      // Apenas retornar os dados - NÃO tentar gravar no cache local (dá erro EROFS no Vercel)
      return NextResponse.json({ 
        success: true, 
        message: "Dados buscados da planilha",
        count: formattedProducts.length,
        fromCache: false,
        // Sem tentar escrever no cache local - Vercel serverless isolado
        products: formattedProducts  // Incluir dados diretamente na resposta
      });
      
    } catch (fetchError) {
      console.error("Erro ao buscar planilha:", fetchError);
      return NextResponse.json({ 
        success: false, 
        message: "Erro ao conectar com planilha",
        count: 0,
        fromCache: false,
        debug: { error: (fetchError as Error).message }
      });
    }
    
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}