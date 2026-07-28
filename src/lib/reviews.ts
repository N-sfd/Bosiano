import type { Product, Review } from "./types";
import { seeded } from "./utils";

const authors = ["Amelia R.", "James T.", "Sofia L.", "Noah K.", "Isabelle M.", "Liam C.", "Yuki T.", "Chloe D.", "Marcus B.", "Priya S."];
const titles = [
  "Exceeded my expectations",
  "A forever piece",
  "Beautifully made",
  "Worth every penny",
  "My new favourite",
  "Impeccable quality",
  "So elegant in person",
  "Perfect fit",
];
const bodies = [
  "The quality is exceptional — you can feel it the moment you unbox it. The fabric drapes beautifully and the construction is flawless.",
  "I've worn this constantly since it arrived. It's become the anchor of my wardrobe and pairs with everything.",
  "Runs true to size and the colour is exactly as pictured. The attention to detail is what sets it apart.",
  "An investment piece that feels timeless rather than trendy. I'll be wearing this for years.",
  "The finishing is remarkable. Every seam is considered. This is what luxury should feel like.",
  "Arrived beautifully packaged and even better than I hoped. The fit is impeccable.",
];
const fits: Review["fit"][] = ["small", "true", "true", "true", "large"];

export function getReviews(product: Product): Review[] {
  const rnd = seeded(product.id.length * 131 + product.reviewCount);
  const count = Math.min(6, 3 + Math.floor(rnd() * 4));
  return Array.from({ length: count }, (_, i) => {
    const rating = Math.max(3, Math.round((product.rating + (rnd() - 0.5)) * 2) / 2);
    return {
      id: `${product.id}-r${i}`,
      productId: product.id,
      author: authors[Math.floor(rnd() * authors.length)],
      rating: Math.min(5, rating),
      title: titles[Math.floor(rnd() * titles.length)],
      body: bodies[Math.floor(rnd() * bodies.length)],
      date: new Date(2026, 6 - i, 1 + Math.floor(rnd() * 27)).toISOString().slice(0, 10),
      fit: fits[Math.floor(rnd() * fits.length)],
      verified: rnd() > 0.15,
    };
  });
}

export function ratingBreakdown(product: Product) {
  const rnd = seeded(product.reviewCount + 17);
  const dist = [0, 0, 0, 0, 0];
  dist[4] = 0.62 + rnd() * 0.2;
  dist[3] = 0.18 + rnd() * 0.08;
  dist[2] = 0.08 * rnd();
  dist[1] = 0.04 * rnd();
  dist[0] = 0.02 * rnd();
  const sum = dist.reduce((a, b) => a + b, 0);
  return dist.map((d) => Math.round((d / sum) * 100));
}
