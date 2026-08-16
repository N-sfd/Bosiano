"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { products } from "@/lib/products";
import type { AtelierProduct } from "@/types/atelier";
import { formatPrice } from "@/lib/utils";

type Props = {
  selectedIds: string[];
  onAdd: (product: AtelierProduct) => void;
};

const SUGGESTION_COUNT = 8;

export function AtelierProductSelector({ selectedIds, onAdd }: Props) {
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(
    () => products.filter((p) => !selectedIds.includes(p.id)).slice(0, SUGGESTION_COUNT),
    [selectedIds]
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line px-4 py-3 text-xs uppercase tracking-luxe text-ink-muted hover:border-ink hover:text-ink"
      >
        <Plus className="h-4 w-4" /> Add more pieces
      </button>
    );
  }

  return (
    <section className="rounded-2xl border border-line bg-canvas-card p-6">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-gold-deep">Add more pieces</p>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-ink-muted hover:text-ink">
          Close
        </button>
      </div>

      {suggestions.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Every piece is already in your look.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {suggestions.map((product) => {
            const variant = product.variants[0];
            const size = product.sizes[0] ?? "One Size";
            return (
              <button
                key={product.id}
                type="button"
                onClick={() =>
                  onAdd({
                    id: product.id,
                    variantId: variant.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    image: product.cardImage,
                    color: variant.color,
                    size,
                    category: product.category,
                  })
                }
                className="group text-left"
              >
                <div className="relative overflow-hidden rounded-lg bg-canvas-sunk">
                  <img src={product.cardImage} alt={product.name} className="aspect-[3/4] w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-void/0 opacity-0 transition group-hover:bg-void/40 group-hover:opacity-100">
                    <Plus className="h-6 w-6 text-canvas" />
                  </span>
                </div>
                <p className="mt-2 truncate text-xs font-medium">{product.name}</p>
                <p className="text-xs text-ink-muted">{formatPrice(product.price)}</p>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
