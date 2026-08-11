import type { Product, SupportTicket } from "./types";
import { brands } from "./brands";
import { products, totalStock } from "./products";
import { formatPrice } from "./utils";

export type ConciergeChannel = "chat" | "whatsapp" | "email" | "phone" | "video" | "ai";

export type ConciergeIntent =
  | "human"
  | "order_tracking"
  | "specific_product"
  | "product_discovery"
  | "sizing"
  | "store"
  | "returns"
  | "shipping"
  | "styling"
  | "care"
  | "clarify"
  | "generic";

export interface ConciergeMessage {
  id: string;
  role: "user" | "ai" | "agent" | "system";
  text: string;
  at: number;
}

export interface ConciergeProductCard {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  priceLabel: string;
  description: string;
  colors: string[];
  available: boolean;
  availability: string;
  href: string;
  thumbnail: string;
  categoryLabel: string;
}

/** Active search filters — always AND-combined */
export interface ConciergeFilters {
  color?: string;
  maxPrice?: number;
  gender?: "men" | "women";
  bosianoOnly?: boolean;
  /** Stricter type when user said "handbag" (excludes wallets) */
  productKind?: "handbag" | "wallet" | "bag";
}

/**
 * Conversation product state.
 * A result set is NOT a selected product — pronouns need an explicit referent.
 */
export interface ConciergeContext {
  lastIntent?: ConciergeIntent;
  lastCategory?: string;
  lastFilters?: ConciergeFilters;
  /** Product ids from the last multi-result browse */
  lastResultSet?: string[];
  /** Explicitly selected (click / name / ordinal) */
  lastSelectedProduct?: string | null;
  /** Last mentioned in assistant copy (single-product answers) */
  lastMentionedProduct?: string | null;
  lastShopHref?: string;

  /** @deprecated prefer lastCategory */
  lastCategoryLabel?: string;
  /** @deprecated prefer lastResultSet */
  lastProductIds?: string[];
  /** @deprecated prefer lastSelectedProduct */
  lastProductSlug?: string;
  /** @deprecated prefer lastFilters.color */
  lastColorFilter?: string;
}

export interface ConciergeReply {
  text: string;
  intent: ConciergeIntent;
  products?: ConciergeProductCard[];
  shopHref?: string;
  context: ConciergeContext;
}

export const conciergeChannels: {
  id: ConciergeChannel;
  label: string;
  copy: string;
  href?: string;
}[] = [
  { id: "chat", label: "Live chat", copy: "Average reply under 2 minutes" },
  { id: "whatsapp", label: "WhatsApp", copy: "+44 20 7946 0100", href: "https://wa.me/442079460100" },
  { id: "email", label: "Email", copy: "concierge@bosiano.com", href: "mailto:concierge@bosiano.com" },
  { id: "phone", label: "Phone", copy: "+1 212 555 0188 · 9am–9pm ET", href: "tel:+12125550188" },
  { id: "video", label: "Video consultation", copy: "Private FaceTime-style desk" },
  { id: "ai", label: "AI assistant", copy: "Instant answers · human handoff anytime" },
];

export const aiQuickReplies = [
  "Where is my order?",
  "give info for watches",
  "show handbags",
  "Help with sizing",
  "Speak to a human",
];

/** Token → display label (singular/plural aliases) */
export const PRODUCT_CATEGORIES: Record<string, string> = {
  watch: "Watches",
  watches: "Watches",
  timepiece: "Watches",
  timepieces: "Watches",
  wacth: "Watches",
  watche: "Watches",

  handbag: "Bags",
  handbags: "Bags",
  bag: "Bags",
  bags: "Bags",
  tote: "Bags",
  totes: "Bags",
  clutch: "Bags",
  clutches: "Bags",
  crossbody: "Bags",

  wallet: "Wallets",
  wallets: "Wallets",

  shoe: "Shoes",
  shoes: "Shoes",
  sneaker: "Sneakers",
  sneakers: "Sneakers",
  heel: "Shoes",
  heels: "Shoes",
  boot: "Shoes",
  boots: "Shoes",

  ring: "Rings",
  rings: "Rings",
  earring: "Earrings",
  earrings: "Earrings",
  jewelry: "Jewelry",
  jewellery: "Jewelry",
  jewelery: "Jewelry",

  scarf: "Scarves",
  scarves: "Scarves",
  wrap: "Scarves",
  wraps: "Scarves",

  shirt: "Shirts",
  shirts: "Shirts",

  trouser: "Trousers",
  trousers: "Trousers",
  pant: "Trousers",
  pants: "Trousers",

  coat: "Coats",
  coats: "Coats",
  jacket: "Jackets",
  jackets: "Jackets",
  outerwear: "Outerwear",

  dress: "Dresses",
  dresses: "Dresses",
  gown: "Dresses",
  gowns: "Dresses",
  slip: "Dresses",

  perfume: "Fragrance",
  parfum: "Fragrance",
  fragrance: "Fragrance",
  fragrances: "Fragrance",
};

const COLOR_ALIASES: Record<string, string[]> = {
  black: ["black", "jet", "noir", "ink", "soft black"],
  white: ["white", "ivory", "cream", "off-white", "optic white", "bone", "ecru"],
  gold: ["gold", "two-tone", "two tone", "champagne", "gold dust", "gold weave"],
  brown: ["brown", "cognac", "terracotta", "tan", "espresso", "mocha", "chestnut", "chocolate"],
  red: ["red", "burgundy", "wine"],
  blue: ["blue", "navy", "indigo", "indigo weave"],
  green: ["green", "olive", "forest"],
};

function brandName(brandId: string): string {
  return brands.find((b) => b.id === brandId)?.name ?? "Bosiano";
}

function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\w\s'$€£-]/g, " ")
    .replace(/\bhand\s+bag(s)?\b/g, "handbag$1")
    .replace(/\bjewel+e?ry\b/g, "jewelry")
    .replace(/\bwacthes?\b/g, "watches")
    .replace(/\bwatche\b/g, "watch")
    .replace(/\s+/g, " ")
    .trim();
}

function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j]!;
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, prev + cost);
      prev = cur;
    }
  }
  return row[b.length]!;
}

function fuzzyTokenMatch(word: string, token: string): boolean {
  if (word === token) return true;
  if (word.length < 4 || token.length < 4) return false;
  if (word.startsWith(token) || token.startsWith(word)) return true;
  if (Math.abs(word.length - token.length) <= 1 && word[0] === token[0]) {
    return editDistance(word, token) <= 1;
  }
  return false;
}

const QUERY_STOP_WORDS = new Set([
  "show",
  "have",
  "need",
  "give",
  "info",
  "with",
  "from",
  "about",
  "find",
  "help",
  "what",
  "your",
  "this",
  "that",
  "them",
  "please",
  "tell",
  "want",
  "like",
  "some",
  "any",
  "under",
  "below",
  "less",
  "than",
  "do",
  "you",
  "me",
  "a",
  "an",
  "the",
  "in",
  "for",
  "one",
]);

function queryHasToken(q: string, token: string): boolean {
  const words = q.split(/\s+/).filter(Boolean);
  if (words.includes(token)) return true;
  if (token.includes(" ") && q.includes(token)) return true;
  return words.filter((w) => !QUERY_STOP_WORDS.has(w)).some((w) => fuzzyTokenMatch(w, token));
}

export function detectProductCategory(q: string): { label: string; token: string } | null {
  const keys = Object.keys(PRODUCT_CATEGORIES).sort((a, b) => b.length - a.length);
  for (const token of keys) {
    if (queryHasToken(q, token)) {
      return { label: PRODUCT_CATEGORIES[token]!, token };
    }
  }
  return null;
}

function detectProductKind(token: string | undefined): ConciergeFilters["productKind"] | undefined {
  if (!token) return undefined;
  if (/^handbags?$/.test(token)) return "handbag";
  if (/^wallets?$/.test(token)) return "wallet";
  if (/^(bags?|totes?|clutches?|crossbody)$/.test(token)) return "bag";
  return undefined;
}

export function detectColorFilter(q: string): string | null {
  const words = q.split(/\s+/).filter(Boolean);
  for (const [canonical, aliases] of Object.entries(COLOR_ALIASES)) {
    for (const a of aliases) {
      if (a.includes(" ")) {
        if (q.includes(a)) return canonical;
        continue;
      }
      if (words.includes(a)) return canonical;
      if (a.length >= 4 && words.some((w) => fuzzyTokenMatch(w, a))) return canonical;
    }
  }
  return null;
}

/** Parse budget caps: "under $500", "below 500", "less than 500" */
export function detectMaxPrice(q: string): number | null {
  const patterns = [
    /\b(?:under|below|less than|upto|up to|max(?:imum)?)\s*\$?\s*(\d{2,6})\b/,
    /\$\s*(\d{2,6})\s*(?:or less|max|maximum|budget)?\b/,
  ];
  for (const re of patterns) {
    const m = q.match(re);
    if (m?.[1]) return Number(m[1]);
  }
  return null;
}

function detectGender(q: string): "men" | "women" | null {
  if (/\b(men'?s?|menswear|gentleman)\b/.test(q)) return "men";
  if (/\b(women'?s?|womenswear|ladies)\b/.test(q)) return "women";
  return null;
}

function wantsBosianoOnly(q: string): boolean {
  return /\bbosiano\b/.test(q);
}

function isWallet(p: Product): boolean {
  return p.productType === "wallet" || /wallet/.test(p.name.toLowerCase()) || p.subcategory === "Small Leather Goods";
}

function isHandbagLike(p: Product): boolean {
  if (isWallet(p)) return false;
  const hay = `${p.productType} ${p.subcategory} ${p.name} ${p.tags.join(" ")}`.toLowerCase();
  return (
    p.category === "bags" ||
    /\b(handbag|tote|shoulder|clutch|crossbody|flap bag|bag)\b/.test(hay)
  );
}

function productMatchesCategory(p: Product, label: string, kind?: ConciergeFilters["productKind"]): boolean {
  const hay = `${p.category} ${p.subcategory} ${p.productType} ${p.tags.join(" ")} ${p.name}`.toLowerCase();
  switch (label) {
    case "Watches":
      return p.subcategory === "Watches" || p.productType === "watch" || /\bwatch\b/.test(hay);
    case "Bags": {
      if (kind === "handbag") return isHandbagLike(p) && !isWallet(p);
      if (kind === "wallet") return isWallet(p);
      if (kind === "bag") {
        // Broad bags browse — still exclude pure wallets unless user asked wallets
        return (p.category === "bags" || /\bbag|handbag|tote|clutch\b/.test(hay)) && !isWallet(p);
      }
      return p.category === "bags" || /\bbag|handbag|tote|clutch\b/.test(hay);
    }
    case "Wallets":
      return isWallet(p);
    case "Shoes":
      return p.category === "shoes";
    case "Sneakers":
      return p.subcategory === "Sneakers" || /sneaker/.test(hay);
    case "Rings":
      return p.subcategory === "Rings" || p.productType === "ring";
    case "Earrings":
      return p.subcategory === "Earrings" || /earring/.test(hay);
    case "Jewelry":
      return p.category === "jewelry";
    case "Scarves":
      return (
        p.subcategory === "Scarves" ||
        /scarf|scarves|twill/.test(hay) ||
        (p.subcategory === "Accessories" && /scarf|wrap|twill/.test(hay))
      );
    case "Shirts":
      return p.subcategory === "Shirts" || /shirt/.test(hay);
    case "Trousers":
      return p.subcategory === "Trousers" || /trouser|pant/.test(hay);
    case "Coats":
      return /coat/.test(hay) || (p.subcategory === "Outerwear" && /coat/.test(p.name.toLowerCase()));
    case "Jackets":
      return /jacket|blazer/.test(hay) || (p.subcategory === "Outerwear" && /jacket|blazer/.test(p.name.toLowerCase()));
    case "Outerwear":
      return p.subcategory === "Outerwear" || /coat|jacket|blazer|outerwear/.test(hay);
    case "Dresses":
      return p.subcategory === "Dresses" || /dress|slip|gown/.test(hay);
    case "Fragrance":
      return p.category === "fragrance" || /perfume|fragrance|parfum/.test(hay);
    default:
      return p.subcategory === label || p.category.toLowerCase() === label.toLowerCase();
  }
}

export function colorMatchesProduct(p: Product, colorKey: string): boolean {
  const aliases = COLOR_ALIASES[colorKey] ?? [colorKey];
  return p.colors.some((c) => {
    const name = c.label.toLowerCase();
    const id = c.id.toLowerCase();
    return aliases.some((a) => name.includes(a) || id.includes(a));
  });
}

/** Exact colour labels on the product that belong to a colour family */
export function matchingColorLabels(p: Product, colorKey: string): string[] {
  const aliases = COLOR_ALIASES[colorKey] ?? [colorKey];
  return p.colors
    .filter((c) => {
      const name = c.label.toLowerCase();
      const id = c.id.toLowerCase();
      return aliases.some((a) => name.includes(a) || id.includes(a));
    })
    .map((c) => c.label);
}

function shopHrefForCategory(label: string, gender: "men" | "women" | null): string {
  const map: Record<string, string> = {
    Watches: "/shop?category=men&sub=Watches",
    Bags: "/shop?category=bags",
    Wallets: "/shop?category=bags&sub=Small%20Leather%20Goods",
    Shoes: "/shop?category=shoes",
    Sneakers: "/shop?category=shoes&sub=Sneakers",
    Rings: "/shop?category=jewelry&sub=Rings",
    Earrings: "/shop?category=jewelry&sub=Earrings",
    Jewelry: "/shop?category=jewelry",
    Scarves: "/shop?category=women&sub=Accessories",
    Shirts: gender === "men" ? "/shop?category=men&sub=Shirts" : "/shop?category=women",
    Trousers: "/shop?category=men&sub=Trousers",
    Coats: gender === "men" ? "/shop?category=men&sub=Outerwear" : "/shop?category=women&sub=Outerwear",
    Jackets: gender === "men" ? "/shop?category=men&sub=Outerwear" : "/shop?category=women&sub=Outerwear",
    Outerwear: gender === "men" ? "/shop?category=men&sub=Outerwear" : "/shop?category=women&sub=Outerwear",
    Dresses: "/shop?category=women&sub=Dresses",
    Fragrance: "/shop?category=fragrance",
  };
  return map[label] ?? "/shop";
}

function toCard(p: Product): ConciergeProductCard {
  const stock = totalStock(p);
  const available = stock > 0;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: brandName(p.brandId),
    price: p.price,
    priceLabel: formatPrice(p.price, p.currency),
    description: p.description.slice(0, 140) + (p.description.length > 140 ? "…" : ""),
    colors: p.colors.map((c) => c.label),
    available,
    availability: available ? (stock <= 3 ? "Low stock" : "In stock") : "Currently unavailable",
    href: `/product/${p.slug}`,
    thumbnail: p.cardImage || p.images[0]?.src || "",
    categoryLabel: p.subcategory || p.category,
  };
}

function normalizeContext(ctx: ConciergeContext): ConciergeContext {
  return {
    ...ctx,
    lastCategory: ctx.lastCategory ?? ctx.lastCategoryLabel,
    lastResultSet: ctx.lastResultSet ?? ctx.lastProductIds,
    lastSelectedProduct:
      ctx.lastSelectedProduct !== undefined
        ? ctx.lastSelectedProduct
        : ctx.lastProductSlug ?? null,
    lastMentionedProduct: ctx.lastMentionedProduct ?? null,
    lastFilters: ctx.lastFilters ?? (ctx.lastColorFilter ? { color: ctx.lastColorFilter } : undefined),
  };
}

export function searchCatalog(opts: {
  categoryLabel?: string;
  color?: string | null;
  gender?: "men" | "women" | null;
  bosianoOnly?: boolean;
  nameHint?: string;
  maxPrice?: number | null;
  productKind?: ConciergeFilters["productKind"];
  limit?: number;
}): Product[] {
  const {
    categoryLabel,
    color,
    gender,
    bosianoOnly,
    nameHint,
    maxPrice,
    productKind,
    limit = 6,
  } = opts;
  let list = [...products];

  if (categoryLabel) list = list.filter((p) => productMatchesCategory(p, categoryLabel, productKind));
  if (gender) list = list.filter((p) => p.gender === gender || p.gender === "unisex");
  if (bosianoOnly) list = list.filter((p) => p.brandId === "bosiano");
  if (color) list = list.filter((p) => colorMatchesProduct(p, color));
  if (maxPrice != null) list = list.filter((p) => p.price <= maxPrice);
  if (nameHint) {
    const h = nameHint.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(h) ||
        p.slug.includes(h) ||
        p.tags.some((t) => t.includes(h))
    );
  }

  return list.slice(0, limit);
}

function findSpecificProduct(q: string, within?: Product[]): Product | null {
  const pool = within?.length ? within : products;
  const scored = pool
    .map((p) => {
      const name = p.name.toLowerCase();
      let score = 0;
      if (q.includes(name)) score += 10;
      const tokens = name.split(/\s+/).filter((t) => t.length > 2 && !QUERY_STOP_WORDS.has(t));
      score += tokens.filter((t) => queryHasToken(q, t)).length;
      if (q.includes(p.slug.replace(/-/g, " "))) score += 8;
      // Partial distinctive tokens (zip wallet, flap bag, crest handbag)
      const distinctive = tokens.filter((t) => t.length >= 4);
      if (distinctive.length && distinctive.every((t) => q.includes(t))) score += 6;
      return { p, score };
    })
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score);
  return scored[0]?.p ?? null;
}

function productsFromResultSet(ctx: ConciergeContext): Product[] {
  const ids = ctx.lastResultSet ?? ctx.lastProductIds ?? [];
  if (!ids.length) return [];
  return ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
}

function productBySlug(slug: string | null | undefined): Product | null {
  if (!slug) return null;
  return products.find((p) => p.slug === slug) ?? null;
}

/**
 * Resolve "this" / "it" / "that one" against conversation state.
 * Priority: selected → mentioned → ordinal → ambiguous (null).
 */
export function resolveReferent(
  q: string,
  ctx: ConciergeContext
): { product: Product | null; ambiguous: Product[]; ordinal?: number } {
  const list = productsFromResultSet(ctx);

  const ordinal = detectOrdinal(q, list.length);
  if (ordinal != null && list[ordinal]) {
    return { product: list[ordinal]!, ambiguous: [], ordinal };
  }

  // Named product within last result set or catalog
  const namedInSet = list.length ? findSpecificProduct(q, list) : null;
  if (namedInSet && !isBarePronounQuery(q)) {
    return { product: namedInSet, ambiguous: [] };
  }
  const named = findSpecificProduct(q);
  if (named && !isBarePronounQuery(q) && (q.includes(named.name.toLowerCase().split(" ").slice(-2).join(" ")) || q.includes(named.slug.replace(/-/g, " ")))) {
    // Only treat as explicit name if enough of the name appears
    const tokens = named.name.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    const hit = tokens.filter((t) => q.includes(t)).length;
    if (hit >= Math.min(2, tokens.length) || q.includes(named.name.toLowerCase())) {
      return { product: named, ambiguous: [] };
    }
  }

  const selected = productBySlug(ctx.lastSelectedProduct);
  if (selected) return { product: selected, ambiguous: [] };

  const mentioned = productBySlug(ctx.lastMentionedProduct);
  if (mentioned) return { product: mentioned, ambiguous: [] };

  // Pronoun / colour-follow without a referent → ambiguous if multiple results
  if (list.length > 1 && (hasPronoun(q) || isColorFollowUp(q))) {
    return { product: null, ambiguous: list };
  }

  if (list.length === 1) return { product: list[0]!, ambiguous: [] };

  return { product: null, ambiguous: [] };
}

function hasPronoun(q: string): boolean {
  return /\b(this|that|it|this one|that one)\b/.test(q);
}

function isBarePronounQuery(q: string): boolean {
  return /^(do you have |show (me )?|is |what about )?(this|that|it|this one|that one)\b/.test(q);
}

function isColorFollowUp(q: string): boolean {
  return (
    /\b(in|about)\s+(black|white|gold|brown|red|blue|green|jet|noir|cognac|mocha)\b/.test(q) ||
    /\b(black|white|gold|brown)\s+one\b/.test(q) ||
    /^what about\s+\w+$/.test(q)
  );
}

function wantsAllInColor(q: string): boolean {
  return /\b(all|every|these|those)\b/.test(q) && /\b(in|as)\s+\w+\b/.test(q);
}

/** 0-based index into result set */
export function detectOrdinal(q: string, length: number): number | null {
  if (length <= 0) return null;
  if (/\b(last|final)\s+one\b/.test(q) || /\bthe\s+last\b/.test(q)) return length - 1;
  const map: [RegExp, number][] = [
    [/\b(first|1st)\s+one\b/, 0],
    [/\b(second|2nd)\s+one\b/, 1],
    [/\b(third|3rd)\s+one\b/, 2],
    [/\b(fourth|4th)\s+one\b/, 3],
    [/\b(fifth|5th)\s+one\b/, 4],
  ];
  for (const [re, idx] of map) {
    if (re.test(q) && idx < length) return idx;
  }
  return null;
}

function isFollowUp(q: string, ctx: ConciergeContext): boolean {
  const c = normalizeContext(ctx);
  if (!c.lastIntent) return false;
  if (c.lastIntent !== "product_discovery" && c.lastIntent !== "specific_product" && c.lastIntent !== "clarify") {
    return false;
  }
  const hasState =
    Boolean(c.lastResultSet?.length) ||
    Boolean(c.lastSelectedProduct) ||
    Boolean(c.lastMentionedProduct) ||
    Boolean(c.lastCategory);
  if (!hasState) return false;

  if (detectOrdinal(q, c.lastResultSet?.length ?? 0) != null) return true;
  if (/\b(black|white|gold|brown|red|blue|green|jet|ivory|cognac|terracotta|mocha)\s+one\b/.test(q)) return true;
  if (isColorFollowUp(q) && hasPronoun(q)) return true;
  if (isColorFollowUp(q) && (c.lastSelectedProduct || c.lastMentionedProduct || (c.lastResultSet?.length ?? 0) > 0)) {
    return true;
  }
  return (
    /\b(that|this|it|how much|price|cost|available|availability|in stock|details?)\b/.test(q) ||
    (/^(yes|ok|okay|sure|please)\b/.test(q) && hasState)
  );
}

function listNames(list: Product[]): string {
  if (list.length === 1) return `the ${list[0]!.name}`;
  if (list.length === 2) return `the ${list[0]!.name} or ${list[1]!.name}`;
  const head = list.slice(0, -1).map((p) => p.name);
  const last = list[list.length - 1]!.name;
  return `the ${head.join(", ")}, or ${last}`;
}

function clarifyWhich(list: Product[], ctx: ConciergeContext): ConciergeReply {
  return {
    intent: "clarify",
    text: `Which one do you mean — ${listNames(list)}?`,
    products: list.map(toCard),
    shopHref: ctx.lastShopHref,
    context: {
      ...normalizeContext(ctx),
      lastIntent: "clarify",
      // Do NOT auto-select
      lastSelectedProduct: null,
    },
  };
}

function withSelection(ctx: ConciergeContext, product: Product, intent: ConciergeIntent): ConciergeContext {
  const base = normalizeContext(ctx);
  return {
    ...base,
    lastIntent: intent,
    lastSelectedProduct: product.slug,
    lastMentionedProduct: product.slug,
    lastCategory: base.lastCategory ?? product.subcategory,
    lastResultSet: base.lastResultSet?.length ? base.lastResultSet : [product.id],
    // legacy mirrors
    lastProductSlug: product.slug,
    lastProductIds: base.lastResultSet?.length ? base.lastResultSet : [product.id],
    lastCategoryLabel: base.lastCategory ?? product.subcategory,
  };
}

function replyColorForProduct(product: Product, color: string, ctx: ConciergeContext): ConciergeReply {
  const labels = matchingColorLabels(product, color);
  const card = toCard(product);
  const next = withSelection(ctx, product, "specific_product");
  if (labels.length) {
    const label = labels[0]!;
    return {
      intent: "specific_product",
      text: `Yes — the ${product.name} is available in ${label}.`,
      products: [card],
      context: {
        ...next,
        lastFilters: { ...next.lastFilters, color },
        lastColorFilter: color,
      },
    };
  }
  return {
    intent: "specific_product",
    text: `The ${product.name} isn't available in ${color[0]!.toUpperCase()}${color.slice(1)}. It is currently available in ${card.colors.join(", ")}.`,
    products: [card],
    context: next,
  };
}

function replyProductDiscovery(
  q: string,
  ctx: ConciergeContext,
  category: { label: string; token: string }
): ConciergeReply {
  const color = detectColorFilter(q);
  const gender = detectGender(q);
  const bosianoOnly = wantsBosianoOnly(q);
  const maxPrice = detectMaxPrice(q);
  const productKind = detectProductKind(category.token);
  const filters: ConciergeFilters = {
    ...(color ? { color } : {}),
    ...(maxPrice != null ? { maxPrice } : {}),
    ...(gender ? { gender } : {}),
    ...(bosianoOnly ? { bosianoOnly } : {}),
    ...(productKind ? { productKind } : {}),
  };

  const matches = searchCatalog({
    categoryLabel: category.label,
    color,
    gender,
    bosianoOnly,
    maxPrice,
    productKind,
    limit: 6,
  });
  const shopHref = shopHrefForCategory(category.label, gender);
  const kindLabel =
    productKind === "handbag" ? "handbag" : category.label.toLowerCase().replace(/s$/, "");

  if (!matches.length) {
    // Closest: drop price first, keep type + colour
    const withoutPrice = searchCatalog({
      categoryLabel: category.label,
      color,
      gender,
      bosianoOnly,
      productKind,
      limit: 6,
    });
    const closest = [...withoutPrice].sort((a, b) => a.price - b.price)[0];
    const budgetBit = maxPrice != null ? ` under ${formatPrice(maxPrice, "USD")}` : "";
    const colorBit = color ? ` ${color}` : "";
    if (closest) {
      const card = toCard(closest);
      return {
        intent: "product_discovery",
        text: `I couldn't find a${colorBit} ${kindLabel}${budgetBit}. The closest${color ? ` ${color}` : ""} leather option is the ${closest.name} at ${card.priceLabel}.`,
        products: [card],
        shopHref,
        context: {
          ...normalizeContext(ctx),
          lastIntent: "product_discovery",
          lastCategory: category.label,
          lastCategoryLabel: category.label,
          lastFilters: filters,
          lastResultSet: [closest.id],
          lastProductIds: [closest.id],
          lastSelectedProduct: null,
          lastMentionedProduct: closest.slug,
          lastProductSlug: undefined,
          lastColorFilter: color ?? undefined,
          lastShopHref: shopHref,
        },
      };
    }
    return {
      intent: "product_discovery",
      text: `I checked the BOSIANO catalog for${colorBit} ${category.label.toLowerCase()}${budgetBit}, but nothing matches right now. Browse ${shopHref}.`,
      shopHref,
      context: {
        ...normalizeContext(ctx),
        lastIntent: "product_discovery",
        lastCategory: category.label,
        lastFilters: filters,
        lastResultSet: [],
        lastSelectedProduct: null,
        lastShopHref: shopHref,
      },
    };
  }

  const cards = matches.map(toCard);
  const names = cards.map((c) => c.name).join("; ");
  const lead =
    cards.length === 1
      ? `Absolutely. BOSIANO currently has the ${cards[0]!.name} in the collection. I can show price, colours, and availability — or take you to the product.`
      : `Of course. I can help you explore BOSIANO ${category.label.toLowerCase()}. Here are the pieces currently available: ${names}.`;

  return {
    intent: "product_discovery",
    text: lead,
    products: cards,
    shopHref,
    context: {
      ...normalizeContext(ctx),
      lastIntent: "product_discovery",
      lastCategory: category.label,
      lastCategoryLabel: category.label,
      lastFilters: filters,
      lastResultSet: matches.map((p) => p.id),
      lastProductIds: matches.map((p) => p.id),
      // Critical: do NOT auto-select first result
      lastSelectedProduct: cards.length === 1 ? matches[0]!.slug : null,
      lastMentionedProduct: cards.length === 1 ? matches[0]!.slug : null,
      lastProductSlug: cards.length === 1 ? matches[0]!.slug : undefined,
      lastColorFilter: color ?? undefined,
      lastShopHref: shopHref,
    },
  };
}

function replyFollowUp(q: string, ctx: ConciergeContext): ConciergeReply | null {
  if (!isFollowUp(q, ctx)) return null;
  const c = normalizeContext(ctx);
  let list = productsFromResultSet(c);
  if (!list.length && c.lastCategory) {
    list = searchCatalog({
      categoryLabel: c.lastCategory,
      color: c.lastFilters?.color,
      maxPrice: c.lastFilters?.maxPrice,
      productKind: c.lastFilters?.productKind,
      limit: 6,
    });
  }

  // Ordinal / name selection first
  const ordinal = detectOrdinal(q, list.length);
  if (ordinal != null && list[ordinal]) {
    const focus = list[ordinal]!;
    const card = toCard(focus);
    return {
      intent: "specific_product",
      text: `Here’s the ${focus.name} — ${card.priceLabel}. Colours: ${card.colors.join(", ")}. ${card.availability}.`,
      products: [card],
      context: withSelection(c, focus, "specific_product"),
    };
  }

  // "the cognac flap bag" / name inside result set
  if (list.length && !isBarePronounQuery(q) && !isColorFollowUp(q)) {
    const named = findSpecificProduct(q, list) ?? findSpecificProduct(q);
    if (named && (list.some((p) => p.id === named.id) || q.includes(named.name.toLowerCase()))) {
      const inSet = list.some((p) => p.id === named.id) || true;
      if (inSet) {
        const card = toCard(named);
        return {
          intent: "specific_product",
          text: `Here’s the ${named.name} — ${card.priceLabel}. Colours: ${card.colors.join(", ")}. ${card.availability}.`,
          products: [card],
          context: withSelection(c, named, "specific_product"),
        };
      }
    }
  }

  const color = detectColorFilter(q);
  const colorFollow = Boolean(color) && (isColorFollowUp(q) || hasPronoun(q) || /\b(show|have|available)\b/.test(q));

  if (colorFollow && color) {
    if (wantsAllInColor(q) && list.length) {
      const filtered = list.filter((p) => colorMatchesProduct(p, color));
      if (!filtered.length) {
        return {
          intent: "product_discovery",
          text: `None of those pieces are available in ${color}.`,
          products: list.map(toCard),
          context: c,
        };
      }
      return {
        intent: "product_discovery",
        text: `Here are those pieces available in ${color}: ${filtered.map((p) => p.name).join("; ")}.`,
        products: filtered.map(toCard),
        context: {
          ...c,
          lastIntent: "product_discovery",
          lastResultSet: filtered.map((p) => p.id),
          lastProductIds: filtered.map((p) => p.id),
          lastSelectedProduct: filtered.length === 1 ? filtered[0]!.slug : null,
          lastFilters: { ...c.lastFilters, color },
          lastColorFilter: color,
        },
      };
    }

    const { product, ambiguous } = resolveReferent(q, c);
    if (!product && ambiguous.length > 1) {
      return clarifyWhich(ambiguous, c);
    }
    if (product) {
      return replyColorForProduct(product, color, c);
    }
    // No referent and no list — fall through
    return null;
  }

  const { product, ambiguous } = resolveReferent(q, c);
  if (!product && ambiguous.length > 1 && hasPronoun(q)) {
    return clarifyWhich(ambiguous, c);
  }

  const focus = product ?? (list.length === 1 ? list[0]! : productBySlug(c.lastSelectedProduct));
  if (!focus) {
    if (list.length > 1) return clarifyWhich(list, c);
    return null;
  }

  const card = toCard(focus);
  const next = withSelection(c, focus, "specific_product");

  if (/how much|price|cost|\$|€/.test(q)) {
    return {
      intent: "specific_product",
      text: `The ${focus.name} is ${card.priceLabel}. ${card.availability}.`,
      products: [card],
      context: next,
    };
  }

  if (/available|availability|in stock|stock/.test(q)) {
    return {
      intent: "specific_product",
      text: card.available
        ? `Yes — the ${focus.name} is ${card.availability.toLowerCase()}. Colours: ${card.colors.join(", ")}.`
        : `The ${focus.name} is currently unavailable. I can watchlist it or suggest similar pieces.`,
      products: [card],
      context: next,
    };
  }

  if (/detail|tell me|info|about|describe/.test(q)) {
    return {
      intent: "specific_product",
      text: `${focus.name} — ${focus.description} Price ${card.priceLabel}. Colours: ${card.colors.join(", ")}.`,
      products: [card],
      context: next,
    };
  }

  return {
    intent: "specific_product",
    text: `Looking at the ${focus.name}. Ask for price, availability, a colour, or open the product.`,
    products: [card],
    context: next,
  };
}

/** UI: product card clicked → select referent for "this"/"it" */
export function selectConciergeProduct(ctx: ConciergeContext, productSlug: string): ConciergeReply {
  const product = productBySlug(productSlug);
  if (!product) {
    return {
      intent: "generic",
      text: "I couldn’t find that piece. Try another from the list.",
      context: normalizeContext(ctx),
    };
  }
  const card = toCard(product);
  return {
    intent: "specific_product",
    text: `Selected the ${product.name}. Ask about colours, price, or availability — for example “do you have this in black?”`,
    products: [card],
    context: withSelection(normalizeContext(ctx), product, "specific_product"),
  };
}

const GENERIC_FALLBACK =
  "I can help you find products, compare styles, check sizes and availability, track orders, locate stores, and connect you with BOSIANO Client Care. What would you like help with?";

export function aiReply(
  prompt: string,
  isPrivateClient: boolean,
  context: ConciergeContext = {}
): ConciergeReply {
  const q = normalizeQuery(prompt);
  const keep = normalizeContext(context);

  /* 1. Human support */
  if (/human|agent|person|handoff|speak to|talk to/.test(q)) {
    return {
      intent: "human",
      text: isPrivateClient
        ? "Connecting you to the Private Client queue — Elena will join shortly."
        : "Connecting you to a Bosiano specialist. Hold on a moment.",
      context: { ...keep, lastIntent: "human" },
    };
  }

  const categoryEarly = detectProductCategory(q);
  const strongFollow = isFollowUp(q, keep);
  // New category that differs from last browse is a fresh search, not a follow-up
  const categoryShift =
    categoryEarly &&
    keep.lastCategory &&
    categoryEarly.label !== keep.lastCategory &&
    !hasPronoun(q) &&
    detectOrdinal(q, keep.lastResultSet?.length ?? 0) == null;

  const follow = !categoryShift && strongFollow ? replyFollowUp(q, keep) : null;
  if (follow) return follow;

  /* Returns before order when explicit */
  if (/return|exchange|refund/.test(q) && !categoryEarly) {
    return {
      intent: "returns",
      text: "Returns & exchanges are in Account → Returns. Most full-price pieces have a 30-day window — I can walk you through a label.",
      context: { ...keep, lastIntent: "returns" },
    };
  }

  /* 2. Order / tracking */
  const asksOrderStatus =
    /(where('?s| is)? my order|track(ing)?(\s+my)?(\s+order)?|ship(ping|ment)|delivery status|out for delivery)/.test(
      q
    ) ||
    (/\borders?\b/.test(q) && /(my|track|status|where|ship)/.test(q) && !categoryEarly);
  if (asksOrderStatus && !categoryEarly) {
    return {
      intent: "order_tracking",
      text: "Your latest order is out for delivery. Track live in Account → Orders, or I can open tracking for you.",
      context: { ...keep, lastIntent: "order_tracking" },
    };
  }
  if (/help with orders?\b/.test(q) && !categoryEarly) {
    return {
      intent: "order_tracking",
      text: "I can help with order status, shipping, and returns. Ask “where is my order?” or open Account → Orders.",
      context: { ...keep, lastIntent: "order_tracking" },
    };
  }

  /* 3. Specific product by name (before category — "the cognac flap bag" contains "bag") */
  const within = productsFromResultSet(keep);
  const specificInSet = within.length ? findSpecificProduct(q, within) : null;
  const specific = specificInSet ?? findSpecificProduct(q);
  const namesProduct =
    specific &&
    (specificInSet ||
      /info|about|tell|show|detail|price|have|sell/.test(q) ||
      q.includes(specific.name.toLowerCase()) ||
      // Distinctive multi-token name without discovery verbs ("the cognac flap bag")
      specific.name
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length > 3)
        .filter((t) => q.includes(t)).length >= 2);

  if (specific && namesProduct) {
    const card = toCard(specific);
    return {
      intent: "specific_product",
      text: `Here’s ${specific.name} by ${card.brand} — ${card.priceLabel}. ${card.description} Colours: ${card.colors.join(", ")}. ${card.availability}.`,
      products: [card],
      context: withSelection(
        {
          ...keep,
          lastCategory: keep.lastCategory ?? specific.subcategory,
          lastResultSet: within.length ? within.map((p) => p.id) : [specific.id],
        },
        specific,
        "specific_product"
      ),
    };
  }

  /* 4. Product / category discovery */
  if (categoryEarly) {
    return replyProductDiscovery(q, keep, categoryEarly);
  }

  /* Soft follow-up when no new category (e.g. pronoun-only after browse) */
  const softFollow = replyFollowUp(q, keep);
  if (softFollow) return softFollow;

  /* 5. Sizing */
  if (/size|sizing|fit|\bmedium\b|\bsmall\b|\blarge\b|\bxs\b|\bxl\b/.test(q)) {
    return {
      intent: "sizing",
      text: "I can open Size Advisor on any PDP, or book a virtual fit check. Prefer AI guidance or a stylist? Share the piece if you have one in mind.",
      context: { ...keep, lastIntent: "sizing" },
    };
  }

  /* 6. Stores */
  if (/store|stores|boutique|location|find a store|milan|london|new york/.test(q)) {
    return {
      intent: "store",
      text: "Find boutiques and hours at /stores. I can also book a stylist appointment or in-store pickup.",
      shopHref: "/stores",
      context: { ...keep, lastIntent: "store" },
    };
  }

  /* 8. Shipping */
  if (/\bshipping\b|\bdelivery\b|\binternational\b/.test(q)) {
    return {
      intent: "shipping",
      text: "We ship worldwide. Delivery estimates appear at checkout; Private Client may receive priority dispatch. Need a specific destination?",
      context: { ...keep, lastIntent: "shipping" },
    };
  }

  /* 9. Styling */
  if (/stylist|styling|outfit|lookbook|personal shop/.test(q)) {
    return {
      intent: "styling",
      text: "Our AI Personal Stylist is at /stylist, or book a human appointment under Account → Appointments. Tell me occasion, season, or budget.",
      shopHref: "/stylist",
      context: { ...keep, lastIntent: "styling" },
    };
  }

  /* 10. Care */
  if (/alter|tailor|repair|care service|product care|leather care/.test(q)) {
    return {
      intent: "care",
      text: "Alterations & Care covers tailoring, shoe repair, bag restoration, leather care, cleaning, and authentication — with pickup. Open /care to book.",
      shopHref: "/care",
      context: { ...keep, lastIntent: "care" },
    };
  }

  if (
    (q.includes("order") && q.includes("siz") && q.includes("store")) ||
    /help with .+,.+/.test(q) ||
    /what can you|how can you help/.test(q)
  ) {
    return {
      intent: "generic",
      text: GENERIC_FALLBACK,
      context: { ...keep, lastIntent: "generic" },
    };
  }

  return {
    intent: "generic",
    text: GENERIC_FALLBACK,
    context: { ...keep, lastIntent: "generic" },
  };
}

/** @deprecated string-only helper for quick checks */
export function aiReplyText(prompt: string, isPrivateClient: boolean, context?: ConciergeContext): string {
  return aiReply(prompt, isPrivateClient, context).text;
}

export const sampleTickets: SupportTicket[] = [
  { id: "SUP-2041", subject: "Return label reprint", status: "pending", updatedAt: "Yesterday" },
  { id: "SUP-1988", subject: "Gift wrap for anniversary order", status: "resolved", updatedAt: "12 Jul" },
];
