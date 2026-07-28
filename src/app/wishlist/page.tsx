"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Bell,
  Share2,
  ShoppingBag,
  Lock,
  Globe,
  ArrowRightLeft,
  Check,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { getProduct, estimatedRestock, totalStock } from "@/lib/products";
import { Media } from "@/components/Media";
import { formatPrice, cn } from "@/lib/utils";
import { getBrand } from "@/lib/brands";

export default function WishlistPage() {
  const hydrated = useHydrated();
  const wishlists = useStore((s) => s.wishlists);
  const removeFromWishlistList = useStore((s) => s.removeFromWishlistList);
  const moveWishlistItem = useStore((s) => s.moveWishlistItem);
  const setWishlistVisibility = useStore((s) => s.setWishlistVisibility);
  const setWishlistAlerts = useStore((s) => s.setWishlistAlerts);
  const shareWishlist = useStore((s) => s.shareWishlist);
  const moveWishlistListToCart = useStore((s) => s.moveWishlistListToCart);
  const toggleNotify = useStore((s) => s.toggleNotify);
  const notifyList = useStore((s) => s.notifyList);
  const styleProfile = useStore((s) => s.styleProfile);

  const [activeId, setActiveId] = useState("favorites");
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [moved, setMoved] = useState(false);

  const list = wishlists.find((l) => l.id === activeId) ?? wishlists[0];

  const items = useMemo(() => {
    if (!hydrated || !list) return [];
    return list.productIds
      .map((id) => {
        const product = getProduct(id);
        if (!product) return null;
        const savedPrice = list.priceAtSave[id] ?? product.price;
        const stock = totalStock(product);
        const priceDropped = product.price < savedPrice;
        const lowStock = stock > 0 && stock <= 6;
        const out = stock <= 0;
        return {
          product,
          savedPrice,
          priceDropped,
          dropAmount: savedPrice - product.price,
          lowStock,
          out,
          restock: out ? estimatedRestock(product.id) : null,
        };
      })
      .filter(Boolean) as {
      product: NonNullable<ReturnType<typeof getProduct>>;
      savedPrice: number;
      priceDropped: boolean;
      dropAmount: number;
      lowStock: boolean;
      out: boolean;
      restock: string | null;
    }[];
  }, [hydrated, list]);

  if (!hydrated) {
    return (
      <div className="shell py-10">
        <h1 className="font-serif text-4xl">Wishlists</h1>
      </div>
    );
  }

  return (
    <div className="shell py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-4xl">Wishlists</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Favorites, Wedding, Vacation, Workwear, Gifts, Seasonal — with alerts and sharing.
          </p>
        </div>
        {list && (
          <div className="flex flex-wrap gap-2">
            <button
              className="btn-outline !py-2.5"
              onClick={() => {
                moveWishlistListToCart(list.id);
                setMoved(true);
                setTimeout(() => setMoved(false), 2000);
              }}
              disabled={!items.length}
            >
              <ShoppingBag className="h-4 w-4" /> {moved ? "Added to bag" : "Move list to cart"}
            </button>
            <button
              className="btn-outline !py-2.5"
              onClick={() => {
                const token = shareWishlist(list.id);
                const url = `${typeof window !== "undefined" ? window.location.origin : ""}/wishlist/share/${token}`;
                navigator.clipboard?.writeText(url);
                setShareMsg("Share link copied");
                setTimeout(() => setShareMsg(null), 2000);
              }}
            >
              <Share2 className="h-4 w-4" /> Share list
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {wishlists.map((l) => (
          <button
            key={l.id}
            onClick={() => setActiveId(l.id)}
            className={cn(
              "rounded-full px-4 py-2 text-xs uppercase tracking-luxe transition-colors",
              activeId === l.id ? "bg-ink text-canvas" : "border border-line text-ink-soft hover:border-ink"
            )}
          >
            {l.name} · {l.productIds.length}
          </button>
        ))}
      </div>

      {list && (
        <div className="mt-6 grid gap-4 rounded-xl border border-line bg-canvas-raised p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex items-center justify-between gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5">
              {list.visibility === "public" ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {list.visibility === "public" ? "Public" : "Private"}
            </span>
            <button
              className="text-xs uppercase tracking-luxe text-gold-deep hover:underline"
              onClick={() =>
                setWishlistVisibility(list.id, list.visibility === "public" ? "private" : "public")
              }
            >
              Toggle
            </button>
          </label>
          {(
            [
              ["priceDrop", "Price-drop alerts"],
              ["lowStock", "Low-stock alerts"],
              ["backInStock", "Back-in-stock"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-gold" /> {label}
              </span>
              <input
                type="checkbox"
                checked={list.alerts[key]}
                onChange={(e) => setWishlistAlerts(list.id, { [key]: e.target.checked })}
              />
            </label>
          ))}
          {shareMsg && (
            <p className="sm:col-span-2 lg:col-span-4 text-xs text-gold-deep">
              <Check className="mr-1 inline h-3.5 w-3.5" /> {shareMsg}
            </p>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart className="h-10 w-10 text-line" strokeWidth={1} />
          <p className="mt-4 font-serif text-2xl">{list?.name ?? "List"} is empty</p>
          <p className="mt-1 text-sm text-ink-muted">Save pieces from product pages into this list.</p>
          <Link href="/shop" className="btn-primary mt-6">
            Explore the edit
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map(({ product, savedPrice, priceDropped, dropAmount, lowStock, out, restock }) => {
            const brand = getBrand(product.brandId);
            const size =
              product.sizes.find((s) => s === styleProfile.sizes.tops || s === styleProfile.sizes.bottoms) ||
              product.sizes[0];
            return (
              <div key={product.id} className="flex flex-col gap-4 rounded-xl border border-line p-4 sm:flex-row sm:items-center">
                <Link href={`/product/${product.slug}`} className="w-full shrink-0 overflow-hidden rounded-lg sm:w-24">
                  <Media
                    seed={product.variants[0].images[0]}
                    swatches={[product.variants[0].hex]}
                    ratio="portrait"
                    monogram={false}
                    sizes="96px"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{brand?.name}</p>
                  <Link href={`/product/${product.slug}`} className="font-serif text-xl hover:text-gold">
                    {product.name}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <span className={cn(priceDropped && "text-gold-deep")}>{formatPrice(product.price)}</span>
                    {priceDropped && list?.alerts.priceDrop && (
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[0.65rem] uppercase tracking-luxe text-gold-deep">
                        Price drop −{formatPrice(dropAmount)}
                      </span>
                    )}
                    {lowStock && list?.alerts.lowStock && (
                      <span className="rounded-full bg-canvas-sunk px-2 py-0.5 text-[0.65rem] uppercase tracking-luxe text-ink-muted">
                        Low stock
                      </span>
                    )}
                    {out && (
                      <span className="rounded-full bg-canvas-sunk px-2 py-0.5 text-[0.65rem] uppercase tracking-luxe text-ink-muted">
                        Out of stock{restock ? ` · est. ${restock}` : ""}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">Saved at {formatPrice(savedPrice)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!out && (
                    <button
                      className="btn-outline !py-2"
                      onClick={() =>
                        useStore.getState().addToCart({
                          productId: product.id,
                          variantId: product.variants[0].id,
                          size: size || product.sizes[0],
                          quantity: 1,
                        })
                      }
                    >
                      <ShoppingBag className="h-4 w-4" /> Add to bag
                    </button>
                  )}
                  {out && list?.alerts.backInStock && (
                    <button
                      className={cn("btn-outline !py-2", notifyList.includes(product.id) && "border-gold")}
                      onClick={() => toggleNotify(product.id)}
                    >
                      <Bell className="h-4 w-4" />
                      {notifyList.includes(product.id) ? "Alert on" : "Back-in-stock"}
                    </button>
                  )}
                  <select
                    className="border border-line bg-canvas px-2 py-2 text-xs"
                    defaultValue=""
                    onChange={(e) => {
                      if (!e.target.value) return;
                      moveWishlistItem(product.id, list!.id, e.target.value);
                      e.target.value = "";
                    }}
                    aria-label="Move to another list"
                  >
                    <option value="">Move to…</option>
                    {wishlists
                      .filter((l) => l.id !== list?.id)
                      .map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                  </select>
                  <button
                    className="btn-ghost"
                    onClick={() => removeFromWishlistList(product.id, list!.id)}
                    aria-label="Remove"
                  >
                    <ArrowRightLeft className="h-4 w-4 rotate-90" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
