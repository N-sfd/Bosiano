"use client";

import { X } from "lucide-react";
import type { AtelierProduct } from "@/types/atelier";
import { formatPrice } from "@/lib/utils";

type Props = {
  products: AtelierProduct[];
  onRemove: (productId: string) => void;
};

export function AtelierSelectedLook({ products, onRemove }: Props) {
  const total = products.reduce((sum, p) => sum + p.price, 0);

  if (products.length === 0) {
    return (
      <section className="rounded-2xl border border-line bg-canvas-card p-6 text-center">
        <p className="eyebrow text-gold-deep">Your Look</p>
        <p className="mt-2 text-sm text-ink-soft">
          Your Virtual Atelier is empty. Add a piece from any product page to get started.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-line bg-canvas-card p-6">
      <p className="eyebrow text-gold-deep">Selected Pieces</p>
      <div className="mt-4 divide-y divide-line">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 py-3">
            <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-canvas-sunk">
              {product.image && <img src={product.image} alt={product.name} className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="text-xs text-ink-muted">
                {product.color}
                {product.color && product.size ? " · " : ""}
                {product.size}
              </p>
            </div>
            <p className="text-sm font-medium">{formatPrice(product.price)}</p>
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="rounded-full p-1.5 text-ink-muted hover:bg-canvas-sunk hover:text-ink"
              aria-label={`Remove ${product.name}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <p className="text-sm font-medium">Total</p>
        <p className="font-serif text-xl">{formatPrice(total)}</p>
      </div>
    </section>
  );
}
