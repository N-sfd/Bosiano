import type { Product } from "./types";

export type TryOnModality = "clothing" | "shoes" | "bags" | "jewelry" | "eyewear" | "makeup";

export function modalityForProduct(product: Product): TryOnModality {
  const hay = `${product.category} ${product.subcategory} ${product.tags.join(" ")} ${product.name}`.toLowerCase();
  if (/sunglass|eyewear|optical|frame/.test(hay)) return "eyewear";
  if (/makeup|beauty|lip|blush|foundation/.test(hay)) return "makeup";
  if (product.category === "shoes") return "shoes";
  if (product.category === "bags") return "bags";
  if (product.category === "jewelry") return "jewelry";
  return "clothing";
}

export function tryOnSupported(product: Product): boolean {
  const m = modalityForProduct(product);
  // Selected clothing: women/men/unisex apparel + accessories categories
  if (m === "clothing") return ["women", "men"].includes(product.category) || product.gender !== undefined;
  return true;
}

export const modalityCopy: Record<
  TryOnModality,
  { title: string; hint: string; overlay: string }
> = {
  clothing: {
    title: "Apparel try-on",
    hint: "Visualize drape and silhouette on your body profile.",
    overlay: "Fit simulation maps ease through shoulder, waist, and hem.",
  },
  shoes: {
    title: "Footwear try-on",
    hint: "Preview proportion and last shape against your shoe size.",
    overlay: "Length and width compared to your saved EU size.",
  },
  bags: {
    title: "Bag try-on",
    hint: "See scale against your frame — crossbody, tote, or clutch.",
    overlay: "Scale simulation relative to torso height.",
  },
  jewelry: {
    title: "Jewelry try-on",
    hint: "Place earrings, rings, or necklaces on your portrait.",
    overlay: "Placement calibrated to facial landmarks.",
  },
  eyewear: {
    title: "Eyewear try-on",
    hint: "Frame width and bridge fit on your face shape.",
    overlay: "Pupillary distance and temple length estimated.",
  },
  makeup: {
    title: "Makeup try-on",
    hint: "Preview shade against your undertone.",
    overlay: "Shade match using lighting-normalized skin tone.",
  },
};

export function fitSimulation(
  product: Product,
  body: { heightCm: number; weightKg: number; bodyType: string; preferredFit: string },
  size: string
) {
  const bmi = body.weightKg / (body.heightCm / 100) ** 2;
  const fit = body.preferredFit || "regular";
  let verdict = "True to size";
  let detail = `Size ${size} should sit as intended for a ${body.bodyType.toLowerCase()} frame.`;

  if (fit === "snug" || bmi > 24) {
    verdict = "Consider sizing up";
    detail = `For a ${fit} preference, ${size} may feel close — the next size offers ease.`;
  } else if (fit === "relaxed" || body.bodyType === "Petite") {
    verdict = "Consider sizing down";
    detail = `A ${fit} look on a ${body.bodyType.toLowerCase()} frame often prefers a closer cut.`;
  }

  if (/oversized|relaxed/i.test(product.vibe.join(" ")) && fit === "snug") {
    verdict = "Roomy cut";
    detail = "This silhouette is designed with ease — stay true to size for the intended volume.";
  }

  return {
    verdict,
    detail,
    stretch: product.materialTags.some((m) => /wool|knit|cashmere|jersey/i.test(m)) ? "Moderate give" : "Low give",
    length: body.heightCm >= 175 ? "May read short on taller frames" : "Proportionate length",
  };
}

export function sizeComparison(product: Product, yourSize: string) {
  const idx = product.sizes.indexOf(yourSize);
  const rows = product.sizes.map((s, i) => ({
    size: s,
    relation: idx < 0 ? "—" : i === idx ? "Your size" : i < idx ? "Smaller" : "Larger",
    note:
      i === idx
        ? "Saved profile match"
        : Math.abs(i - idx) === 1
          ? "Adjacent — useful for fit preference"
          : "",
  }));
  return rows;
}
