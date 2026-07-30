"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, Check } from "lucide-react";
import { products as allProducts, totalStock, allMaterialTags, allCountries } from "@/lib/products";
import { brands } from "@/lib/brands";
import { semanticSearch } from "@/lib/search";
import { ProductCard } from "@/components/product/ProductCard";
import { useUI } from "@/store/useUI";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OptionChip } from "@/components/ui/OptionChip";
import { Select } from "@/components/ui/Select";
import { Sheet } from "@/components/ui/Sheet";

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "popular", label: "Most Loved" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

const priceBands = [
  { id: "0-250", label: "Under $250", min: 0, max: 250 },
  { id: "250-500", label: "$250 – $500", min: 250, max: 500 },
  { id: "500-1000", label: "$500 – $1,000", min: 500, max: 1000 },
  { id: "1000-99999", label: "$1,000+", min: 1000, max: 99999 },
];

const ratingBands = [
  { id: "4.5", label: "4.5+" },
  { id: "4", label: "4.0+" },
  { id: "3.5", label: "3.5+" },
];

export function ShopClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { filterOpen, setFilter } = useUI();
  const hydrated = useHydrated();
  const pinnedProductIds = useStore((s) => s.pinnedProductIds);
  const trackAnalytics = useStore((s) => s.trackAnalytics);

  const category = params.get("category") ?? "";
  const sub = params.get("sub") ?? "";
  const brand = params.get("brand") ?? "";
  const color = params.get("color") ?? "";
  const size = params.get("size") ?? "";
  const material = params.get("material") ?? "";
  const country = params.get("country") ?? "";
  const priceBand = params.get("price") ?? "";
  const ratingMin = params.get("rating") ?? "";
  const sale = params.get("sale") === "true";
  const conscious = params.get("conscious") === "true";
  const inStock = params.get("instock") === "true";
  const isNew = params.get("new") === "true";
  const exclusive = params.get("exclusive") === "true";
  const preorder = params.get("preorder") === "true";
  const sameDay = params.get("sameday") === "true";
  const sort = params.get("sort") ?? "featured";
  const q = params.get("q") ?? "";

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    if (value) trackAnalytics("filter", `${key}=${value}`);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const toggleBool = (key: string, current: boolean) => setParam(key, current ? null : "true");

  const facets = useMemo(() => {
    const cats = [...new Set(allProducts.map((p) => p.category))];
    const subs = [
      ...new Set(allProducts.filter((p) => !category || p.category === category).map((p) => p.subcategory)),
    ];
    const colors = [...new Set(allProducts.flatMap((p) => p.variants.map((v) => v.color)))];
    const sizes = [...new Set(allProducts.flatMap((p) => p.sizes))];
    return { cats, subs, colors, sizes, materials: allMaterialTags(), countries: allCountries() };
  }, [category]);

  const filtered = useMemo(() => {
    const semanticIds = q
      ? new Set(semanticSearch(q, 100).map((r) => r.product.id))
      : null;

    let list = allProducts.filter((p) => {
      if (semanticIds && !semanticIds.has(p.id)) return false;
      if (category && p.category !== category && p.gender !== category) return false;
      if (sub && p.subcategory !== sub) return false;
      if (brand && p.brandId !== brand) return false;
      if (color && !p.variants.some((v) => v.color === color)) return false;
      if (size && !p.sizes.includes(size)) return false;
      if (material && !p.materialTags.includes(material)) return false;
      if (country && p.countryOfOrigin !== country) return false;
      if (sale && !p.compareAtPrice) return false;
      if (conscious && !p.isSustainable) return false;
      if (inStock && totalStock(p) <= 0) return false;
      if (isNew && !p.isNew) return false;
      if (exclusive && !p.isExclusive) return false;
      if (preorder && !p.isPreorder) return false;
      if (sameDay && !p.sameDayEligible) return false;
      if (ratingMin && p.rating < Number(ratingMin)) return false;
      if (priceBand) {
        const band = priceBands.find((b) => b.id === priceBand);
        if (band && (p.price < band.min || p.price > band.max)) return false;
      }
      return true;
    });

    // Preserve semantic ranking when searching
    if (semanticIds) {
      const order = [...semanticIds];
      list = list.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    } else {
      switch (sort) {
        case "new":
          list = list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
          break;
        case "popular":
          list = list.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case "price-asc":
          list = list.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          list = list.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          list = list.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    // Merchandising: pinned products float to the top (after search ranking)
    if (hydrated && pinnedProductIds.length) {
      const pinRank = (id: string) => {
        const i = pinnedProductIds.indexOf(id);
        return i === -1 ? 999 : i;
      };
      list = [...list].sort((a, b) => pinRank(a.id) - pinRank(b.id));
    }

    return list;
  }, [
    category,
    sub,
    brand,
    color,
    size,
    material,
    country,
    sale,
    conscious,
    inStock,
    isNew,
    exclusive,
    preorder,
    sameDay,
    ratingMin,
    priceBand,
    sort,
    q,
    hydrated,
    pinnedProductIds,
  ]);

  const activeFilters = [
    category && { key: "category", label: category },
    sub && { key: "sub", label: sub },
    brand && { key: "brand", label: brands.find((b) => b.id === brand)?.name ?? brand },
    color && { key: "color", label: color },
    size && { key: "size", label: `Size ${size}` },
    material && { key: "material", label: material },
    country && { key: "country", label: country },
    priceBand && { key: "price", label: priceBands.find((b) => b.id === priceBand)?.label },
    ratingMin && { key: "rating", label: `${ratingMin}+ stars` },
    sale && { key: "sale", label: "On Sale" },
    conscious && { key: "conscious", label: "Sustainable" },
    inStock && { key: "instock", label: "In stock" },
    isNew && { key: "new", label: "New arrivals" },
    exclusive && { key: "exclusive", label: "Exclusive" },
    preorder && { key: "preorder", label: "Pre-order" },
    sameDay && { key: "sameday", label: "Same-day delivery" },
    q && { key: "q", label: `“${q}”` },
  ].filter(Boolean) as { key: string; label: string }[];

  const Filters = (
    <div className="space-y-8">
      <FacetGroup title="Availability">
        <FacetChip active={inStock} onClick={() => toggleBool("instock", inStock)}>
          In stock
        </FacetChip>
        <FacetChip active={preorder} onClick={() => toggleBool("preorder", preorder)}>
          Pre-order
        </FacetChip>
        <FacetChip active={sameDay} onClick={() => toggleBool("sameday", sameDay)}>
          Same-day delivery
        </FacetChip>
      </FacetGroup>

      <FacetGroup title="Highlights">
        <FacetChip active={isNew} onClick={() => toggleBool("new", isNew)}>
          New arrivals
        </FacetChip>
        <FacetChip active={sale} onClick={() => toggleBool("sale", sale)}>
          Sale
        </FacetChip>
        <FacetChip active={exclusive} onClick={() => toggleBool("exclusive", exclusive)}>
          Exclusive
        </FacetChip>
        <FacetChip active={conscious} onClick={() => toggleBool("conscious", conscious)}>
          Sustainable
        </FacetChip>
      </FacetGroup>

      <FacetGroup title="Category">
        {facets.cats.map((c) => (
          <FacetChip key={c} active={category === c} onClick={() => setParam("category", category === c ? null : c)}>
            {c}
          </FacetChip>
        ))}
      </FacetGroup>

      <FacetGroup title="Type">
        {facets.subs.map((s) => (
          <FacetChip key={s} active={sub === s} onClick={() => setParam("sub", sub === s ? null : s)}>
            {s}
          </FacetChip>
        ))}
      </FacetGroup>

      <FacetGroup title="Designer">
        {brands.map((b) => (
          <FacetChip key={b.id} active={brand === b.id} onClick={() => setParam("brand", brand === b.id ? null : b.id)}>
            {b.name}
          </FacetChip>
        ))}
      </FacetGroup>

      <FacetGroup title="Price">
        {priceBands.map((b) => (
          <FacetChip key={b.id} active={priceBand === b.id} onClick={() => setParam("price", priceBand === b.id ? null : b.id)}>
            {b.label}
          </FacetChip>
        ))}
      </FacetGroup>

      <FacetGroup title="Customer rating">
        {ratingBands.map((b) => (
          <FacetChip key={b.id} active={ratingMin === b.id} onClick={() => setParam("rating", ratingMin === b.id ? null : b.id)}>
            {b.label}
          </FacetChip>
        ))}
      </FacetGroup>

      <FacetGroup title="Material">
        {facets.materials.map((m) => (
          <FacetChip key={m} active={material === m} onClick={() => setParam("material", material === m ? null : m)}>
            {m}
          </FacetChip>
        ))}
      </FacetGroup>

      <FacetGroup title="Country of manufacture">
        {facets.countries.map((c) => (
          <FacetChip key={c} active={country === c} onClick={() => setParam("country", country === c ? null : c)}>
            {c}
          </FacetChip>
        ))}
      </FacetGroup>

      <FacetGroup title="Colour">
        <div className="flex flex-wrap gap-2">
          {facets.colors.slice(0, 14).map((c) => (
            <OptionChip
              key={c}
              shape="pill"
              size="sm"
              selected={color === c}
              onClick={() => setParam("color", color === c ? null : c)}
            >
              {c}
            </OptionChip>
          ))}
        </div>
      </FacetGroup>

      <FacetGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((s) => (
            <OptionChip
              key={s}
              shape="box"
              size="sm"
              selected={size === s}
              onClick={() => setParam("size", size === s ? null : s)}
            >
              {s}
            </OptionChip>
          ))}
        </div>
      </FacetGroup>
    </div>
  );

  return (
    <div className="shell py-8 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="font-serif text-3xl capitalize sm:text-4xl">
            {q ? `“${q}”` : category ? category : "All Pieces"}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">{filtered.length} items · filters update instantly</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setFilter(true)} className="lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </Button>
          <Select
            label="Sort"
            value={sort}
            onChange={(v) => setParam("sort", v)}
            options={sortOptions}
            aria-label="Sort products"
          />
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          {activeFilters.map((f) => (
            <Badge key={f.key} onRemove={() => setParam(f.key, null)}>
              {f.label}
            </Badge>
          ))}
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-xs uppercase tracking-luxe text-gold-deep hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="grid gap-8 pt-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{Filters}</aside>
        <div>
          {filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <p className="font-serif text-2xl">No pieces match your filters</p>
              <button onClick={() => router.push(pathname, { scroll: false })} className="btn-outline mt-4">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet
        open={filterOpen}
        onClose={() => setFilter(false)}
        title="Filter & Sort"
        footer={
          <Button onClick={() => setFilter(false)} className="mt-8 w-full">
            <Check className="h-4 w-4" /> Show {filtered.length} results
          </Button>
        }
      >
        {Filters}
      </Sheet>
    </div>
  );
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow mb-3">{title}</h3>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function FacetChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between text-left text-sm capitalize transition-colors",
        active ? "font-medium text-gold" : "text-ink-soft hover:text-ink"
      )}
    >
      {children}
      {active && <Check className="h-3.5 w-3.5" />}
    </button>
  );
}
