"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { AtelierProduct } from "@/types/atelier";
import { useStore } from "@/store/useStore";
import { cn, formatPrice } from "@/lib/utils";

type Props = {
  products: AtelierProduct[];
};

export function AtelierAddToBag({ products }: Props) {
  const addToCart = useStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);
  const [skipped, setSkipped] = useState<string[]>([]);

  const total = products.reduce((sum, p) => sum + p.price, 0);

  function addEntireLook() {
    const missingSize: string[] = [];
    for (const product of products) {
      if (!product.size) {
        missingSize.push(product.name);
        continue;
      }
      addToCart({
        productId: product.id,
        variantId: product.variantId,
        size: product.size,
        quantity: 1,
      });
    }
    setSkipped(missingSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      <button
        type="button"
        onClick={addEntireLook}
        disabled={!products.length}
        className={cn("btn-primary w-full", added && "bg-[#3a4a3b]")}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" /> Added to bag
          </>
        ) : (
          `Add Entire Look to Bag — ${formatPrice(total)}`
        )}
      </button>
      {added &&
        skipped.map((name) => (
          <p key={name} className="mt-2 text-xs text-gold-deep">
            Choose a size for {name} before adding the look.
          </p>
        ))}
    </div>
  );
}
