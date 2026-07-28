"use client";

import { products } from "@/lib/products";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { ProductRail } from "./ProductRail";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function RecentlyViewedRail({ excludeId }: { excludeId?: string }) {
  const hydrated = useHydrated();
  const recentlyViewed = useStore((s) => s.recentlyViewed);

  if (!hydrated) return null;

  const list = recentlyViewed
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 8) as typeof products;

  if (list.length === 0) return null;

  return (
    <section className="shell py-14 lg:py-16">
      <SectionHeader eyebrow="Your browsing" title="Recently viewed" href="/account" />
      <div className="mt-8">
        <ProductRail products={list} />
      </div>
    </section>
  );
}
