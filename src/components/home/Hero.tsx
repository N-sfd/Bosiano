"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause, Plus } from "lucide-react";
import { Media } from "@/components/Media";
import { products } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";

interface Hotspot {
  productSlug: string;
  top: string;
  left: string;
}

interface Slide {
  seed: string;
  swatches: string[];
  eyebrow: string;
  title: string;
  copy: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  video?: boolean;
  align?: "left" | "center";
  hotspots?: Hotspot[];
}

const slides: Slide[] = [
  {
    seed: "hero-autumn-campaign",
    swatches: ["#2f3033", "#6b6156", "#c2a367"],
    eyebrow: "The Autumn Campaign · 2026",
    title: "Softness, as Strength",
    copy: "A new season of fluid tailoring from Maison Vérane. Structure reimagined, movement restored.",
    cta: { label: "Shop the campaign", href: "/shop?sort=new" },
    secondary: { label: "Watch the film", href: "/journal/the-new-tailoring" },
    video: true,
    align: "left",
    hotspots: [
      { productSlug: "sculpted-wool-blazer", top: "42%", left: "58%" },
      { productSlug: "pleated-wide-leg-trouser", top: "68%", left: "62%" },
      { productSlug: "sculptural-heeled-mule", top: "82%", left: "52%" },
    ],
  },
  {
    seed: "hero-riviera-film",
    swatches: ["#a9c4d6", "#e9e2d3", "#c07a55"],
    eyebrow: "Solène · Resort",
    title: "Golden Hour, All Day",
    copy: "Sun-warmed linen and easy silhouettes for the long way home.",
    cta: { label: "Discover Solène", href: "/designers/solene" },
    align: "center",
    hotspots: [
      { productSlug: "riviera-linen-shirt", top: "40%", left: "48%" },
      { productSlug: "poplin-tiered-maxi-dress", top: "65%", left: "55%" },
    ],
  },
  {
    seed: "hero-okoro-heritage",
    swatches: ["#2a3b57", "#a4562f", "#b5904a"],
    eyebrow: "Okoro · Now on Bosiano",
    title: "Heritage, Reimagined",
    copy: "Hand-dyed adire and woven aso-oke — one-of-a-kind pieces from Lagos.",
    cta: { label: "Explore the house", href: "/designers/okoro" },
    align: "left",
    hotspots: [
      { productSlug: "adire-wrap-midi-skirt", top: "55%", left: "60%" },
      { productSlug: "handwoven-aso-oke-clutch", top: "72%", left: "45%" },
    ],
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [activePin, setActivePin] = useState<string | null>(null);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, [playing]);

  useEffect(() => setActivePin(null), [index]);

  const slide = slides[index];

  return (
    <section className="relative h-[68vh] min-h-[480px] max-h-[720px] w-full overflow-hidden bg-void sm:h-[72vh] sm:min-h-[520px]">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Media
            seed={slide.seed}
            swatches={slide.swatches}
            ratio="auto"
            className="h-full w-full"
            monogram={false}
            priority
            sizes="100vw"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/30 to-ink/25" />
            {/* Scrim for left/center copy legibility across crops */}
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 w-full max-w-3xl bg-gradient-to-r from-ink/55 via-ink/25 to-transparent",
                slide.align === "center" && "left-1/2 max-w-none -translate-x-1/2 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent"
              )}
              aria-hidden
            />
            {/* Interactive lookbook hotspots */}
            {slide.hotspots?.map((h) => {
              const product = products.find((p) => p.slug === h.productSlug);
              if (!product) return null;
              const open = activePin === h.productSlug;
              return (
                <div key={h.productSlug} className="absolute z-10" style={{ top: h.top, left: h.left }}>
                  <button
                    onClick={() => {
                      setPlaying(false);
                      setActivePin(open ? null : h.productSlug);
                    }}
                    className="relative flex h-9 w-9 animate-hotspot-ring items-center justify-center rounded-full border border-canvas/50 bg-canvas text-ink shadow-[0_4px_18px_rgba(0,0,0,0.35)] transition-transform hover:scale-110"
                    aria-label={`Shop ${product.name}`}
                    aria-expanded={open}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-canvas/40" aria-hidden />
                    <Plus className={cn("relative z-[1] h-4 w-4 transition-transform", open && "rotate-45")} />
                  </button>
                  {open && (
                    <Link
                      href={`/product/${product.slug}`}
                      className="absolute left-11 top-1/2 z-20 w-48 -translate-y-1/2 rounded-xl bg-canvas-raised p-3 shadow-xl"
                    >
                      <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">Shop the look</p>
                      <p className="mt-1 font-serif text-base leading-tight text-ink">{product.name}</p>
                      <p className="mt-1 text-xs text-ink-soft">{formatPrice(product.price)}</p>
                    </Link>
                  )}
                </div>
              );
            })}
          </Media>
        </motion.div>
      </AnimatePresence>

      <div className="shell relative flex h-full items-end pb-16 sm:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative max-w-xl rounded-sm text-ink sm:max-w-2xl",
              slide.align === "center" && "mx-auto text-center"
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute -inset-x-4 -inset-y-3 rounded-2xl bg-void/35 blur-xl sm:-inset-x-6 sm:-inset-y-4",
                slide.align === "center" && "left-1/2 w-[min(100%,36rem)] -translate-x-1/2"
              )}
              aria-hidden
            />
            <div className="relative">
              <p className="eyebrow !text-canvas/85">{slide.eyebrow}</p>
              <h1 className="mt-4 font-serif text-5xl leading-[0.98] text-balance text-canvas sm:text-6xl lg:text-7xl">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-canvas/90 sm:text-base lg:text-lg">
                {slide.copy}
              </p>
              <div className={cn("mt-8 flex flex-wrap gap-3", slide.align === "center" && "justify-center")}>
                <Link
                  href={slide.cta.href}
                  className="bg-gold px-10 py-4 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-deep"
                >
                  {slide.cta.label}
                </Link>
                {slide.secondary && (
                  <Link
                    href={slide.secondary.href}
                    className="inline-flex items-center justify-center gap-2 border border-gold bg-canvas/90 px-10 py-4 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-ink backdrop-blur-sm transition-colors hover:border-gold-deep hover:bg-canvas"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> {slide.secondary.label}
                  </Link>
                )}
              </div>
              {slide.hotspots && (
                <p className="mt-4 text-[0.65rem] uppercase tracking-luxe text-canvas/70">
                  Tap + to shop pieces from this lookbook
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 left-0 right-0">
        <div className="shell flex items-center gap-4">
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-canvas/50 text-ink transition-colors hover:bg-canvas hover:text-ink"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <div className="flex flex-1 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.seed}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group relative h-1 flex-1 overflow-hidden rounded-full bg-canvas/25"
              >
                <span
                  className={cn("absolute inset-y-0 left-0 bg-canvas", i === index ? "w-full" : "w-0")}
                  style={{ transition: i === index && playing ? "width 6.5s linear" : "width 0.3s" }}
                />
              </button>
            ))}
          </div>
          {slide.video && (
            <span className="hidden items-center gap-2 text-[0.65rem] uppercase tracking-luxe text-canvas/70 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" /> Film
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
