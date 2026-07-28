"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Globe, Heart } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { getProduct } from "@/lib/products";
import { Media } from "@/components/Media";
import { formatPrice } from "@/lib/utils";
import { getBrand } from "@/lib/brands";

export default function SharedWishlistPage({ params }: { params: { token: string } }) {
  const hydrated = useHydrated();
  const wishlists = useStore((s) => s.wishlists);
  const list = useMemo(
    () => wishlists.find((l) => l.shareToken === params.token && l.visibility === "public"),
    [wishlists, params.token]
  );

  const items = useMemo(() => {
    if (!list) return [];
    return list.productIds.map((id) => getProduct(id)).filter(Boolean);
  }, [list]);

  if (!hydrated) {
    return (
      <div className="shell py-16">
        <h1 className="font-serif text-4xl">Shared wishlist</h1>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="shell flex flex-col items-center py-24 text-center">
        <Globe className="h-8 w-8 text-ink-muted" />
        <h1 className="mt-4 font-serif text-3xl">List not found or private</h1>
        <p className="mt-2 text-sm text-ink-muted">Ask the owner to share a public link.</p>
        <Link href="/shop" className="btn-primary mt-6">
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-10 lg:py-14">
      <p className="eyebrow inline-flex items-center gap-2">
        <Heart className="h-3.5 w-3.5 text-gold" /> Shared wishlist
      </p>
      <h1 className="mt-2 font-serif text-4xl">{list.name}</h1>
      <p className="mt-1 text-sm text-ink-muted">{items.length} pieces · curated on Bosiano</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) =>
          p ? (
            <Link key={p.id} href={`/product/${p.slug}`} className="group">
              <Media seed={p.variants[0].images[0]} swatches={[p.variants[0].hex]} ratio="portrait" className="rounded-xl" />
              <p className="mt-2 text-[0.65rem] uppercase tracking-luxe text-ink-muted">
                {getBrand(p.brandId)?.name}
              </p>
              <p className="font-serif text-xl group-hover:text-gold">{p.name}</p>
              <p className="text-sm">{formatPrice(p.price)}</p>
            </Link>
          ) : null
        )}
      </div>
    </div>
  );
}
