"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Search, BookOpen, User, Layers, Tag } from "lucide-react";
import { discoverAll, searchSuggestions, trendingSearches } from "@/lib/search";
import { personalizedSearch } from "@/lib/personalize";
import { ProductCard } from "@/components/product/ProductCard";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "All" },
  { id: "product", label: "Products" },
  { id: "designer", label: "Designers" },
  { id: "collection", label: "Collections" },
  { id: "editorial", label: "Editorials" },
  { id: "category", label: "Categories" },
] as const;

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const styleProfile = useStore((s) => s.styleProfile);
  const prefs = useStore((s) => s.notificationPrefs);
  const addRecentSearch = useStore((s) => s.addRecentSearch);
  const trackAnalytics = useStore((s) => s.trackAnalytics);

  useEffect(() => {
    setQuery(initial);
  }, [initial]);

  const discovery = useMemo(() => discoverAll(query, 48), [query]);
  const personalized = useMemo(() => {
    if (!query.trim() || !prefs.personalizeHomepage) return null;
    return personalizedSearch(query, styleProfile, 24);
  }, [query, styleProfile, prefs.personalizeHomepage]);

  const hits = useMemo(() => {
    if (!personalized) return discovery;
    const productHits = personalized.map((r) => ({
      type: "product" as const,
      label: r.product.name,
      href: `/product/${r.product.slug}`,
      meta: "Personalized",
      image: r.product.variants[0]?.images[0],
      product: r.product,
    }));
    const others = discovery.filter((h) => h.type !== "product");
    return [...productHits, ...others];
  }, [discovery, personalized]);
  const filtered = tab === "all" ? hits : hits.filter((h) => h.type === tab);
  const products = filtered.filter((h) => h.type === "product" && h.product);
  const others = filtered.filter((h) => h.type !== "product");

  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    if (products.length === 0 && others.length === 0) {
      trackAnalytics("zero-search", q);
    }
  }, [query, products.length, others.length, trackAnalytics]);

  const run = (value: string) => {
    const q = value.trim();
    setQuery(q);
    if (q) {
      addRecentSearch(q);
      router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false });
    }
  };

  return (
    <div className="shell py-10 lg:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-3 inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-gold" /> Intelligent discovery
        </p>
        <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
          <Search className="h-6 w-6 text-ink-muted" strokeWidth={1.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run(query)}
            placeholder="Describe a look, designer, colour, material…"
            className="w-full bg-transparent font-serif text-2xl focus:outline-none sm:text-3xl"
            aria-label="Search"
          />
        </div>
      </div>

      {!query && (
        <div className="mx-auto mt-8 max-w-2xl space-y-6">
          <div>
            <p className="mb-3 text-center text-xs uppercase tracking-luxe text-ink-muted">Trending</p>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => run(s)}
                  className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-ink hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-center text-xs uppercase tracking-luxe text-ink-muted">Try asking</p>
            <div className="flex flex-wrap justify-center gap-2">
              {searchSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => run(s)}
                  className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-ink hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {query && (
        <>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {tabs.map((t) => {
              const count = t.id === "all" ? hits.length : hits.filter((h) => h.type === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs uppercase tracking-luxe transition-colors",
                    tab === t.id ? "bg-ink text-canvas" : "border border-line text-ink-soft hover:border-ink"
                  )}
                >
                  {t.label} · {count}
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-center text-sm text-ink-muted">
            {filtered.length} results for <span className="text-ink">“{query}”</span>
          </p>

          {others.length > 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((h) => (
                <Link
                  key={`${h.type}-${h.href}`}
                  href={h.href}
                  className="flex items-center gap-4 rounded-xl border border-line p-3 transition-colors hover:border-ink"
                >
                  {h.image ? (
                    <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <Media seed={h.image} ratio="square" monogram={false} sizes="56px" label={h.label} />
                    </span>
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-canvas-sunk text-gold">
                      {h.type === "designer" && <User className="h-5 w-5" />}
                      {h.type === "collection" && <Layers className="h-5 w-5" />}
                      {h.type === "editorial" && <BookOpen className="h-5 w-5" />}
                      {h.type === "category" && <Tag className="h-5 w-5" />}
                    </span>
                  )}
                  <span>
                    <span className="block text-[0.65rem] uppercase tracking-luxe text-ink-muted">{h.type}</span>
                    <span className="mt-0.5 block font-serif text-lg leading-tight">{h.label}</span>
                    {h.meta && <span className="text-xs text-ink-muted">{h.meta}</span>}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((h) => (
                <ProductCard key={h.product!.id} product={h.product!} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <p className="mt-16 text-center font-serif text-2xl">No matches — try a different description.</p>
          )}
        </>
      )}
    </div>
  );
}
