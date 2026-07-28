"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  Sparkles,
  RefreshCw,
  Play,
  Check,
  Link2,
  X,
} from "lucide-react";
import type { ShopLook } from "@/lib/types";
import { alternativesForHotspot, lookTotal, resolveLookProducts } from "@/lib/looks";
import { modifyLookWithAI } from "@/lib/stylist";
import { getBrand } from "@/lib/brands";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { cn, formatPrice } from "@/lib/utils";

export function LookDetailClient({ look }: { look: ShopLook }) {
  const [replacements, setReplacements] = useState<Record<string, string>>({});
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiNote, setAiNote] = useState<string | null>(null);

  const hydrated = useHydrated();
  const addToCart = useStore((s) => s.addToCart);
  const saveLook = useStore((s) => s.saveLook);
  const unsaveLook = useStore((s) => s.unsaveLook);
  const savedLooks = useStore((s) => s.savedLooks);
  const styleProfile = useStore((s) => s.styleProfile);

  const pieces = useMemo(() => resolveLookProducts(look, replacements), [look, replacements]);
  const total = useMemo(() => lookTotal(look, replacements), [look, replacements]);
  const saved = hydrated && savedLooks.some((l) => l.lookId === look.id);

  const addEntireLook = () => {
    pieces.forEach(({ product }) => {
      const size =
        product.sizes.find((s) =>
          ["tops", "bottoms"].some(() => s === styleProfile.sizes.tops || s === styleProfile.sizes.bottoms)
        ) ||
        product.sizes.find((s) => Object.values(product.variants[0].inventory).some((n) => n > 0)) ||
        product.sizes[0];
      if (!size) return;
      addToCart({
        productId: product.id,
        variantId: product.variants[0].id,
        size,
        quantity: 1,
      });
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const runAiModify = () => {
    const result = modifyLookWithAI(
      aiPrompt,
      pieces.map((p) => p.product.id),
      styleProfile
    );
    setAiNote(result.message);
    if (result.replacements.length) {
      const next = { ...replacements };
      result.replacements.forEach((r) => {
        const hotspot = look.hotspots.find((h) => (replacements[h.id] ?? h.productId) === r.fromId);
        if (hotspot) next[hotspot.id] = r.toId;
      });
      setReplacements(next);
    }
  };

  return (
    <div className="shell py-8 lg:py-12">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        <Link href="/lookbook" className="hover:text-ink">
          Lookbook
        </Link>
        <span>/</span>
        <span className="text-ink">{look.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative">
          <Media
            seed={look.hero}
            swatches={look.swatches}
            ratio="portrait"
            label={look.title}
            className="rounded-2xl"
            monogram={false}
            sizes="(max-width: 1024px) 100vw, 50vw"
          >
            {look.video && (
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 text-[0.65rem] uppercase tracking-luxe text-canvas">
                <Play className="h-3 w-3 fill-current" /> Runway film
              </div>
            )}
            {look.hotspots.map((h) => {
              const piece = pieces.find((p) => p.hotspot.id === h.id);
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
                  className={cn(
                    "group absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110",
                    activeHotspot === h.id ? "bg-gold text-canvas" : "bg-canvas-raised text-ink"
                  )}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  aria-label={`Shop ${h.label}`}
                >
                  <Plus className="h-4 w-4" />
                  <span className="pointer-events-none absolute left-10 z-10 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[0.65rem] uppercase tracking-luxe text-canvas group-hover:block">
                    {h.label}
                    {piece ? ` · ${formatPrice(piece.product.price)}` : ""}
                  </span>
                </button>
              );
            })}
          </Media>
          <p className="mt-3 text-xs text-ink-muted">
            Click hotspots on clothing, shoes, bags, and accessories to inspect or replace pieces.
          </p>
        </div>

        <div>
          <p className="eyebrow">{look.sourceLabel}</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight">{look.title}</h1>
          <p className="mt-3 max-w-md text-sm text-ink-soft">{look.dek}</p>
          <p className="mt-4 font-serif text-2xl">{formatPrice(total)} · {pieces.length} pieces</p>

          <div className="mt-6 flex flex-col gap-3">
            <button onClick={addEntireLook} className={cn("btn-primary w-full", added && "bg-[#3a4a3b]")}>
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Entire look added
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add entire look to bag
                </>
              )}
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => (saved ? unsaveLook(look.id) : saveLook(look.id, replacements))}
                className={cn("btn-outline flex-1", saved && "border-gold bg-gold text-canvas")}
              >
                <Heart className={cn("h-4 w-4", saved && "fill-current")} /> {saved ? "Saved" : "Save look"}
              </button>
              <button onClick={share} className="btn-outline !px-4" aria-label="Share look">
                {copied ? <Link2 className="h-4 w-4 text-gold" /> : <Share2 className="h-4 w-4" />}
              </button>
              <button onClick={() => setAiOpen(true)} className="btn-outline flex-1">
                <Sparkles className="h-4 w-4" /> Ask AI stylist
              </button>
            </div>
            <Link href={`/stylist?look=${look.slug}`} className="text-center text-xs uppercase tracking-luxe text-ink-muted hover:text-ink">
              Open full stylist chat with this look →
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {pieces.map(({ hotspot, product }) => {
              const brand = getBrand(product.brandId);
              const alts = activeHotspot === hotspot.id ? alternativesForHotspot(look, hotspot.id, 5) : [];
              return (
                <div key={hotspot.id} className="rounded-xl border border-line p-3">
                  <div className="flex gap-3">
                    <Link href={`/product/${product.slug}`} className="w-20 shrink-0 overflow-hidden rounded-lg">
                      <Media
                        seed={product.variants[0].images[0]}
                        swatches={[product.variants[0].hex]}
                        ratio="portrait"
                        monogram={false}
                        sizes="80px"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">
                        {hotspot.category} · {hotspot.label}
                      </p>
                      <Link href={`/product/${product.slug}`} className="font-serif text-lg hover:text-gold">
                        {product.name}
                      </Link>
                      <p className="text-xs text-ink-muted">{brand?.name}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-sm">{formatPrice(product.price)}</span>
                        <button
                          onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                          className="inline-flex items-center gap-1 text-xs text-gold-deep hover:underline"
                        >
                          <RefreshCw className="h-3 w-3" /> Replace
                        </button>
                      </div>
                    </div>
                  </div>
                  {alts.length > 0 && (
                    <div className="mt-3 grid grid-cols-5 gap-2 border-t border-line pt-3">
                      {alts.map((alt) => (
                        <button
                          key={alt.id}
                          onClick={() => {
                            setReplacements((r) => ({ ...r, [hotspot.id]: alt.id }));
                            setActiveHotspot(null);
                          }}
                          className="overflow-hidden rounded-md border border-transparent hover:border-ink"
                          title={alt.name}
                        >
                          <Media
                            seed={alt.variants[0].images[0]}
                            swatches={[alt.variants[0].hex]}
                            ratio="portrait"
                            monogram={false}
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {aiOpen && (
        <div className="fixed inset-0 z-[140] flex items-end justify-center sm:items-center" role="dialog">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setAiOpen(false)} aria-hidden />
          <div className="relative w-full max-w-md rounded-t-3xl bg-canvas-raised p-6 sm:rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-gold" /> AI stylist
                </p>
                <h2 className="mt-1 font-serif text-2xl">Modify this look</h2>
              </div>
              <button className="btn-ghost" onClick={() => setAiOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              Try “make it more formal”, “cheaper alternatives”, or “add a warmer layer”.
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={3}
              className="mt-4 w-full border border-line bg-canvas px-4 py-3 text-sm focus:border-ink focus:outline-none"
              placeholder="How should we restyle this look?"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {["Make it more formal", "Find cheaper alternatives", "Add a warmer layer"].map((s) => (
                <button
                  key={s}
                  onClick={() => setAiPrompt(s)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-ink"
                >
                  {s}
                </button>
              ))}
            </div>
            <button className="btn-primary mt-4 w-full" onClick={runAiModify} disabled={!aiPrompt.trim()}>
              Restyle look
            </button>
            {aiNote && <p className="mt-3 text-sm text-ink-soft">{aiNote}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
