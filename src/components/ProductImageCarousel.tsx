"use client";

import { useState } from "react";
import Image from "next/image";
import { getDriveImageUrl } from "@/lib/image-utils";

interface Props {
  images: string[];
}

export default function ProductImageCarousel({ images }: Props) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const validImages = images.filter(Boolean);

  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-4xl">📦</span>
      </div>
    );
  }

  const goPrev = () => setCurrent((c) => (c === 0 ? validImages.length - 1 : c - 1));
  const goNext = () => setCurrent((c) => (c === validImages.length - 1 ? 0 : c + 1));

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    setTouchStart(null);
  };

  return (
    <div 
      className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Imagem principal */}
      <Image
        src={getDriveImageUrl(validImages[current])}
        alt={`Imagem ${current + 1}`}
        fill
        className="object-cover"
        priority
        sizes="100vw"
        unoptimized
      />

      {/* Setas de navegação */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg text-xl font-bold text-foreground/80 transition hover:bg-white active:scale-95"
            aria-label="Imagem anterior"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg text-xl font-bold text-foreground/80 transition hover:bg-white active:scale-95"
            aria-label="Próxima imagem"
          >
            ›
          </button>
        </>
      )}

      {/* Indicadores (dots) */}
      {validImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {validImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === current
                  ? "bg-white scale-125"
                  : "bg-white/60 hover:bg-white/90"
              }`}
              aria-label={`Ir para imagem ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      {validImages.length > 1 && (
        <span className="absolute top-3 right-3 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full">
          {current + 1} / {validImages.length}
        </span>
      )}
    </div>
  );
}