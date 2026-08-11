"use client";

import { useEffect, useRef, useState } from "react";
import { getDriveImageUrl } from "@/lib/image-utils";
import type { MediaItem } from "@/types";

interface FullScreenMediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem[];
  initialIndex: number;
}

function isDriveVideoUrl(url: string): boolean {
  return url.includes("drive.google.com") && !!url.match(/\.(mp4|mov|webm|avi|mkv)($|\?)/i);
}

export default function FullScreenMediaViewer({
  isOpen,
  onClose,
  media,
  initialIndex,
}: FullScreenMediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, media.length, onClose]);

  const goPrev = () =>
    setCurrentIndex((c) => (c === 0 ? media.length - 1 : c - 1));
  const goNext = () =>
    setCurrentIndex((c) => (c === media.length - 1 ? 0 : c + 1));

  const onTouchStart = (e: React.TouchEvent) => setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const diffX = touchStart.x - e.changedTouches[0].clientX;
    const diffY = touchStart.y - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      diffX > 0 ? goNext() : goPrev();
    }
    setTouchStart(null);
  };

  if (!isOpen || media.length === 0) return null;

  const currentMedia = media[currentIndex];
  const isDriveVideo = currentMedia.type === "video" && isDriveVideoUrl(currentMedia.url);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visualização ampliada"
    >
      {/* Conteúdo da mídia - clique não fecha */}
      <div
        ref={viewerRef}
        className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center"
        style={{ touchAction: 'pan-y' }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {currentMedia.type === "image" ? (
          <img
            src={getDriveImageUrl(currentMedia.url)}
            alt={`Imagem ${currentIndex + 1} de ${media.length}`}
            className="max-w-full max-h-[90vh] object-contain"
          />
        ) : isDriveVideo ? (
          <div className="flex flex-col items-center justify-center max-w-full max-h-[90vh] gap-4 text-white">
            {currentMedia.poster && (
              <img
                src={getDriveImageUrl(currentMedia.poster)}
                alt={`Poster do vídeo ${currentIndex + 1}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Vídeo do Google Drive</p>
              <p className="text-sm opacity-70 mb-4">Clique para abrir no Google Drive</p>
              <a
                href={currentMedia.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Abrir no Google Drive
              </a>
            </div>
          </div>
        ) : (
          <video
            src={currentMedia.url}
            poster={currentMedia.poster ? getDriveImageUrl(currentMedia.poster) : undefined}
            controls
            className="max-w-full max-h-[90vh] object-contain"
            autoPlay
            playsInline
          />
        )}

        {/* Contador no canto inferior direito - apenas se houver mais de 1 mídia */}
        {media.length > 1 && (
          <span className="absolute bottom-4 right-4 bg-black/60 text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-lg">
            {currentIndex + 1} / {media.length}
          </span>
        )}

        {/* Botão fechar */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold transition hover:bg-white/30 active:scale-95"
          aria-label="Fechar visualização ampliada"
        >
          ×
        </button>
      </div>
    </div>
  );
}