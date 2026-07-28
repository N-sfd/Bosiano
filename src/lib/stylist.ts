import { products, findSimilar } from "./products";
import { brands } from "./brands";
import { orders } from "./orders";
import { semanticSearch, shopByTags } from "./search";
import type { Product, StyleProfile, BodyProfile, NotificationPrefs, WishlistList } from "./types";
import { slugify } from "./utils";

export const defaultStyleProfile: StyleProfile = {
  sizes: { tops: "S", bottoms: "S", shoes: "39" },
  preferredDesigners: ["maison-verane", "sanso", "belrose"],
  favoriteColors: ["Black", "Camel", "Ivory", "Charcoal"],
  budget: 1200,
  occasions: ["work", "evening", "everyday"],
  climate: "mild",
  location: "London",
  bodyNotes: "Prefer tailored fits through the shoulder; ease at the waist.",
  styleTags: ["minimal", "tailored"],
  preferredFits: ["regular"],
  preferredCategories: ["women", "bags", "shoes"],
  sustainabilityPreference: "prefer",
  onboardingComplete: false,
};

export const defaultBodyProfile: BodyProfile = {
  heightCm: 170,
  weightKg: 60,
  bodyType: "Regular",
  bustCm: 86,
  waistCm: 68,
  hipsCm: 94,
  shoeEu: "39",
};

export const defaultNotificationPrefs: NotificationPrefs = {
  emailNewArrivals: true,
  emailWishlistPriceDrops: true,
  emailEditorsPicks: true,
  personalizeHomepage: true,
  smsDelivery: false,
  pushStyleSuggestions: true,
  pushLowStock: true,
  pushBackInStock: true,
};

export const defaultWishlistLists = (): WishlistList[] => {
  const names = ["Favorites", "Wedding", "Vacation", "Workwear", "Gifts", "Seasonal wardrobe"];
  return names.map((name, i) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    visibility: i === 0 ? "private" : "private",
    productIds: [],
    priceAtSave: {},
    alerts: { priceDrop: true, lowStock: true, backInStock: true },
    createdAt: Date.now() - i,
  }));
};

export const stylistPrompts = [
  "Build a business-casual outfit under $700.",
  "Style this bag for a formal dinner.",
  "Suggest a capsule wardrobe for Italy.",
  "Find something similar in a lower price range.",
  "Create a complete outfit for my body type.",
];

export interface StylistPiece {
  role: string;
  product: Product;
}

export interface StylistReply {
  message: string;
  outfit: StylistPiece[];
  total: number;
  tips: string[];
}

function purchaseProductIds(): string[] {
  const names = orders.flatMap((o) => o.items.map((i) => i.name));
  return names
    .map((n) => products.find((p) => p.name === n)?.id)
    .filter(Boolean) as string[];
}

function scoreForProfile(product: Product, profile: StyleProfile, wishlist: string[], recentlyViewed: string[]) {
  const brand = brands.find((b) => b.id === product.brandId);
  let score = product.rating;
  if (profile.preferredDesigners.includes(product.brandId)) score += 4;
  if (product.variants.some((v) => profile.favoriteColors.some((c) => v.color.toLowerCase().includes(c.toLowerCase()))))
    score += 2;
  if (product.occasions.some((o) => profile.occasions.includes(o))) score += 2;
  if (wishlist.includes(product.id)) score += 3;
  if (recentlyViewed.includes(product.id)) score += 2;
  if (purchaseProductIds().includes(product.id)) score += 1;
  if (product.price <= profile.budget) score += 1;
  if (brand?.origin.toLowerCase().includes(profile.location.toLowerCase().slice(0, 3))) score += 0.5;
  return score;
}

function pickOutfit(
  pool: Product[],
  profile: StyleProfile,
  budget: number,
  wishlist: string[],
  recentlyViewed: string[],
  roles: { role: string; match: (p: Product) => boolean }[]
): StylistPiece[] {
  const used = new Set<string>();
  const outfit: StylistPiece[] = [];
  let spent = 0;

  for (const { role, match } of roles) {
    const candidates = pool
      .filter((p) => match(p) && !used.has(p.id) && spent + p.price <= budget)
      .sort(
        (a, b) =>
          scoreForProfile(b, profile, wishlist, recentlyViewed) - scoreForProfile(a, profile, wishlist, recentlyViewed)
      );
    const pick = candidates[0];
    if (pick) {
      outfit.push({ role, product: pick });
      used.add(pick.id);
      spent += pick.price;
    }
  }
  return outfit;
}

function parseBudget(query: string, fallback: number) {
  const m = query.match(/(?:under|below|less than|<)\s*\$?\s*(\d[\d,]*)/i);
  if (m) return Number(m[1].replace(/,/g, ""));
  return fallback;
}

export function runStylist(
  query: string,
  profile: StyleProfile,
  ctx: {
    wishlist: string[];
    recentlyViewed: string[];
    focusProductId?: string;
  }
): StylistReply {
  const q = query.trim().toLowerCase();
  const budget = parseBudget(q, profile.budget);
  const tips: string[] = [];

  // Lower price similar
  if (q.includes("lower price") || q.includes("cheaper") || q.includes("similar")) {
    const focus =
      (ctx.focusProductId && products.find((p) => p.id === ctx.focusProductId)) ||
      (ctx.recentlyViewed[0] && products.find((p) => p.id === ctx.recentlyViewed[0])) ||
      products[0];
    const similar = findSimilar(focus, 12)
      .filter((p) => p.price < focus.price)
      .slice(0, 4);
    const outfit = similar.map((product, i) => ({
      role: i === 0 ? "Closest match" : `Alternative ${i}`,
      product,
    }));
    return {
      message: `I found lower-priced pieces with a similar vibe to ${focus.name}, weighted toward your preferred designers and recent browsing.`,
      outfit,
      total: outfit.reduce((s, o) => s + o.product.price, 0),
      tips: [
        `Your saved top size is ${profile.sizes.tops}.`,
        `Budget cap applied: ${budget ? `$${budget}` : "profile budget"}.`,
      ],
    };
  }

  // Style a bag for formal dinner
  if (q.includes("bag") && (q.includes("dinner") || q.includes("formal"))) {
    const bag =
      products.find((p) => p.id === "crescent-shoulder-bag") ||
      products.find((p) => p.category === "bags")!;
    const dress = shopByTags(["evening", "elegant", "silk"], 8)
      .concat(semanticSearch("elegant evening dress", 8).map((r) => r.product))
      .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
      .sort((a, b) => scoreForProfile(b, profile, ctx.wishlist, ctx.recentlyViewed) - scoreForProfile(a, profile, ctx.wishlist, ctx.recentlyViewed))[0];
    const shoes = products.find((p) => p.id === "sculptural-heeled-mule")!;
    const earrings = products.find((p) => p.id === "twisted-hoop-earrings")!;
    const outfit = [
      { role: "Dress", product: dress },
      { role: "Bag", product: bag },
      { role: "Shoes", product: shoes },
      { role: "Jewelry", product: earrings },
    ].filter((o) => o.product);
    tips.push("Keep metals matching — vermeil with warm tones.");
    tips.push(`Climate note for ${profile.location}: add a wrap if evenings are cool.`);
    return {
      message: `Here's a formal dinner styling for your bag — shaped by your favorite colors (${profile.favoriteColors.slice(0, 2).join(", ")}) and evening preferences.`,
      outfit,
      total: outfit.reduce((s, o) => s + o.product.price, 0),
      tips,
    };
  }

  // Capsule for Italy
  if (q.includes("capsule") || q.includes("italy") || q.includes("italian")) {
    const roles = [
      { role: "Day layer", match: (p: Product) => /blazer|trench|coat|shirt/i.test(p.name + p.subcategory) },
      { role: "Knit", match: (p: Product) => /knit|crew|cashmere|sweater/i.test(p.name + p.subcategory) },
      { role: "Bottom", match: (p: Product) => /trouser|skirt|denim/i.test(p.name + p.subcategory) },
      { role: "Shoe", match: (p: Product) => p.category === "shoes" },
      { role: "Bag", match: (p: Product) => p.category === "bags" },
      { role: "Accent", match: (p: Product) => p.category === "jewelry" || /scarf/i.test(p.name) },
    ];
    const pool = products.filter((p) => p.price <= budget);
    const outfit = pickOutfit(pool, profile, budget, ctx.wishlist, ctx.recentlyViewed, roles);
    tips.push("Pack a silk scarf for sun and evening polish.");
    tips.push("Italian mild climate — linen and wool layers mix well.");
    return {
      message: `A travel capsule for Italy under $${budget}, using your preferred houses and ${profile.sizes.tops}/${profile.sizes.bottoms} sizing cues.`,
      outfit,
      total: outfit.reduce((s, o) => s + o.product.price, 0),
      tips,
    };
  }

  // Body type / complete outfit
  if (q.includes("body") || q.includes("complete outfit") || q.includes("for me")) {
    const roles = [
      { role: "Anchor", match: (p: Product) => /blazer|dress|coat/i.test(p.name) },
      { role: "Base", match: (p: Product) => /shirt|tank|knit|crew/i.test(p.name) },
      { role: "Bottom", match: (p: Product) => /trouser|skirt|denim/i.test(p.name) },
      { role: "Shoe", match: (p: Product) => p.category === "shoes" },
      { role: "Finish", match: (p: Product) => p.category === "bags" || p.category === "jewelry" },
    ];
    const outfit = pickOutfit(products, profile, budget, ctx.wishlist, ctx.recentlyViewed, roles);
    tips.push(profile.bodyNotes || "Balanced proportions with a defined shoulder.");
    tips.push(`Recommended sizes — tops ${profile.sizes.tops}, bottoms ${profile.sizes.bottoms}, shoes ${profile.sizes.shoes}.`);
    return {
      message: `I built a complete look around your body notes and browsing history (${ctx.recentlyViewed.length} recent pieces), staying within $${budget}.`,
      outfit,
      total: outfit.reduce((s, o) => s + o.product.price, 0),
      tips,
    };
  }

  // Business casual under budget (default path also covers this)
  const roles = [
    { role: "Blazer / layer", match: (p: Product) => /blazer|overshirt|trench|coat/i.test(p.name + p.subcategory) },
    { role: "Top", match: (p: Product) => /shirt|knit|crew|tank/i.test(p.name) },
    { role: "Trouser", match: (p: Product) => /trouser|denim|skirt/i.test(p.name) },
    { role: "Shoe", match: (p: Product) => p.category === "shoes" },
    { role: "Bag", match: (p: Product) => p.category === "bags" },
  ];

  const semanticPool = semanticSearch(query, 20).map((r) => r.product);
  const tagPool = shopByTags(
    q.includes("business") || q.includes("work")
      ? ["work", "office", "tailored", "minimal"]
      : q.split(/[^a-z0-9]+/).filter((t) => t.length > 3),
    16
  );
  const pool = [...semanticPool, ...tagPool, ...products]
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .filter((p) => p.price <= budget);

  const outfit = pickOutfit(pool.length ? pool : products, profile, budget, ctx.wishlist, ctx.recentlyViewed, roles);

  tips.push(`Budget: $${budget} · Location: ${profile.location} · Climate: ${profile.climate}`);
  if (profile.preferredDesigners.length) {
    tips.push(
      `Preferred designers weighted: ${profile.preferredDesigners
        .map((id) => brands.find((b) => b.id === id)?.name)
        .filter(Boolean)
        .join(", ")}`
    );
  }
  if (ctx.wishlist.length) tips.push("Wishlist items were prioritized when they fit the brief.");

  return {
    message: `Here's a look for “${query.trim()}” — personalized with your sizes, designers, colors, wishlist, and purchase history.`,
    outfit,
    total: outfit.reduce((s, o) => s + o.product.price, 0),
    tips,
  };
}

export function modifyLookWithAI(
  prompt: string,
  productIds: string[],
  profile: StyleProfile
): { message: string; replacements: { fromId: string; toId: string; reason: string }[] } {
  const q = prompt.toLowerCase();
  const replacements: { fromId: string; toId: string; reason: string }[] = [];
  const current = productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];

  if (q.includes("cheaper") || q.includes("lower") || q.includes("budget")) {
    current.forEach((p) => {
      const alt = findSimilar(p, 8).find((x) => x.price < p.price);
      if (alt) replacements.push({ fromId: p.id, toId: alt.id, reason: `More accessible alternative to ${p.name}` });
    });
  } else if (q.includes("formal") || q.includes("dinner") || q.includes("evening")) {
    const dress = products.find((p) => /dress|slip/i.test(p.name));
    const shoe = products.find((p) => /mule|heel/i.test(p.name));
    if (dress && current[0]) replacements.push({ fromId: current[0].id, toId: dress.id, reason: "Elevated evening silhouette" });
    if (shoe) {
      const shoeSlot = current.find((p) => p.category === "shoes");
      if (shoeSlot) replacements.push({ fromId: shoeSlot.id, toId: shoe.id, reason: "Formal footwear" });
    }
  } else if (q.includes("warmer") || q.includes("winter") || q.includes("layer")) {
    const coat = products.find((p) => /coat|trench|cashmere|wrap/i.test(p.name));
    if (coat && current[0]) replacements.push({ fromId: current[0].id, toId: coat.id, reason: "Added warmth for cooler climate" });
  } else {
    // swap one piece toward preferred designer
    const preferred = current.find((p) => !profile.preferredDesigners.includes(p.brandId));
    if (preferred) {
      const alt = findSimilar(preferred, 10).find((p) => profile.preferredDesigners.includes(p.brandId));
      if (alt) replacements.push({ fromId: preferred.id, toId: alt.id, reason: `Closer to your preferred designers` });
    }
  }

  return {
    message:
      replacements.length > 0
        ? `I adjusted the look based on “${prompt.trim()}”, using your profile (${profile.location}, budget $${profile.budget}).`
        : `I kept the look intact — try asking to make it cheaper, more formal, or warmer.`,
    replacements,
  };
}

/** Helper for deep-links that mention a product by slug-ish text */
export function productIdFromText(text: string) {
  const slug = slugify(text);
  return products.find((p) => p.id.includes(slug) || slug.includes(p.id))?.id;
}
