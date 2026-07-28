"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { getBoutique } from "@/lib/stores";

export function StoreAvailability({ product }: { product: Product }) {
  const reserve = useStore((s) => s.reserveInStore);
  const styleProfile = useStore((s) => s.styleProfile);
  const hydrated = useHydrated();
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-line p-5">
      <p className="eyebrow inline-flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5" /> Store availability
      </p>
      <ul className="mt-3 space-y-3">
        {product.stores.map((s) => {
          const boutique = getBoutique(s.id);
          return (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span>
                {boutique ? (
                  <Link href={`/stores/${boutique.slug}`} className="font-medium hover:text-gold">
                    {s.name}
                  </Link>
                ) : (
                  <span className="font-medium">{s.name}</span>
                )}
                <span className="mt-0.5 block text-xs text-ink-muted">{s.city}</span>
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-luxe",
                    s.stock === "in-stock" && "bg-[#3a4a3b]/10 text-[#3a4a3b]",
                    s.stock === "low" && "bg-gold/15 text-gold-deep",
                    s.stock === "out" && "bg-canvas-sunk text-ink-muted"
                  )}
                >
                  {s.stock === "in-stock" ? "In stock" : s.stock === "low" ? "Low stock" : "Out of stock"}
                </span>
                {s.stock !== "out" && hydrated && (
                  <button
                    className="text-[0.65rem] uppercase tracking-luxe text-gold-deep"
                    onClick={() => {
                      const size = product.sizes.includes(styleProfile.sizes.tops)
                        ? styleProfile.sizes.tops
                        : product.sizes[0];
                      reserve(s.id, product.id, size);
                      setNote(`Reserved at ${s.name}`);
                    }}
                  >
                    Reserve
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {note && <p className="mt-3 text-xs text-gold-deep">{note}</p>}
      <Link href="/stores" className="mt-4 inline-block text-xs uppercase tracking-luxe hover:text-gold">
        Store locator & fitting rooms →
      </Link>
    </div>
  );
}
