import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, ZoomIn, Home } from 'lucide-react';

interface PropertyHeroGalleryProps {
  images: string[];
  title: string;
}

function PropertyHeroGallery({ images, title }: PropertyHeroGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const hasImages = images.length > 0;
  const totalImages = images.length;
  const showDots = totalImages <= 12 && totalImages > 1;

  const goTo = useCallback(
    (index: number) => {
      if (totalImages === 0) return;
      setCurrentIndex((index + totalImages) % totalImages);
    },
    [totalImages],
  );

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  const lightboxGoTo = useCallback(
    (index: number) => {
      if (totalImages === 0) return;
      setZoomed(false);
      setLightboxIndex((index + totalImages) % totalImages);
    },
    [totalImages],
  );

  const lightboxPrev = useCallback(
    () => lightboxGoTo(lightboxIndex - 1),
    [lightboxIndex, lightboxGoTo],
  );
  const lightboxNext = useCallback(
    () => lightboxGoTo(lightboxIndex + 1),
    [lightboxIndex, lightboxGoTo],
  );

  const openLightbox = useCallback(
    (index?: number) => {
      setLightboxIndex(index ?? currentIndex);
      setZoomed(false);
      setLightboxOpen(true);
    },
    [currentIndex],
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoomed(false);
  }, []);

  // Keyboard navigation for slider
  useEffect(() => {
    if (lightboxOpen || totalImages <= 1) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, goPrev, goNext, totalImages]);

  // Keyboard navigation for lightbox + body scroll lock
  useEffect(() => {
    if (!lightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxOpen, closeLightbox, lightboxPrev, lightboxNext]);

  // ─── No images placeholder ──────────────────────────────────────────
  if (!hasImages) {
    return (
      <div className="relative w-full h-[500px] max-md:h-[280px] flex items-center justify-center" style={{ backgroundColor: '#E8ECF0' }}>
        <div className="flex flex-col items-center gap-3 text-[#94A3B8]">
          <Home className="w-16 h-16" strokeWidth={1.2} />
          <span className="text-sm font-medium tracking-wide">No photos available</span>
        </div>
      </div>
    );
  }

  // ─── Single image ───────────────────────────────────────────────────
  if (totalImages === 1) {
    return (
      <div
        className="relative w-full h-[500px] max-md:h-[280px] flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: '#E8ECF0' }}
        onClick={() => openLightbox(0)}
      >
        <img
          src={images[0]}
          alt={title}
          className="max-w-full max-h-full object-contain rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.01]"
        />

        {/* Expand hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-black/30 text-white text-xs font-medium transition-opacity duration-300 opacity-70 hover:opacity-100">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Tap to expand</span>
        </div>

        {/* Photo counter */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md bg-black/30 text-white text-xs font-medium">
          1 / 1
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <LightboxOverlay
            images={images}
            title={title}
            currentIndex={lightboxIndex}
            zoomed={zoomed}
            onToggleZoom={() => setZoomed((z) => !z)}
            onClose={closeLightbox}
            onPrev={lightboxPrev}
            onNext={lightboxNext}
            onGoTo={lightboxGoTo}
          />
        )}
      </div>
    );
  }

  // ─── Multi-image slider ─────────────────────────────────────────────
  return (
    <div className="relative w-full h-[500px] max-md:h-[280px] overflow-hidden select-none" style={{ backgroundColor: '#E8ECF0' }}>
      {/* Crossfade images */}
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`${title} - Photo ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === currentIndex ? 1 : 0 }}
          onClick={() => openLightbox(i)}
          draggable={false}
        />
      ))}

      {/* Gradient overlays for readability */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

      {/* Photo counter badge */}
      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md bg-black/30 text-white text-xs font-medium z-10">
        {currentIndex + 1} / {totalImages}
      </div>

      {/* Previous button */}
      <button
        onClick={goPrev}
        aria-label="Previous photo"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-black/30 hover:bg-white/30 text-white transition-all duration-300 shadow-lg cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next button */}
      <button
        onClick={goNext}
        aria-label="Next photo"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-black/30 hover:bg-white/30 text-white transition-all duration-300 shadow-lg cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md bg-black/20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex
                  ? 'w-2.5 h-2.5 bg-white shadow-md'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Expand hint */}
      {!showDots && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-black/30 text-white text-xs font-medium opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={() => openLightbox()}>
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Tap to expand</span>
        </div>
      )}

      {showDots && (
        <div
          className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-black/30 text-white text-xs font-medium opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          onClick={() => openLightbox()}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Tap to expand</span>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <LightboxOverlay
          images={images}
          title={title}
          currentIndex={lightboxIndex}
          zoomed={zoomed}
          onToggleZoom={() => setZoomed((z) => !z)}
          onClose={closeLightbox}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
          onGoTo={lightboxGoTo}
        />
      )}
    </div>
  );
}

// ─── Lightbox Overlay ───────────────────────────────────────────────────────

interface LightboxOverlayProps {
  images: string[];
  title: string;
  currentIndex: number;
  zoomed: boolean;
  onToggleZoom: () => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

function LightboxOverlay({
  images,
  title,
  currentIndex,
  zoomed,
  onToggleZoom,
  onClose,
  onPrev,
  onNext,
  onGoTo,
}: LightboxOverlayProps) {
  const totalImages = images.length;
  const thumbnailRef = React.useRef<HTMLDivElement>(null);

  // Scroll active thumbnail into view
  useEffect(() => {
    const container = thumbnailRef.current;
    if (!container) return;
    const active = container.children[currentIndex] as HTMLElement | undefined;
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentIndex]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col animate-[fadeIn_200ms_ease-out]"
      style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
      onClick={(e) => {
        // Close on backdrop click (not on controls)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
        <span className="text-white/80 text-sm font-medium">
          {currentIndex + 1} / {totalImages}
        </span>
        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-white/10 hover:bg-white/20 text-white transition-all duration-300 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main image area */}
      <div className="flex-1 relative flex items-center justify-center px-16 max-md:px-4 min-h-0">
        {/* Prev button */}
        {totalImages > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md bg-white/10 hover:bg-white/20 text-white transition-all duration-300 shadow-lg cursor-pointer max-md:w-9 max-md:h-9"
          >
            <ChevronLeft className="w-6 h-6 max-md:w-5 max-md:h-5" />
          </button>
        )}

        {/* Image */}
        <div
          className="relative flex items-center justify-center w-full h-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onToggleZoom();
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`${title} - Photo ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-300 select-none"
            style={{ transform: zoomed ? 'scale(2)' : 'scale(1)' }}
            draggable={false}
          />

          {/* Zoom hint */}
          {!zoomed && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/10 text-white/60 text-xs font-medium pointer-events-none transition-opacity duration-300">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Click to zoom</span>
            </div>
          )}
        </div>

        {/* Next button */}
        {totalImages > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md bg-white/10 hover:bg-white/20 text-white transition-all duration-300 shadow-lg cursor-pointer max-md:w-9 max-md:h-9"
          >
            <ChevronRight className="w-6 h-6 max-md:w-5 max-md:h-5" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {totalImages > 1 && (
        <div className="flex-shrink-0 px-4 py-4">
          <div
            ref={thumbnailRef}
            className="flex items-center gap-2 overflow-x-auto pb-1 justify-center"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
          >
            {images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => onGoTo(i)}
                aria-label={`View photo ${i + 1}`}
                className={`flex-shrink-0 w-16 h-12 max-md:w-12 max-md:h-9 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                  i === currentIndex
                    ? 'ring-2 ring-white opacity-100 scale-105'
                    : 'opacity-40 hover:opacity-70'
                }`}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inline keyframes for entrance animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default PropertyHeroGallery;
