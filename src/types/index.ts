export interface Service {
  id: number;
  nome: string;
  imagem_url: string;
  imagem_url_2: string;
  imagem_url_3: string;
  imagem_url_4: string;
  imagem_url_5: string;
  valor_original: number;
  valor_desconto: number | null;
  categoria: string;
  subcategoria: string;
  promo_ativa: string;
  prazo_oferta: string | null;
  prazo_entrega: string | null;
  relacionados: string | null;
  descricao: string | null;
  especificacoes: string | null;
}

export interface CartItem {
  service: Service;
  quantity: number;
}