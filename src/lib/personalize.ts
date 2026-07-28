import { products } from "./products";
import { brands } from "./brands";
import type { Product, StyleProfile } from "./types";
import { semanticSearch } from "./search";

/** Score a product against the shopper's style profile for ranking. */
export function personalizeScore(product: Product, profile: StyleProfile): number {
  let score = product.rating + product.reviewCount / 5000;

  if (profile.preferredDesigners.includes(product.brandId)) score += 4;
  if (profile.preferredCategories.includes(product.category)) score += 2.5;
  if (product.variants.some((v) =>
    profile.favoriteColors.some((c) => v.color.toLowerCase().includes(c.toLowerCase()))
  ))
    score += 2;
  if (product.occasions.some((o) => profile.occasions.includes(o))) score += 2;
  if (product.vibe.some((v) => profile.styleTags.some((t) => v.includes(t) || t.includes(v)))) score += 2;
  if (product.price <= profile.budget) score += 1.5;
  else score -= 1;

  if (profile.sustainabilityPreference === "require" && !product.isSustainable) score -= 8;
  if (profile.sustainabilityPreference === "prefer" && product.isSustainable) score += 2;

  if (profile.preferredFits.includes("relaxed") && product.vibe.some((v) => /relax|fluid|oversized/i.test(v)))
    score += 1;
  if (profile.preferredFits.includes("snug") && product.vibe.some((v) => /tailor|structur|fitted/i.test(v)))
    score += 1;

  return score;
}

export function personalizedProducts(profile: StyleProfile, limit = 8): Product[] {
  return [...products]
    .map((p) => ({ p, score: personalizeScore(p, profile) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.p);
}

export function personalizedSearch(query: string, profile: StyleProfile, limit = 24) {
  const base = semanticSearch(query, limit * 2);
  if (!base.length) {
    return personalizedProducts(profile, limit).map((product) => ({ product, score: personalizeScore(product, profile) }));
  }
  return base
    .map((r) => ({
      product: r.product,
      score: r.score + personalizeScore(r.product, profile) * 0.35,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function editorsPicks(profile: StyleProfile, limit = 8): Product[] {
  // Editor curation biased by profile — exclusive/new weighted
  return [...products]
    .map((p) => ({
      p,
      score:
        personalizeScore(p, profile) +
        (p.isExclusive ? 3 : 0) +
        (p.isNew ? 2 : 0) +
        (p.rating >= 4.7 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.p);
}

export function suggestedEmailSubjects(profile: StyleProfile): string[] {
  const designer = brands.find((b) => b.id === profile.preferredDesigners[0])?.name ?? "your designers";
  return [
    `New from ${designer} — within your $${profile.budget} edit`,
    `Editor's picks for ${profile.occasions[0] ?? "your week"}`,
    profile.sustainabilityPreference !== "any"
      ? "Conscious arrivals matched to your style"
      : "Looks saved for you this week",
  ];
}

export function suggestedPushCopy(profile: StyleProfile): string[] {
  return [
    `Low stock in your ${profile.preferredCategories[0] ?? "saved"} sizes`,
    `Price drop on a ${profile.favoriteColors[0] ?? "favorite"} piece`,
    `Fresh ${profile.styleTags[0] ?? "style"} picks for ${profile.location}`,
  ];
}
