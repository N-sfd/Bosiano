"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductRail({ products, label = "products" }: { products: Product[]; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[0.65rem] font-medium uppercase tracking-luxe text-ink-muted">
          Scroll {label}
        </p>
        <div className="flex items-center gap-2" role="group" aria-label={`Browse ${label}`}>
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Previous ${label}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Next ${label}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={ref}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 sm:mx-0 sm:px-0"
        >
          {products.map((p) => (
            <div key={p.id} className="w-[70%] shrink-0 snap-start sm:w-[42%] lg:w-[23%]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Edge affordance on large screens */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-canvas to-transparent lg:block" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-10 bg-gradient-to-l from-canvas to-transparent lg:block" aria-hidden />
      </div>
    </div>
  );
}
