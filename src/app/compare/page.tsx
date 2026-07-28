"use client";

import Link from "next/link";
import { X, Check, Minus, GitCompareArrows } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { getProduct } from "@/lib/products";
import { getBrand } from "@/lib/brands";
import { Media } from "@/components/Media";
import { Stars } from "@/components/product/ProductDetail";
import { formatPrice } from "@/lib/utils";

export default function ComparePage() {
  const compare = useStore((s) => s.compare);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const clearCompare = useStore((s) => s.clearCompare);
  const hydrated = useHydrated();
  const items = hydrated ? compare.map((id) => getProduct(id)).filter(Boolean) : [];

  const rows: { label: string; render: (p: NonNullable<ReturnType<typeof getProduct>>) => React.ReactNode }[] = [
    { label: "Designer", render: (p) => getBrand(p.brandId)?.name },
    { label: "Price", render: (p) => formatPrice(p.price) },
    { label: "Rating", render: (p) => <div className="flex items-center gap-2"><Stars rating={p.rating} /> <span className="text-xs text-ink-muted">({p.reviewCount})</span></div> },
    { label: "Category", render: (p) => <span className="capitalize">{p.category} · {p.subcategory}</span> },
    { label: "Materials", render: (p) => p.materials },
    { label: "Available sizes", render: (p) => p.sizes.join(", ") },
    { label: "Colours", render: (p) => p.variants.map((v) => v.color).join(", ") },
    {
      label: "Conscious",
      render: (p) => (p.isSustainable ? <Check className="h-4 w-4 text-[#3a4a3b]" /> : <Minus className="h-4 w-4 text-ink-muted" />),
    },
    {
      label: "Exclusive",
      render: (p) => (p.isExclusive ? <Check className="h-4 w-4 text-gold" /> : <Minus className="h-4 w-4 text-ink-muted" />),
    },
  ];

  return (
    <div className="shell py-10 lg:py-14">
      <div className="flex items-center justify-between border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-4xl">Compare</h1>
          <p className="mt-1 text-sm text-ink-muted">Compare up to 4 pieces side by side</p>
        </div>
        {items.length > 0 && (
          <button onClick={clearCompare} className="text-xs uppercase tracking-luxe text-gold-deep hover:underline">
            Clear all
          </button>
        )}
      </div>

      {hydrated && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <GitCompareArrows className="h-10 w-10 text-line" strokeWidth={1} />
          <p className="mt-4 font-serif text-2xl">Nothing to compare yet</p>
          <p className="mt-1 text-sm text-ink-muted">Add pieces using the compare icon on any product.</p>
          <Link href="/shop" className="btn-primary mt-6">
            Browse pieces
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="w-32" />
                {items.map((p) => p && (
                  <th key={p.id} className="p-3 align-top">
                    <div className="relative">
                      <button
                        onClick={() => toggleCompare(p.id)}
                        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-canvas-raised/90 shadow"
                        aria-label="Remove from compare"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <Link href={`/product/${p.slug}`}>
                        <Media seed={p.variants[0].images[0]} swatches={[p.variants[0].hex]} ratio="portrait" label={p.name} className="rounded-xl" />
                      </Link>
                      <Link href={`/product/${p.slug}`} className="mt-3 block font-serif text-lg leading-tight hover:text-gold">
                        {p.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-line align-top">
                  <td className="py-4 pr-4 text-xs uppercase tracking-luxe text-ink-muted">{row.label}</td>
                  {items.map((p) => p && (
                    <td key={p.id} className="p-4 text-sm text-ink-soft">
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-line">
                <td />
                {items.map((p) => p && (
                  <td key={p.id} className="p-4">
                    <Link href={`/product/${p.slug}`} className="btn-outline w-full">
                      View piece
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
