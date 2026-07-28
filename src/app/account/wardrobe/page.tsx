"use client";

import Link from "next/link";
import { useState } from "react";
import { Shirt, Sparkles, Upload, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { getProduct, products, relatedProducts } from "@/lib/products";
import { Media } from "@/components/Media";
import { formatPrice, cn } from "@/lib/utils";
import { personalizedProducts } from "@/lib/personalize";

const sources = [
  { id: "purchase", label: "Purchased here" },
  { id: "external", label: "Bought elsewhere" },
  { id: "upload", label: "Outfit photo" },
  { id: "combination", label: "Favorite combo" },
  { id: "manual", label: "Manual add" },
] as const;

export default function WardrobePage() {
  const hydrated = useHydrated();
  const wardrobe = useStore((s) => s.wardrobe);
  const addToWardrobe = useStore((s) => s.addToWardrobe);
  const removeFromWardrobe = useStore((s) => s.removeFromWardrobe);
  const styleProfile = useStore((s) => s.styleProfile);
  const [source, setSource] = useState<(typeof sources)[number]["id"]>("manual");
  const [pickId, setPickId] = useState(products[0]?.id ?? "");
  const [photoLabel, setPhotoLabel] = useState("");

  const items = hydrated
    ? wardrobe
        .map((w) => ({ ...w, product: getProduct(w.productId) }))
        .filter((w) => w.product)
    : [];

  const owned = items.map((i) => i.product!);
  const aiSuggestions =
    owned.length > 0
      ? relatedProducts(owned[0], 6).filter((p) => !wardrobe.some((w) => w.productId === p.id))
      : personalizedProducts(styleProfile, 6);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-4xl">Digital wardrobe</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Purchases, external pieces, uploads, and combinations — powering AI stylist suggestions.
        </p>
      </div>

      <section className="rounded-2xl border border-line p-5">
        <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl">
          <Plus className="h-5 w-5 text-gold" /> Add to wardrobe
        </h2>
        <div className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <button
              key={s.id}
              onClick={() => setSource(s.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs uppercase tracking-luxe",
                source === s.id ? "border-ink bg-ink text-canvas" : "border-line text-ink-soft"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <select
            value={pickId}
            onChange={(e) => setPickId(e.target.value)}
            className="rounded-lg border border-line bg-canvas px-4 py-3 text-sm"
          >
            {products.slice(0, 20).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              addToWardrobe(pickId, source, undefined, photoLabel || undefined);
              setPhotoLabel("");
            }}
            className="btn-primary"
          >
            Save piece
          </button>
        </div>
        {(source === "upload" || source === "combination") && (
          <input
            value={photoLabel}
            onChange={(e) => setPhotoLabel(e.target.value)}
            placeholder={source === "upload" ? "Photo label (e.g. Milan evening)" : "Combo name"}
            className="mt-3 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-sm"
          />
        )}
        {source === "upload" && (
          <p className="mt-2 inline-flex items-center gap-2 text-xs text-ink-muted">
            <Upload className="h-3.5 w-3.5" /> Demo mode — photo metadata is stored locally.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl">
          <Shirt className="h-5 w-5 text-gold" /> Your pieces
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-ink-muted">No wardrobe items yet. Add purchases or try-on saves.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ product, source: src, photoLabel: label, notes }) => (
              <div key={product!.id} className="rounded-xl border border-line p-3">
                <Media
                  seed={product!.variants[0].images[0]}
                  swatches={[product!.variants[0].hex]}
                  ratio="portrait"
                  className="rounded-lg"
                />
                <p className="mt-2 font-serif text-lg leading-tight">{product!.name}</p>
                <p className="text-xs uppercase tracking-luxe text-ink-muted">{src}{label ? ` · ${label}` : ""}</p>
                {notes && <p className="mt-1 text-xs text-ink-soft">{notes}</p>}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm">{formatPrice(product!.price)}</span>
                  <button onClick={() => removeFromWardrobe(product!.id)} className="btn-ghost" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 flex items-center gap-2 font-serif text-2xl">
          <Sparkles className="h-5 w-5 text-gold" /> AI stylist from your wardrobe
        </h2>
        <p className="mb-4 text-sm text-ink-muted">Suggested pieces that complete what you already own.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiSuggestions.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group">
              <Media seed={p.variants[0].images[0]} swatches={[p.variants[0].hex]} ratio="portrait" className="rounded-xl" />
              <p className="mt-2 font-serif text-lg group-hover:text-gold">{p.name}</p>
              <p className="text-sm text-ink-muted">{formatPrice(p.price)}</p>
            </Link>
          ))}
        </div>
        <Link href="/stylist" className="btn-outline mt-6 inline-flex">
          Open AI stylist chat
        </Link>
      </section>
    </div>
  );
}
