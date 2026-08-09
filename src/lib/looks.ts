import type { ShopLook } from "./types";
import { products, getProduct } from "./products";

export const lookSourceLabels: Record<ShopLook["source"], string> = {
  campaign: "Campaign",
  editorial: "Editorial",
  influencer: "Influencer",
  runway: "Runway",
  customer: "Customer upload",
};

export const looks: ShopLook[] = [
  {
    id: "autumn-tailoring-campaign",
    slug: "autumn-tailoring-campaign",
    title: "Autumn Tailoring Campaign",
    dek: "Maison Vérane's soft-power uniform — blazer, wide-leg pant, sculptural mule.",
    source: "campaign",
    sourceLabel: "Maison Vérane FW26 Campaign",
    hero: "look-quiet-luxury",
    swatches: ["#2f3033", "#cbb9a2", "#efe9dd"],
    occasion: ["work", "office"],
    climate: "cool",
    tags: ["tailoring", "minimal", "quiet luxury"],
    featured: true,
    hotspots: [
      { id: "h1", productId: "sculpted-wool-blazer", label: "Blazer", category: "clothing", x: 42, y: 28 },
      { id: "h2", productId: "pleated-wide-leg-trouser", label: "Trousers", category: "clothing", x: 48, y: 62 },
      { id: "h3", productId: "sculptural-heeled-mule", label: "Mule", category: "shoes", x: 58, y: 88 },
      { id: "h4", productId: "signet-vermeil-ring", label: "Ring", category: "accessories", x: 72, y: 48 },
    ],
  },
  {
    id: "new-tailoring-editorial",
    slug: "new-tailoring-editorial",
    title: "The New Tailoring Editorial",
    dek: "Shop the Journal story — fluid structure for studio-to-dinner days.",
    source: "editorial",
    sourceLabel: "The Bosiano Journal",
    hero: "journal-tailoring",
    swatches: ["#2f3033", "#8a6a2c", "#d9b9b1"],
    occasion: ["work", "evening"],
    climate: "mild",
    tags: ["editorial", "tailoring", "elegant"],
    featured: true,
    hotspots: [
      { id: "h1", productId: "sculpted-wool-blazer", label: "Blazer", category: "clothing", x: 38, y: 30 },
      { id: "h2", productId: "merino-crewneck-sweater", label: "Knit", category: "clothing", x: 45, y: 48 },
      { id: "h3", productId: "pleated-wide-leg-trouser", label: "Trousers", category: "clothing", x: 50, y: 70 },
      { id: "h4", productId: "crescent-shoulder-bag", label: "Bag", category: "bags", x: 78, y: 55 },
    ],
  },
  {
    id: "riviera-influencer",
    slug: "riviera-influencer",
    title: "Golden Hour Riviera",
    dek: "Influencer edit from Capri — linen, silk scarf, and an easy tote.",
    source: "influencer",
    sourceLabel: "@marina.edit · Capri",
    hero: "look-riviera",
    swatches: ["#a9c4d6", "#e9e2d3", "#c07a55"],
    occasion: ["vacation", "resort"],
    climate: "warm",
    tags: ["resort", "linen", "summer"],
    featured: true,
    hotspots: [
      { id: "h1", productId: "riviera-linen-shirt", label: "Linen shirt", category: "clothing", x: 40, y: 32 },
      { id: "h2", productId: "adire-wrap-midi-skirt", label: "Wrap skirt", category: "clothing", x: 48, y: 68 },
      { id: "h3", productId: "structured-leather-tote", label: "Tote", category: "bags", x: 78, y: 50 },
      { id: "h4", productId: "silk-twill-scarf", label: "Scarf", category: "accessories", x: 30, y: 22 },
    ],
  },
  {
    id: "okoro-runway",
    slug: "okoro-runway",
    title: "Okoro Runway Look 07",
    dek: "Heritage craft on the runway — wrap skirt, clutch, and sculptural jewelry.",
    source: "runway",
    sourceLabel: "Okoro Lagos Runway",
    hero: "look-artisan",
    swatches: ["#2a3b57", "#a4562f", "#b5904a"],
    occasion: ["evening", "formal"],
    climate: "warm",
    tags: ["runway", "statement", "heritage"],
    video: true,
    featured: true,
    hotspots: [
      { id: "h1", productId: "adire-wrap-midi-skirt", label: "Wrap skirt", category: "clothing", x: 46, y: 60 },
      { id: "h2", productId: "ribbed-tank-bodysuit", label: "Bodysuit", category: "clothing", x: 44, y: 34 },
      { id: "h3", productId: "handwoven-aso-oke-clutch", label: "Clutch", category: "bags", x: 72, y: 58 },
      { id: "h4", productId: "twisted-hoop-earrings", label: "Earrings", category: "accessories", x: 58, y: 18 },
    ],
  },
  {
    id: "customer-quiet-luxury",
    slug: "customer-quiet-luxury",
    title: "Client Look · Quiet Luxury",
    dek: "Uploaded by a Bosiano Club member — refined neutrals for city evenings.",
    source: "customer",
    sourceLabel: "Customer upload · Sofia K.",
    hero: "look-romantic-evening",
    swatches: ["#d9b9b1", "#1c1f2a", "#c98a8a"],
    occasion: ["evening", "date"],
    climate: "cool",
    tags: ["customer", "romantic", "evening"],
    featured: true,
    hotspots: [
      { id: "h1", productId: "fluid-silk-slip-dress", label: "Slip dress", category: "clothing", x: 48, y: 45 },
      { id: "h2", productId: "sculptural-heeled-mule", label: "Mule", category: "shoes", x: 55, y: 88 },
      { id: "h3", productId: "crescent-shoulder-bag", label: "Bag", category: "bags", x: 74, y: 52 },
      { id: "h4", productId: "twisted-hoop-earrings", label: "Earrings", category: "accessories", x: 60, y: 20 },
    ],
  },
  {
    id: "utility-weekend",
    slug: "utility-weekend",
    title: "Modern Utility Weekend",
    dek: "Campaign still — overshirt, denim, sneaker, and everyday tote.",
    source: "campaign",
    sourceLabel: "SÀNSO Utility Campaign",
    hero: "look-modern-utility",
    swatches: ["#5c5a3c", "#2b3852", "#43434a"],
    occasion: ["everyday", "casual"],
    climate: "mild",
    tags: ["utility", "weekend", "denim"],
    hotspots: [
      { id: "h1", productId: "field-utility-overshirt", label: "Overshirt", category: "clothing", x: 42, y: 30 },
      { id: "h2", productId: "relaxed-selvedge-denim", label: "Denim", category: "clothing", x: 48, y: 65 },
      { id: "h3", productId: "minimalist-leather-sneaker", label: "Sneaker", category: "shoes", x: 52, y: 90 },
      { id: "h4", productId: "structured-leather-tote", label: "Tote", category: "bags", x: 76, y: 48 },
    ],
  },
];

export function getLook(slug: string) {
  return looks.find((l) => l.slug === slug || l.id === slug);
}

export function looksBySource(source?: ShopLook["source"]) {
  if (!source) return looks;
  return looks.filter((l) => l.source === source);
}

export function resolveLookProducts(look: ShopLook, replacements: Record<string, string> = {}) {
  return look.hotspots
    .map((h) => {
      const productId = replacements[h.id] ?? h.productId;
      const product = getProduct(productId);
      return product ? { hotspot: h, product } : null;
    })
    .filter(Boolean) as { hotspot: (typeof look.hotspots)[0]; product: NonNullable<ReturnType<typeof getProduct>> }[];
}

export function lookTotal(look: ShopLook, replacements: Record<string, string> = {}) {
  return resolveLookProducts(look, replacements).reduce((sum, { product }) => sum + product.price, 0);
}

export function alternativesForHotspot(look: ShopLook, hotspotId: string, limit = 6) {
  const hotspot = look.hotspots.find((h) => h.id === hotspotId);
  if (!hotspot) return [];
  const current = getProduct(hotspot.productId);
  if (!current) return [];
  return products
    .filter((p) => p.id !== current.id)
    .map((p) => ({
      p,
      score:
        (p.category === current.category ? 3 : 0) +
        (p.subcategory === current.subcategory ? 4 : 0) +
        p.vibe.filter((v) => current.vibe.includes(v)).length * 2 +
        (hotspot.category === "bags" && p.category === "bags" ? 5 : 0) +
        (hotspot.category === "shoes" && p.category === "shoes" ? 5 : 0) +
        (hotspot.category === "accessories" && (p.category === "jewelry" || p.subcategory === "Accessories") ? 4 : 0),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.p.price - b.p.price)
    .slice(0, limit)
    .map((r) => r.p);
}
