"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, GitCompareArrows, Bell, ScanSearch } from "lucide-react";
import type { Product } from "@/lib/types";
import { getBrand } from "@/lib/brands";
import { estimatedRestock } from "@/lib/products";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { cn, formatPrice } from "@/lib/utils";

/** Consistent badge priority: Sale → New → Exclusive → Conscious (+ merch overlays) */
function productBadges(
  product: Product,
  custom?: string[]
): { key: string; label: string; className?: string }[] {
  const badges: { key: string; label: string; className?: string }[] = [];
  const customSet = new Set(custom ?? []);

  if (product.compareAtPrice || customSet.has("sale"))
    badges.push({ key: "sale", label: "Sale", className: "bg-gold text-canvas" });
  if (product.isNew || customSet.has("new")) badges.push({ key: "new", label: "New" });
  if (product.isExclusive || customSet.has("exclusive"))
    badges.push({ key: "exclusive", label: "Exclusive" });
  if (product.isSustainable || customSet.has("conscious"))
    badges.push({ key: "conscious", label: "Conscious", className: "bg-[#3a4a3b] text-canvas" });
  if (customSet.has("limited")) badges.push({ key: "limited", label: "Limited" });
  if (customSet.has("trending")) badges.push({ key: "trending", label: "Trending" });
  if (customSet.has("editors-pick"))
    badges.push({ key: "editors-pick", label: "Editor's Pick", className: "bg-ink text-canvas" });
  return badges.slice(0, 3);
}

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const brand = getBrand(product.brandId);
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = product.variants[variantIndex];
  const wishlist = useStore((s) => s.wishlist);
  const compare = useStore((s) => s.compare);
  const notifyList = useStore((s) => s.notifyList);
  const restockDates = useStore((s) => s.restockDates);
  const productBadgesMap = useStore((s) => s.productBadges);
  const pinned = useStore((s) => s.pinnedProductIds);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const toggleNotify = useStore((s) => s.toggleNotify);
  const hydrated = useHydrated();
  const wished = hydrated && wishlist.includes(product.id);
  const comparing = hydrated && compare.includes(product.id);
  const notified = hydrated && notifyList.includes(product.id);
  const isPinned = hydrated && pinned.includes(product.id);

  const stock = Object.values(variant.inventory).reduce((a, b) => a + b, 0);
  const soldOut = stock === 0;
  const restock = soldOut
    ? hydrated && restockDates[product.id]
      ? restockDates[product.id]
      : estimatedRestock(product.id)
    : null;
  const badges = productBadges(product, hydrated ? productBadgesMap[product.id] : undefined);

  return (
    <div className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-xl">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Media
            seed={variant.images[0]}
            swatches={[variant.hex]}
            ratio="portrait"
            label={product.name}
            priority={priority}
            className={cn(
              "[&_img]:duration-700 [&_img]:ease-silk group-hover:[&_img]:scale-105",
              soldOut && "opacity-90"
            )}
          />
        </Link>

        {/* Dynamic badges — fixed order for scannability */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {isPinned && (
            <Tag className="bg-ink text-canvas">Pinned</Tag>
          )}
          {badges.map((b) => (
            <Tag key={b.key} className={b.className}>
              {b.label}
            </Tag>
          ))}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <IconToggle
            active={!!wished}
            onClick={() => toggleWishlist(product.id)}
            label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-4 w-4", wished && "fill-current")} strokeWidth={1.5} />
          </IconToggle>
          <IconToggle
            active={!!comparing}
            onClick={() => toggleCompare(product.id)}
            label={comparing ? "Remove from compare" : "Add to compare"}
          >
            <GitCompareArrows className="h-4 w-4" strokeWidth={1.5} />
          </IconToggle>
          <Link
            href={`/product/${product.slug}#similar`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-canvas-raised/90 text-ink opacity-0 shadow-sm backdrop-blur transition-all group-hover:opacity-100 focus:opacity-100"
            aria-label="Find similar"
          >
            <ScanSearch className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>

        {soldOut && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/70 to-transparent px-3 pb-3 pt-10">
            <p className="text-center text-[0.65rem] font-semibold uppercase tracking-luxe text-canvas">Sold Out</p>
            {restock && (
              <p className="mt-0.5 text-center text-[0.65rem] text-canvas/75">Est. restock {restock}</p>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleNotify(product.id);
              }}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full bg-canvas px-3 py-2 text-[0.65rem] font-medium uppercase tracking-luxe text-ink transition-colors hover:bg-gold hover:text-canvas"
            >
              <Bell className="h-3 w-3" />
              {notified ? "We'll notify you" : "Notify me when available"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Link
            href={`/designers/${brand?.slug}`}
            className="link-underline text-[0.7rem] font-medium uppercase tracking-[0.12em] text-ink-muted"
          >
            {brand?.name}
          </Link>
          <div className="flex items-center gap-1.5">
            {product.variants.slice(0, 4).map((v, i) => (
              <button
                key={v.id}
                onMouseEnter={() => setVariantIndex(i)}
                onClick={() => setVariantIndex(i)}
                aria-label={`View ${v.color}`}
                className={cn(
                  "h-3 w-3 rounded-full border transition-transform",
                  i === variantIndex ? "scale-110 border-ink" : "border-line"
                )}
                style={{ background: v.hex }}
              />
            ))}
          </div>
        </div>
        <Link href={`/product/${product.slug}`} className="font-serif text-lg leading-snug hover:text-gold">
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className={cn("text-sm", product.compareAtPrice && "text-gold-deep")}>
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-ink-muted line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
          {!soldOut && stock <= 6 && (
            <span className="ml-auto text-[0.65rem] uppercase tracking-luxe text-gold-deep">Low stock</span>
          )}
        </div>
        <Link
          href={`/shop?sub=${encodeURIComponent(product.subcategory)}`}
          className="mt-1 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-luxe text-ink-muted opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
        >
          <ScanSearch className="h-3 w-3" /> Find similar
        </Link>
      </div>
    </div>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full bg-canvas-raised/95 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-luxe text-ink shadow-sm",
        className
      )}
    >
      {children}
    </span>
  );
}

function IconToggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-all",
        active
          ? "border-gold bg-gold text-canvas"
          : "border-line bg-canvas-raised/90 text-ink opacity-0 group-hover:opacity-100 focus:opacity-100"
      )}
    >
      {children}
    </button>
  );
}
