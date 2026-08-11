export interface Service {
  id: number;
  nome: string;
  imagem_url: string;
  imagem_url_2: string;
  imagem_url_3: string;
  imagem_url_4: string;
  imagem_url_5: string;
  imagem_blur_url?: string; // base64 tiny placeholder for blur effect
  video_url?: string;
  video_url_2?: string;
  video_url_3?: string;
  video_url_4?: string;
  video_url_5?: string;
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
  // Badges estratégicos
  badge_novo?: string;       // "SIM" / "NAO"
  badge_mais_vendido?: string; // "SIM" / "NAO"
  badge_destaque?: string;   // "SIM" / "NAO" (genérico)
}

export type MediaItem = 
  | { type: "image"; url: string; blurUrl?: string }
  | { type: "video"; url: string; poster?: string; blurUrl?: string };

export interface CartItem {
  service: Service;
  quantity: number;
}