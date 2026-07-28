import { products, findByBarcode } from "./products";
import { brands } from "./brands";
import { journal } from "./journal";
import type { Product, Brand, JournalArticle } from "./types";

/** Synonym / concept map so natural-language queries map onto product vibes & tags. */
const concepts: Record<string, string[]> = {
  work: ["office", "structured", "tailored", "work", "power dressing", "blazer", "trouser", "workwear"],
  workwear: ["office", "structured", "tailored", "work", "blazer", "workwear"],
  office: ["office", "structured", "tailored", "work", "blazer"],
  wedding: ["evening", "occasion", "elegant", "romantic", "dress", "silk", "wedding"],
  guest: ["evening", "occasion", "elegant", "dress", "wedding"],
  date: ["date night", "romantic", "evening", "soft", "silk", "feminine"],
  vacation: ["resort", "summer", "vacation", "linen", "relaxed", "warm"],
  holiday: ["resort", "summer", "vacation", "linen"],
  beach: ["resort", "summer", "linen", "relaxed"],
  summer: ["summer", "resort", "linen", "warm", "golden hour"],
  winter: ["winter", "cozy", "cashmere", "wool", "coat", "knitwear"],
  autumn: ["autumn", "layering", "wool", "boots"],
  fall: ["autumn", "layering", "wool", "boots"],
  cozy: ["cozy", "knitwear", "cashmere", "winter", "layering"],
  quiet: ["minimal", "clean", "structured", "neutral", "quiet luxury"],
  luxury: ["minimal", "structured", "timeless", "elegant", "quiet luxury"],
  minimal: ["minimal", "clean", "structured", "neutral"],
  minimalist: ["minimal", "clean", "neutral"],
  elegant: ["elegant", "evening", "structured", "timeless"],
  edgy: ["bold", "statement", "architectural"],
  gift: ["gift", "jewelry", "scarf", "timeless"],
  sustainable: ["sustainable", "organic", "artisanal"],
  eco: ["sustainable", "organic"],
  casual: ["everyday", "relaxed", "casual", "denim"],
  everyday: ["everyday", "minimal", "essential", "versatile"],
  black: ["black", "neutral", "charcoal", "midnight"],
  white: ["white", "ivory", "optic"],
  neutral: ["neutral", "minimal", "clean"],
  gold: ["gold", "jewelry"],
  denim: ["denim", "jeans", "casual"],
  leather: ["leather", "bag", "boots"],
  italian: ["italy", "italian", "milan", "leather"],
  italy: ["italy", "italian", "milan"],
  french: ["france", "paris", "french"],
  cashmere: ["cashmere", "cozy", "winter"],
  linen: ["linen", "resort", "summer"],
  wool: ["wool", "tailoring", "winter"],
  silk: ["silk", "evening", "dress"],
  cotton: ["cotton", "everyday", "shirt"],
  dress: ["dress", "dresses"],
  coat: ["coat", "outerwear"],
  jacket: ["jacket", "outerwear"],
  bag: ["bag", "tote", "leather"],
  shoes: ["shoes", "sneaker", "boots", "heels"],
  under: ["under"],
};

function expand(token: string): string[] {
  const out = new Set<string>([token]);
  if (concepts[token]) concepts[token].forEach((t) => out.add(t));
  return [...out];
}

function parsePriceCap(query: string): number | null {
  const m = query.match(/(?:under|below|less than|<)\s*\$?\s*(\d[\d,]*)/i);
  if (!m) return null;
  return Number(m[1].replace(/,/g, ""));
}

export interface SearchResult {
  product: Product;
  score: number;
}

export function semanticSearch(query: string, limit = 24): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Barcode / QR direct hit
  const byCode = findByBarcode(q.toUpperCase());
  if (byCode) return [{ product: byCode, score: 100 }];

  const tokens = q.split(/[^a-z0-9]+/).filter(Boolean);
  const expanded = new Set<string>();
  tokens.forEach((t) => expand(t).forEach((e) => expanded.add(e)));
  const priceCap = parsePriceCap(q);

  const results = products
    .map((product) => {
      const brand = brands.find((b) => b.id === product.brandId);
      const haystack = [
        product.name,
        product.category,
        product.subcategory,
        brand?.name ?? "",
        brand?.origin ?? "",
        product.countryOfOrigin,
        product.materials,
        ...product.materialTags,
        ...product.occasions,
        ...product.tags,
        ...product.vibe,
        ...product.variants.map((v) => v.color),
        ...product.sizes,
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;
      if (haystack.includes(q)) score += 6;
      expanded.forEach((term) => {
        if (product.name.toLowerCase().includes(term)) score += 4;
        else if (product.materialTags.some((t) => t.includes(term))) score += 3.5;
        else if (product.occasions.some((t) => t.includes(term))) score += 3.5;
        else if (product.tags.some((t) => t.includes(term))) score += 3;
        else if (product.vibe.some((v) => v.includes(term))) score += 2;
        else if (product.variants.some((v) => v.color.toLowerCase().includes(term))) score += 2.5;
        else if (haystack.includes(term)) score += 1;
      });

      if (priceCap != null) {
        if (product.price <= priceCap) score += 4;
        else score *= 0.15;
      }

      score += product.reviewCount / 5000;
      return { product, score };
    })
    .filter((r) => r.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

export type DiscoveryHitType = "product" | "designer" | "collection" | "editorial" | "category";

export interface DiscoveryHit {
  type: DiscoveryHitType;
  label: string;
  href: string;
  meta?: string;
  image?: string;
  product?: Product;
  brand?: Brand;
  article?: JournalArticle;
}

/** Multi-entity discovery: products, designers, collections, editorials, categories. */
export function discoverAll(query: string, limit = 36): DiscoveryHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: DiscoveryHit[] = [];

  semanticSearch(q, 24).forEach(({ product }) => {
    const brand = brands.find((b) => b.id === product.brandId);
    hits.push({
      type: "product",
      label: product.name,
      href: `/product/${product.slug}`,
      meta: brand?.name,
      image: product.variants[0]?.images[0],
      product,
    });
  });

  brands.forEach((b) => {
    if (
      b.name.toLowerCase().includes(q) ||
      b.tagline.toLowerCase().includes(q) ||
      b.origin.toLowerCase().includes(q) ||
      b.bio.toLowerCase().includes(q)
    ) {
      hits.push({
        type: "designer",
        label: b.name,
        href: `/designers/${b.slug}`,
        meta: b.origin,
        image: b.hero,
        brand: b,
      });
    }
  });

  const cats = [
    { id: "women", label: "Women" },
    { id: "men", label: "Men" },
    { id: "bags", label: "Bags" },
    { id: "shoes", label: "Shoes" },
    { id: "jewelry", label: "Jewelry" },
  ];
  cats.forEach((c) => {
    if (c.label.toLowerCase().includes(q) || c.id.includes(q)) {
      hits.push({
        type: "category",
        label: c.label,
        href: `/shop?category=${c.id}`,
        meta: "Category",
      });
    }
  });

  // Collections ≈ subcategory groupings matching query
  const subs = [...new Set(products.map((p) => p.subcategory))];
  subs.forEach((sub) => {
    if (sub.toLowerCase().includes(q) || expand(q).some((t) => sub.toLowerCase().includes(t))) {
      hits.push({
        type: "collection",
        label: `${sub} Collection`,
        href: `/shop?sub=${encodeURIComponent(sub)}`,
        meta: "Collection",
      });
    }
  });

  journal.forEach((a) => {
    const hay = `${a.title} ${a.dek} ${a.category}`.toLowerCase();
    if (hay.includes(q) || q.split(/\s+/).some((t) => t.length > 3 && hay.includes(t))) {
      hits.push({
        type: "editorial",
        label: a.title,
        href: `/journal/${a.slug}`,
        meta: a.category,
        image: a.hero,
        article: a,
      });
    }
  });

  const seen = new Set<string>();
  return hits
    .filter((h) => {
      const key = `${h.type}:${h.href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

export const searchSuggestions = [
  "Black Italian leather bag under $500",
  "Elegant wedding guest dress",
  "Quiet luxury workwear",
  "something for a summer wedding",
  "minimalist black blazer",
  "cozy winter knitwear",
  "date night silk dress",
  "sustainable everyday basics",
];

export const trendingSearches = [
  "Quiet luxury workwear",
  "Wedding guest dresses",
  "Italian leather bags",
  "Cashmere knitwear",
  "New arrivals",
];

/** Palette used to power "Shop the Look" visual search. */
export interface LookPalette {
  id: string;
  label: string;
  vibe: string[];
  swatches: string[];
}

export const lookPalettes: LookPalette[] = [
  { id: "quiet-luxury", label: "Quiet Luxury", vibe: ["minimal", "neutral", "structured", "clean"], swatches: ["#cbb9a2", "#2f3033", "#efe9dd"] },
  { id: "romantic-evening", label: "Romantic Evening", vibe: ["romantic", "evening", "soft", "feminine"], swatches: ["#d9b9b1", "#1c1f2a", "#c98a8a"] },
  { id: "riviera", label: "Riviera Resort", vibe: ["resort", "summer", "linen", "relaxed"], swatches: ["#a9c4d6", "#e9e2d3", "#c07a55"] },
  { id: "modern-utility", label: "Modern Utility", vibe: ["workwear", "utility", "relaxed", "layering"], swatches: ["#5c5a3c", "#2b3852", "#43434a"] },
  { id: "artisan", label: "Artisan Heritage", vibe: ["artisanal", "heritage", "bold", "statement"], swatches: ["#2a3b57", "#a4562f", "#b5904a"] },
];

export function shopTheLook(paletteId: string, limit = 8): Product[] {
  const palette = lookPalettes.find((p) => p.id === paletteId);
  if (!palette) return [];
  return products
    .map((product) => ({
      product,
      score: product.vibe.filter((v) => palette.vibe.includes(v)).length,
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .slice(0, limit)
    .map((r) => r.product);
}

export function shopByTags(tags: string[], limit = 8): Product[] {
  const normalized = tags.map((t) => t.toLowerCase()).filter(Boolean);
  if (!normalized.length) return [];
  return products
    .map((product) => {
      const hay = [...product.vibe, ...product.tags, ...product.materialTags, ...product.occasions, product.subcategory].map(
        (t) => t.toLowerCase()
      );
      const score = normalized.reduce((sum, tag) => sum + (hay.some((h) => h.includes(tag) || tag.includes(h)) ? 1 : 0), 0);
      return { product, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .slice(0, limit)
    .map((r) => r.product);
}

/** Visual search stub: map uploaded photo filename / colors to similar products. */
export function visualSearchFromUpload(fileName: string, limit = 8): Product[] {
  const tokens = fileName.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  if (!tokens.length) return shopTheLook("quiet-luxury", limit);
  const matched = shopByTags(tokens, limit);
  return matched.length ? matched : semanticSearch(tokens.join(" "), limit).map((r) => r.product);
}

export const customLookTags = [
  "minimal",
  "romantic",
  "resort",
  "workwear",
  "evening",
  "sustainable",
  "tailored",
  "cozy",
  "statement",
  "neutral",
  "gold",
  "linen",
  "leather",
  "wedding",
];

export interface SearchPrediction {
  type: "category" | "designer" | "trending" | "query" | "product";
  label: string;
  href: string;
  meta?: string;
  image?: string;
  product?: Product;
}

/** Predictive autocomplete with optional product thumbnails. */
export function getSearchPredictions(query: string, limit = 8): SearchPrediction[] {
  const q = query.trim().toLowerCase();
  const out: SearchPrediction[] = [];

  if (!q) {
    brands.filter((b) => b.featured).slice(0, 3).forEach((b) => {
      out.push({ type: "designer", label: b.name, href: `/designers/${b.slug}`, meta: "Designer", image: b.hero });
    });
    [
      { label: "Women", href: "/shop?category=women" },
      { label: "New In", href: "/shop?sort=new" },
      { label: "Bags", href: "/shop?category=bags" },
    ].forEach((c) => out.push({ type: "category", label: c.label, href: c.href, meta: "Category" }));
    products
      .slice()
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 2)
      .forEach((p) =>
        out.push({
          type: "trending",
          label: p.name,
          href: `/product/${p.slug}`,
          meta: brands.find((b) => b.id === p.brandId)?.name,
          image: p.variants[0]?.images[0],
          product: p,
        })
      );
    return out.slice(0, limit);
  }

  brands.forEach((b) => {
    if (b.name.toLowerCase().includes(q) || b.slug.includes(q)) {
      out.push({ type: "designer", label: b.name, href: `/designers/${b.slug}`, meta: "Designer", image: b.hero });
    }
  });

  const cats = [
    { id: "women", label: "Women" },
    { id: "men", label: "Men" },
    { id: "bags", label: "Bags" },
    { id: "shoes", label: "Shoes" },
    { id: "jewelry", label: "Jewelry" },
  ];
  cats.forEach((c) => {
    if (c.label.toLowerCase().includes(q) || c.id.includes(q)) {
      out.push({ type: "category", label: c.label, href: `/shop?category=${c.id}`, meta: "Category" });
    }
  });

  semanticSearch(q, 5).forEach(({ product }) => {
    out.push({
      type: "product",
      label: product.name,
      href: `/product/${product.slug}`,
      meta: brands.find((b) => b.id === product.brandId)?.name,
      image: product.variants[0]?.images[0],
      product,
    });
  });

  const seen = new Set<string>();
  return out
    .filter((p) => {
      if (seen.has(p.label)) return false;
      seen.add(p.label);
      return true;
    })
    .slice(0, limit);
}
