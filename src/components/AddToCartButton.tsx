"use client";

import { useState } from "react";
import type { Service } from "@/types";
import { useCart } from "@/lib/cart";
import { useFlyToCart } from "@/lib/flyToCart";

export default function AddToCartButton({
  service,
  compact = false,
}: {
  service: Service;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const { triggerFly } = useFlyToCart();
  const [added, setAdded] = useState(false);

  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    addItem(service, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);

    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    triggerFly(service.imagem_url, rect);
  };

  if (compact) {
    return (
      <button
        onClick={handle}
        className="mt-auto w-full bg-primary text-white text-xs font-semibold rounded-lg py-2 transition active:scale-95"
      >
        {added ? "Adicionado ✓" : "Adicionar"}
      </button>
    );
  }

  return (
    <button
      onClick={handle}
      className="w-full bg-primary text-white text-sm font-semibold rounded-xl py-3 transition active:scale-95"
    >
      {added ? "Adicionado ao carrinho ✓" : "Adicionar ao carrinho"}
    </button>
  );
}