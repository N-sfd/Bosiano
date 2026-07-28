"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCw, Play, Maximize2, Move, X, ZoomIn } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/types";
import { Media } from "@/components/Media";
import { cn } from "@/lib/utils";

type View = "gallery" | "spin" | "video";

export function ProductGallery({ product, variant }: { product: Product; variant: ProductVariant }) {
  const [view, setView] = useState<View>("gallery");
  const [activeImg, setActiveImg] = useState(0);
  const [spinFrame, setSpinFrame] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [lens, setLens] = useState({ x: 50, y: 50 });
  const dragRef = useRef<{ x: number; frame: number } | null>(null);
  const swatches = [variant.hex, shade(variant.hex, -30), shade(variant.hex, 28)];

  useEffect(() => {
    setActiveImg(0);
    setView("gallery");
  }, [variant.id]);

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

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative overflow-hidden rounded-2xl bg-canvas-sunk">
        {view === "gallery" && (
          <div
            className="group relative cursor-zoom-in"
            onMouseMove={onMoveZoom}
            onClick={() => setZoomOpen(true)}
          >
            <Media seed={variant.images[activeImg]} swatches={swatches} ratio="portrait" label={product.name} />
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
              <div
                className="absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-canvas/80 shadow-lg"
                style={{
                  left: `${lens.x}%`,
                  top: `${lens.y}%`,
                  backgroundImage: "inherit",
                }}
              />
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/70 px-4 py-2 text-[0.65rem] uppercase tracking-luxe text-canvas">
                <ZoomIn className="h-3.5 w-3.5" /> Click for full-screen zoom
              </div>
            </div>
          </div>
        )}

        {view === "spin" && product.spin && (
          <div
            className="relative aspect-[3/4] cursor-ew-resize select-none"
            onMouseDown={(e) => startDrag(e.clientX)}
            onMouseMove={(e) => dragRef.current && onDrag(e.clientX)}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={(e) => startDrag(e.touches[0].clientX)}
            onTouchMove={(e) => onDrag(e.touches[0].clientX)}
            onTouchEnd={endDrag}
            role="img"
            aria-label={`360 degree view of ${product.name}`}
          >
            <Media seed={product.spin[spinFrame]} swatches={swatches} ratio="portrait" monogram={false} label={product.name} />
            <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/70 px-4 py-2 text-[0.65rem] uppercase tracking-luxe text-canvas">
              <Move className="h-3.5 w-3.5" /> Drag to rotate · 360°
            </div>
          </div>
        )}

        {view === "video" && (
          <div className="relative aspect-[3/4]">
            <Media seed={product.video ?? variant.images[0]} swatches={swatches} ratio="portrait" monogram={false}>
              <div className="absolute inset-0 flex items-center justify-center bg-ink/25">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-canvas/90 text-ink">
                  <Play className="h-6 w-6 fill-current" />
                </span>
              </div>
              <div className="absolute bottom-4 left-4 rounded-full bg-ink/70 px-3 py-1 text-[0.65rem] uppercase tracking-luxe text-canvas">
                Product film · 0:24
              </div>
            </Media>
          </div>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <ViewBtn active={view === "spin"} onClick={() => setView(view === "spin" ? "gallery" : "spin")} label="360 view">
            <RotateCw className="h-4 w-4" />
          </ViewBtn>
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

      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {variant.images.map((img, i) => (
          <button
            key={img}
            onClick={() => {
              setView("gallery");
              setActiveImg(i);
            }}
            className={cn(
              "w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
              view === "gallery" && activeImg === i ? "border-ink" : "border-transparent"
            )}
            aria-label={`View image ${i + 1}`}
          >
            <Media seed={img} swatches={swatches} ratio="portrait" monogram={false} />
          </button>
        ))}
        {product.spin && (
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

      {zoomOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-ink/90 p-4" role="dialog" aria-label="Full screen zoom">
          <button
            className="absolute right-4 top-4 rounded-full bg-canvas/10 p-2 text-canvas hover:bg-canvas/20"
            onClick={() => setZoomOpen(false)}
            aria-label="Close zoom"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative h-[min(90vh,900px)] w-full max-w-3xl overflow-hidden rounded-xl"
            onMouseMove={onMoveZoom}
            style={{
              background: "transparent",
            }}
          >
            <div
              className="h-full w-full origin-center transition-transform duration-75"
              style={{
                transform: `scale(1.85)`,
                transformOrigin: `${lens.x}% ${lens.y}%`,
              }}
            >
              <Media seed={variant.images[activeImg]} swatches={swatches} ratio="portrait" label={product.name} />
            </div>
            <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-4 py-2 text-[0.65rem] uppercase tracking-luxe text-canvas">
              Move cursor to pan · Esc to close
            </p>
          </div>
        </div>
      )}
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
        active ? "border-gold bg-gold text-canvas" : "border-line bg-canvas-raised/90 text-ink hover:border-ink"
      )}
    >
      {children}
    </button>
  );
}

function shade(hex: string, amt: number) {
  const c = hex.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((num >> 16) + amt);
  const g = clamp(((num >> 8) & 0xff) + amt);
  const b = clamp((num & 0xff) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
