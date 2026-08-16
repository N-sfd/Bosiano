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

  const total = products.reduce((sum, p) => sum + p.price, 0);

  function addEntireLook() {
    for (const product of products) {
      addToCart({
        productId: product.id,
        variantId: product.variantId,
        size: product.size,
        quantity: 1,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
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
  );
}
