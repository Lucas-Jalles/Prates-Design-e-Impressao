"use client";

<<<<<<< HEAD
import { useState, useCallback, useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { getDriveImageUrl, getBlurDataUrl } from "@/lib/image-utils";
import type { MediaItem } from "@/types";
import FullScreenMediaViewer from "@/components/FullScreenMediaViewer";

interface Props {
  images: string[];
  videos?: string[];
  blurUrls?: string[];
}

function toMediaItems(images: string[], videos?: string[], blurUrls?: string[]): MediaItem[] {
  const media: MediaItem[] = [];
  const maxCount = Math.max(images.filter(Boolean).length, (videos?.filter(Boolean).length || 0));
  
  for (let i = 0; i < maxCount; i++) {
    if (images[i] && images[i].trim()) {
      media.push({ 
        type: "image", 
        url: images[i],
        blurUrl: blurUrls?.[i] || getBlurDataUrl(images[i])
      });
    }
    if (videos?.[i] && videos[i].trim()) {
      media.push({ 
        type: "video", 
        url: videos[i],
        poster: images[i] || undefined,
        blurUrl: blurUrls?.[i] || (images[i] ? getBlurDataUrl(images[i]) : undefined)
      });
    }
  }
  return media;
}

function isDriveVideoUrl(url: string): boolean {
  return url.includes("drive.google.com") && !!url.match(/\.(mp4|mov|webm|avi|mkv)($|\?)/i);
}

function RenderMedia({ media, index, getDriveImageUrl, slideWidthPercent }: { media: MediaItem; index: number; getDriveImageUrl: (url: string) => string; slideWidthPercent: number }) {
  const isDriveVideo = media.type === "video" && isDriveVideoUrl(media.url);
  const blurUrl = media.blurUrl || TRANSPARENT_PIXEL;
  const slideStyle = { width: `${slideWidthPercent}%` } as React.CSSProperties;
  
  if (media.type === "image") {
    return (
      <div key={index} className="relative h-full flex-shrink-0 snap-center" style={slideStyle}>
        <Image
          src={getDriveImageUrl(media.url)}
          alt={`Imagem ${index + 1}`}
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized
          placeholder="blur"
          blurDataURL={blurUrl}
          loading="lazy"
        />
      </div>
    );
  }
  
  if (isDriveVideo) {
    return (
      <div key={index} className="relative h-full flex-shrink-0 snap-center" style={slideStyle}>
        {media.poster && (
          <Image
            src={getDriveImageUrl(media.poster)}
            alt={`Poster do vídeo ${index + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized
            placeholder="blur"
            blurDataURL={blurUrl}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          Vídeo
        </span>
      </div>
    );
  }
  
  return (
    <div key={index} className="relative h-full flex-shrink-0 snap-center" style={slideStyle}>
      <video
        src={media.url}
        poster={media.poster ? getDriveImageUrl(media.poster) : undefined}
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay
        loop
        controls
        preload="metadata"
      />
    </div>
  );
}

const TRANSPARENT_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

export default function ProductImageCarousel({ images, videos = [], blurUrls = [] }: Props) {
  const [current, setCurrent] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const media = toMediaItems(images, videos, blurUrls);
  const validMedia = media.filter((m) => m.url && m.url.trim());

  // Measure container width
  useLayoutEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    if (carouselRef.current) ro.observe(carouselRef.current);
    return () => ro.disconnect();
  }, []);

  // Scroll to slide when current changes
  useEffect(() => {
    if (trackRef.current && containerWidth > 0) {
      trackRef.current.scrollTo({
        left: current * containerWidth,
        behavior: "smooth",
      });
    }
  }, [current, containerWidth]);

  // Sync current from scroll (for drag/swipe)
  const onScroll = useCallback(() => {
    if (!trackRef.current || containerWidth === 0) return;
    const scrollLeft = trackRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / containerWidth);
    if (newIndex !== current && newIndex >= 0 && newIndex < validMedia.length) {
      setCurrent(newIndex);
    }
  }, [current, containerWidth, validMedia.length]);

  // Preload next/previous images
  useEffect(() => {
    if (validMedia.length <= 1) return;
    const nextIndex = (current + 1) % validMedia.length;
    const prevIndex = (current - 1 + validMedia.length) % validMedia.length;
    
    [nextIndex, prevIndex].forEach(idx => {
      const m = validMedia[idx];
      if (m.type === "image" && m.url) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = getDriveImageUrl(m.url);
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
      }
    });
  }, [current, validMedia]);

  if (validMedia.length === 0) {
=======
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
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-4xl">📦</span>
      </div>
    );
  }

<<<<<<< HEAD
  const handleOpenFullScreen = () => setIsFullScreen(true);
  const handleCloseFullScreen = () => setIsFullScreen(false);

  return (
    <div className="relative" ref={carouselRef}>
      {/* Carrossel principal - scroll horizontal nativo com snap */}
      <div 
        ref={trackRef}
        className="relative aspect-square bg-gray-100 rounded-xl overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ 
          touchAction: 'pan-x',
          scrollSnapType: 'x mandatory',
        }}
        onScroll={onScroll}
      >
        {/* Track: flex row, each slide = 100% container width */}
        <div
          className="flex h-full"
          style={{ width: `${validMedia.length * 100}%` }}
        >
          {validMedia.map((m, i) => (
            <RenderMedia 
              key={i} 
              media={m} 
              index={i} 
              getDriveImageUrl={getDriveImageUrl}
              slideWidthPercent={100 / validMedia.length}
            />
          ))}
        </div>

        {/* Overlay indicando que é clicável para ampliar */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end p-3 pointer-events-none">
          <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full">
            Toque para ampliar
          </span>
        </div>

        {/* Contador no canto inferior direito */}
        {validMedia.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg z-10">
            {current + 1} / {validMedia.length}
          </span>
        )}
      </div>

      {/* Visualizador full-screen */}
      <FullScreenMediaViewer
        isOpen={isFullScreen}
        onClose={handleCloseFullScreen}
        media={validMedia}
        initialIndex={current}
      />
=======
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
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
    </div>
  );
}