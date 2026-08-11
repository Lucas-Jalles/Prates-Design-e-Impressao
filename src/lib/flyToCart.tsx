"use client";

import { useState, useEffect, useRef, createContext, useContext, ReactNode } from "react";

interface FlyToCartContextValue {
  triggerFly: (imageUrl: string, fromRect: DOMRect) => void;
}

const FlyToCartContext = createContext<FlyToCartContextValue | null>(null);

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const [flyingItem, setFlyingItem] = useState<{
    imageUrl: string;
    fromRect: DOMRect;
    id: number;
  } | null>(null);

  const triggerFly = (imageUrl: string, fromRect: DOMRect) => {
    setFlyingItem({ imageUrl, fromRect, id: Date.now() });
  };

  return (
    <FlyToCartContext.Provider value={{ triggerFly }}>
      {children}
      {flyingItem && (
        <FlyingImage
          imageUrl={flyingItem.imageUrl}
          fromRect={flyingItem.fromRect}
          onEnd={() => setFlyingItem(null)}
        />
      )}
    </FlyToCartContext.Provider>
  );
}

export function useFlyToCart() {
  const ctx = useContext(FlyToCartContext);
  if (!ctx) throw new Error("useFlyToCart must be used within FlyToCartProvider");
  return ctx;
}

function FlyingImage({
  imageUrl,
  fromRect,
  onEnd,
}: {
  imageUrl: string;
  fromRect: DOMRect;
  onEnd: () => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cartBtn = document.querySelector('[data-cart-target]');
    if (!cartBtn || !elRef.current) {
      onEnd();
      return;
    }

    const cartRect = cartBtn.getBoundingClientRect();
    const el = elRef.current;

    // Posição inicial (centro do botão clicado)
    el.style.left = `${fromRect.left + fromRect.width / 2}px`;
    el.style.top = `${fromRect.top + fromRect.height / 2}px`;
    el.style.transform = "translate(-50%, -50%) scale(1)";

    // Força reflow
    el.getBoundingClientRect();

    // Anima para o carrinho
    el.style.transition = "all 800ms cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.left = `${cartRect.left + cartRect.width / 2}px`;
    el.style.top = `${cartRect.top + cartRect.height / 2}px`;
    el.style.transform = "translate(-50%, -50%) scale(0.1)";
    el.style.opacity = "0";

    const timer = setTimeout(onEnd, 800);
    return () => clearTimeout(timer);
  }, [fromRect, imageUrl, onEnd]);

  return (
    <div
      ref={elRef}
      className="fixed z-[100] pointer-events-none w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-white"
      style={{
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      }}
    >
      <img
        src={imageUrl}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  );
}