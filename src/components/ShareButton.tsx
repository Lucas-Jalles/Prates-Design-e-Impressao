"use client";

import { formatCurrency } from "@/lib/whatsapp";

interface ShareButtonProps {
  serviceName: string;
  price: number;
  url: string;
}

export default function ShareButton({ serviceName, price, url }: ShareButtonProps) {
  const handleShare = async () => {
    const text = `${serviceName} - ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: serviceName, text, url });
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          await navigator.clipboard.writeText(`${text}\n${url}`);
        }
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg text-accent hover:bg-accent/10 transition active:scale-95 z-10"
      aria-label="Compartilhar"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    </button>
  );
}