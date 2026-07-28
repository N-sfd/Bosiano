"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductRail({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:mx-0 sm:px-0"
      >
        {products.map((p) => (
          <div key={p.id} className="w-[70%] shrink-0 snap-start sm:w-[42%] lg:w-[23%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="mt-4 hidden justify-end gap-2 lg:flex">
        <button onClick={() => scroll(-1)} aria-label="Scroll left" className="btn-outline !px-3 !py-3">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button onClick={() => scroll(1)} aria-label="Scroll right" className="btn-outline !px-3 !py-3">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
