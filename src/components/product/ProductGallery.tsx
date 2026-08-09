"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCw, Play, Maximize2, Move, X, ZoomIn } from "lucide-react";
import type { Product, ProductImage, ProductVariant } from "@/lib/types";
import { Media } from "@/components/Media";
import { productImageAlt } from "@/lib/images";
import { cn } from "@/lib/utils";

type View = "gallery" | "spin" | "video";

/**
 * Variant-aware gallery — ONLY product.imagesByColor[selectedColor] (or product.images).
 * Zoom / fullscreen always uses the currently selected frame src (or its zoomSrc twin).
 */
export function ProductGallery({ product, variant }: { product: Product; variant: ProductVariant }) {
  const selectedColor = variant.colorId;
  const [view, setView] = useState<View>("gallery");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [spinFrame, setSpinFrame] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [lens, setLens] = useState({ x: 50, y: 50 });
  const dragRef = useRef<{ x: number; frame: number } | null>(null);
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(() => new Set());

  const activeImages: ProductImage[] = useMemo(() => {
    const frames =
      product.imagesByColor?.[selectedColor] ??
      product.images ??
      variant.images.map((src, i) => ({
        src,
        zoomSrc: src,
        alt: productImageAlt(product.name, variant.color, i),
        role: (i === 0 ? "front" : "view") as ProductImage["role"],
        label: i === 0 ? "Front" : `View ${i + 1}`,
        styleId: product.styleId,
        designId: product.styleId,
      }));

    const seen = new Set<string>();
    return frames.filter((frame) => {
      const src = frame.src;
      if (!src || seen.has(src) || failedSrcs.has(src)) return false;
      if (product.colors.length > 1 && /unsplash\.com/i.test(src)) return false;
      seen.add(src);
      return true;
    });
  }, [
    product.imagesByColor,
    product.images,
    product.colors.length,
    product.name,
    product.styleId,
    selectedColor,
    variant.images,
    variant.color,
    failedSrcs,
  ]);

  const markFailed = (src: string) => {
    setFailedSrcs((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  };

  const hasSpin = Boolean(product.spin && product.spin.length > 0);

  useEffect(() => {
    setSelectedImageIndex(0);
    setSpinFrame(0);
    setView("gallery");
    setZoomOpen(false);
    setFailedSrcs(new Set());
  }, [product.slug, selectedColor]);

  useEffect(() => {
    if (selectedImageIndex >= activeImages.length) setSelectedImageIndex(0);
  }, [activeImages.length, selectedImageIndex]);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen]);

  const startDrag = (clientX: number) => {
    dragRef.current = { x: clientX, frame: spinFrame };
  };
  const onDrag = (clientX: number) => {
    if (!dragRef.current || !product.spin) return;
    const delta = clientX - dragRef.current.x;
    const frames = product.spin.length;
    const next = (dragRef.current.frame + Math.round(delta / 18)) % frames;
    setSpinFrame(next < 0 ? next + frames : next);
  };
  const endDrag = () => (dragRef.current = null);

  const onMoveZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLens({ x, y });
  };

  const activeImage = activeImages[selectedImageIndex] ?? activeImages[0];
  const activeSrc = activeImage?.src;
  const zoomSrc = activeImage?.zoomSrc ?? activeImage?.src;
  const activeAlt = activeImage?.alt ?? productImageAlt(product.name, variant.color, selectedImageIndex);

  const onKeyNav = (e: React.KeyboardEvent) => {
    if (view !== "gallery" || activeImages.length < 2) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setSelectedImageIndex((i) => (i + 1) % activeImages.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSelectedImageIndex((i) => (i - 1 + activeImages.length) % activeImages.length);
    }
  };

  if (!activeSrc || !activeImage) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-canvas-sunk text-sm text-ink-muted">
        Image unavailable
      </div>
    );
  }

  return (
    <div
      className="lg:sticky lg:top-24"
      key={`${product.slug}-${selectedColor}`}
      onKeyDown={onKeyNav}
      tabIndex={0}
      aria-label={`${product.name} gallery`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-canvas-sunk">
        {view === "gallery" && (
          <div className="group relative cursor-zoom-in" onClick={() => setZoomOpen(true)}>
            <Media
              key={`${product.slug}-${selectedColor}-${selectedImageIndex}-${activeSrc}`}
              seed={activeSrc}
              ratio="portrait"
              label={activeAlt}
              onImageError={() => markFailed(activeSrc)}
              className="[&_img]:transition-opacity [&_img]:duration-200"
            />
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="mb-4 flex items-center gap-2 rounded-full bg-void/70 px-4 py-2 text-[0.65rem] uppercase tracking-luxe text-canvas">
                <ZoomIn className="h-3.5 w-3.5" /> Click for full-screen zoom
              </div>
            </div>
          </div>
        )}

        {view === "spin" && hasSpin && product.spin && (
          <div
            className="relative aspect-[3/4] cursor-ew-resize select-none"
            onMouseDown={(e) => startDrag(e.clientX)}
            onMouseMove={(e) => dragRef.current && onDrag(e.clientX)}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={(e) => startDrag(e.touches[0].clientX)}
            onTouchMove={(e) => dragRef.current && onDrag(e.touches[0].clientX)}
            onTouchEnd={endDrag}
            role="img"
            aria-label={`360 degree view of ${product.name}`}
          >
            <Media seed={product.spin[spinFrame]} ratio="portrait" monogram={false} label={product.name} />
            <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-void/70 px-4 py-2 text-[0.65rem] uppercase tracking-luxe text-canvas">
              <Move className="h-3.5 w-3.5" /> Drag to rotate · 360°
            </div>
          </div>
        )}

        {view === "video" && product.video && (
          <div className="relative aspect-[3/4]">
            <Media seed={product.video} ratio="portrait" monogram={false}>
              <div className="absolute inset-0 flex items-center justify-center bg-void/25">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-canvas/90 text-ink">
                  <Play className="h-6 w-6 fill-current" />
                </span>
              </div>
              <div className="absolute bottom-4 left-4 rounded-full bg-void/70 px-3 py-1 text-[0.65rem] uppercase tracking-luxe text-canvas">
                Product film · 0:24
              </div>
            </Media>
          </div>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {hasSpin && (
            <ViewBtn active={view === "spin"} onClick={() => setView(view === "spin" ? "gallery" : "spin")} label="360 view">
              <RotateCw className="h-4 w-4" />
            </ViewBtn>
          )}
          {product.video && (
            <ViewBtn active={view === "video"} onClick={() => setView(view === "video" ? "gallery" : "video")} label="Play video">
              <Play className="h-4 w-4" />
            </ViewBtn>
          )}
          <ViewBtn
            active={zoomOpen}
            onClick={() => {
              setView("gallery");
              setZoomOpen(true);
            }}
            label="Zoom"
          >
            <Maximize2 className="h-4 w-4" />
          </ViewBtn>
        </div>
      </div>

      <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
        {activeImages.map((frame, i) => (
          <button
            key={`${product.slug}-${selectedColor}-thumb-${frame.src}`}
            onClick={() => {
              setView("gallery");
              setSelectedImageIndex(i);
            }}
            className={cn(
              "w-[4.25rem] shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200",
              view === "gallery" && selectedImageIndex === i
                ? "border-ink ring-1 ring-ink/20"
                : "border-transparent opacity-80 hover:opacity-100"
            )}
            aria-label={frame.alt}
            aria-current={view === "gallery" && selectedImageIndex === i ? "true" : undefined}
          >
            <Media
              seed={frame.src}
              ratio="portrait"
              monogram={false}
              hideOnError
              onImageError={() => markFailed(frame.src)}
            />
          </button>
        ))}
        {hasSpin && (
          <button
            onClick={() => setView("spin")}
            className={cn(
              "flex w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 text-[0.55rem] uppercase tracking-luxe text-ink-muted",
              view === "spin" ? "border-ink" : "border-line"
            )}
            aria-label="360 view"
          >
            <RotateCw className="h-4 w-4" />
            360°
          </button>
        )}
        {product.video && (
          <button
            onClick={() => setView("video")}
            className={cn(
              "flex w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 text-[0.55rem] uppercase tracking-luxe text-ink-muted",
              view === "video" ? "border-ink" : "border-line"
            )}
            aria-label="Product video"
          >
            <Play className="h-4 w-4" />
            Film
          </button>
        )}
      </div>

      {zoomOpen && zoomSrc && (
        <ZoomModal
          key={`zoom-${product.slug}-${selectedColor}-${selectedImageIndex}-${zoomSrc}`}
          src={zoomSrc}
          alt={activeAlt}
          lens={lens}
          onMove={onMoveZoom}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </div>
  );
}

/** Fullscreen zoom — receives the active frame only; never resolves its own product image. */
function ZoomModal({
  src,
  alt,
  lens,
  onMove,
  onClose,
}: {
  src: string;
  alt: string;
  lens: { x: number; y: number };
  onMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-void/90 p-4" role="dialog" aria-label="Full screen zoom">
      <button
        className="absolute right-4 top-4 rounded-full bg-canvas/10 p-2 text-canvas hover:bg-canvas/20"
        onClick={onClose}
        aria-label="Close zoom"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="relative h-[min(90vh,900px)] w-full max-w-3xl overflow-hidden rounded-xl bg-canvas-sunk" onMouseMove={onMove}>
        <div
          className="relative h-full w-full transition-transform duration-75"
          style={{
            transform: `scale(1.85)`,
            transformOrigin: `${lens.x}% ${lens.y}%`,
          }}
        >
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-contain"
          />
        </div>
        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-void/60 px-4 py-2 text-[0.65rem] uppercase tracking-luxe text-canvas">
          Move cursor to pan · Esc to close
        </p>
      </div>
    </div>
  );
}

function ViewBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-colors",
        active ? "border-gold bg-gold text-void" : "border-line bg-canvas-raised/90 text-ink hover:border-ink"
      )}
    >
      {children}
    </button>
  );
}
