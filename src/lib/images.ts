/**
 * Image library for Bosiano.
 *
 * Rules:
 * - Editorial / brand / category tiles may use shared lifestyle photography.
 * - Each product slug owns an independent gallery array (never shared by reference).
 * - Product detail pages must ONLY render that product’s gallery URLs.
 * - Never fall back to another product’s photos or category keyword pools for PDPs.
 */

const u = (id: string, w = 1400, extra = "") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85${extra}`;

/** Neutral placeholder when a product gallery is missing (never another SKU). */
export const DEFAULT_PRODUCT_PLACEHOLDER = "/brand/logo-emboss-beige.png";

/** Editorial / campaign / lifestyle heroes — NOT used as product galleries */
export const editorial = {
  "hero-autumn-campaign": u("photo-1483985988355-763728e1935b", 1600),
  "hero-riviera-film": u("photo-1469334031218-e382a71b716b", 1600),
  "hero-okoro-heritage": u("photo-1490481651871-ab68de25d43d", 1600),
  "loyalty-club": u("photo-1445205170230-053b83016050", 1800),
  "rewards-hero": u("photo-1490481651871-ab68de25d43d", 2000),
  "about-hero": u("photo-1441986300917-64674bd600d8", 2000),
  "about-editorial": u("photo-1558769132-cb1aea458c5e", 1600),
  "journal-tailoring": u("photo-1594938298603-c8148c4dae35", 1600),
  "journal-okoro": u("photo-1539109136881-3be0616acf4b", 1600),
  "journal-riviera": u("photo-1515886657613-9f3515b0c78f", 1600),
  "journal-sustainability": u("photo-1556905055-8f358a7a47b2", 1600),
  "journal-capsule": u("photo-1487222477894-8943e31ef7b2", 1600),
  "journal-signet": "/products/signet-vermeil-ring/gold-vermeil-03-face.png",
  "cat-women": u("photo-1496747611176-843222e1e57c", 1000, "&h=1500"),
  "cat-men": u("photo-1617137968427-85924c800a22", 1000, "&h=1500"),
  "cat-bags": "/products/crescent-shoulder-bag/blush-01-hero.png",
  "cat-shoes": "/products/minimalist-leather-sneaker/01-white-hero.png",
  "nav-new-1": u("photo-1496747611176-843222e1e57c", 900),
  "nav-women-1": u("photo-1515372039744-b8f02a3ae446", 900),
  "nav-men-1": u("photo-1617137968427-85924c800a22", 900),
  "nav-bags-1": u("photo-1591561954557-26941169b49e", 900),
  "nav-designers-1": u("photo-1558769132-cb1aea458c5e", 900),
  "nav-journal-1": u("photo-1483985988355-763728e1935b", 900),
  "look-quiet-luxury": u("photo-1539109136881-3be0616acf4b", 1200),
  "look-romantic-evening": u("photo-1515372039744-b8f02a3ae446", 1200),
  "look-riviera": u("photo-1515886657613-9f3515b0c78f", 1200),
  "look-modern-utility": u("photo-1552374196-1ab2a1c593e8", 1200),
  "look-artisan": u("photo-1490481651871-ab68de25d43d", 1200),
} as const;

/** Designer house heroes & editorial */
export const brandImages: Record<string, string[]> = {
  "verane-hero": [u("photo-1594938298603-c8148c4dae35", 1600), u("photo-1507679799987-c73779587ccf", 1400)],
  "norde-hero": [u("photo-1576566588028-4147f3842f27", 1600), u("photo-1487222477894-8943e31ef7b2", 1400)],
  "sanso-hero": [u("photo-1539109136881-3be0616acf4b", 1600), u("photo-1515886657613-9f3515b0c78f", 1400)],
  "okoro-hero": [u("photo-1490481651871-ab68de25d43d", 1600), u("photo-1539109136881-3be0616acf4b", 1400)],
  "hana-hero": [u("photo-1558769132-cb1aea458c5e", 1600), u("photo-1483985988355-763728e1935b", 1400)],
  "belrose-hero": [u("photo-1515372039744-b8f02a3ae446", 1600), u("photo-1496747611176-843222e1e57c", 1400)],
  "kestrel-hero": [u("photo-1552374196-1ab2a1c593e8", 1600), u("photo-1617137968427-85924c800a22", 1400)],
  "solene-hero": [u("photo-1469334031218-e382a71b716b", 1600), u("photo-1515886657613-9f3515b0c78f", 1400)],
  "bosiano-hero": ["/brand/bosiano-floral-handbag.png", "/brand/bosiano-sneaker-application.png"],
};

/**
 * Per-product galleries — each array is owned by that slug only.
 * Images are product-appropriate; no men’s suit on dresses, no jacket on shirts, etc.
 */
export const productImages: Record<string, string[]> = {
  /* —— Marketplace —— */
  "sculpted-wool-blazer": [
    "/products/sculpted-wool-blazer/charcoal-01-front.png",
    "/products/sculpted-wool-blazer/charcoal-02-threeq.png",
    "/products/sculpted-wool-blazer/charcoal-03-back.png",
    "/products/sculpted-wool-blazer/charcoal-04-lapel.png",
  ],
  "fluid-silk-slip-dress": ["/products/fluid-silk-slip-dress/blush-01-hero.png"],
  "organic-cotton-oversized-shirt": [
    "/products/organic-cotton-oversized-shirt/optic-white-01-hero.png",
    "/products/organic-cotton-oversized-shirt/optic-white-02-side.png",
    "/products/organic-cotton-oversized-shirt/optic-white-03-detail.png",
  ],
  "architectural-trench-coat": [
    "/products/architectural-trench-coat/sand-01-front.png",
    "/products/architectural-trench-coat/sand-02-angle.png",
    "/products/architectural-trench-coat/sand-03-side.png",
    "/products/architectural-trench-coat/sand-04-back.png",
    "/products/architectural-trench-coat/sand-05-detail.png",
    "/products/architectural-trench-coat/sand-06-worn.png",
  ],
  "adire-wrap-midi-skirt": [
    "/products/adire-wrap-midi-skirt/indigo-01-hero.png",
    "/products/adire-wrap-midi-skirt/indigo-02-detail.png",
  ],
  "boro-patchwork-jacket": ["/products/boro-patchwork-jacket/black-brown-01-hero.png"],
  "merino-crewneck-sweater": ["/products/merino-crewneck-sweater/oatmeal-01-hero.png"],
  "pleated-wide-leg-trouser": [
    "/products/pleated-wide-leg-trouser/charcoal-01-front.png",
    "/products/pleated-wide-leg-trouser/charcoal-03-threeq.png",
    "/products/pleated-wide-leg-trouser/charcoal-02-side.png",
    "/products/pleated-wide-leg-trouser/charcoal-06-back.png",
    "/products/pleated-wide-leg-trouser/charcoal-04-waist.png",
    "/products/pleated-wide-leg-trouser/charcoal-05-fabric.png",
    "/products/pleated-wide-leg-trouser/charcoal-07-worn.png",
  ],
  "riviera-linen-shirt": ["/products/riviera-linen-shirt/ivory-01-hero.png"],
  "crescent-shoulder-bag": [
    "/products/crescent-shoulder-bag/blush-01-hero.png",
    "/products/crescent-shoulder-bag/blush-02-side.png",
    "/products/crescent-shoulder-bag/blush-03-back.png",
    "/products/crescent-shoulder-bag/blush-04-interior.png",
    "/products/crescent-shoulder-bag/blush-06-hardware.png",
  ],
  "structured-leather-tote": ["/products/structured-leather-tote/01-cognac-hero.png"],
  "bosiano-cognac-flap-bag": [
    "/products/bosiano-cognac-flap-bag/cognac-01-front.png",
    "/products/bosiano-cognac-flap-bag/cognac-02-angle.png",
    "/products/bosiano-cognac-flap-bag/cognac-03-side.png",
    "/products/bosiano-cognac-flap-bag/cognac-04-back.png",
    "/products/bosiano-cognac-flap-bag/cognac-05-hardware.png",
    "/products/bosiano-cognac-flap-bag/cognac-06-leather.png",
    "/products/bosiano-cognac-flap-bag/cognac-07-interior.png",
  ],
  /* Unbranded minimalist leather sneakers — no Nike / swoosh / Air */
  "minimalist-leather-sneaker": ["/products/minimalist-leather-sneaker/01-white-hero.png"],
  /* Women's backless sculptural mule — Black / Bone only */
  "sculptural-heeled-mule": ["/products/sculptural-heeled-mule/01-black-hero.png"],
  /* Classic signet ring only — no pearls / necklaces / bracelets */
  "signet-vermeil-ring": [
    "/products/signet-vermeil-ring/gold-vermeil-01-hero.png",
    "/products/signet-vermeil-ring/gold-vermeil-02-side.png",
    "/products/signet-vermeil-ring/gold-vermeil-03-face.png",
    "/products/signet-vermeil-ring/gold-vermeil-04-worn.png",
    "/products/signet-vermeil-ring/gold-vermeil-05-engraving.png",
    "/products/signet-vermeil-ring/gold-vermeil-06-box.png",
  ],
  /* Twisted gold-vermeil hoops only — no rings / pendants / silver stock */
  "twisted-hoop-earrings": [
    "/products/twisted-hoop-earrings/gold-vermeil-01-hero.png",
    "/products/twisted-hoop-earrings/gold-vermeil-02-angle.png",
    "/products/twisted-hoop-earrings/gold-vermeil-03-texture.png",
    "/products/twisted-hoop-earrings/gold-vermeil-04-worn.png",
    "/products/twisted-hoop-earrings/gold-vermeil-05-clasp.png",
  ],
  "cashmere-travel-wrap": [
    "/products/cashmere-travel-wrap/fog-01-hero.png",
    "/products/cashmere-travel-wrap/fog-02-drape.png",
    "/products/cashmere-travel-wrap/fog-03-texture.png",
  ],
  "relaxed-selvedge-denim": ["/products/relaxed-selvedge-denim/raw-indigo-01-hero.png"],
  "field-utility-overshirt": ["/products/field-utility-overshirt/olive-green-01-hero.png"],
  "poplin-tiered-maxi-dress": ["/products/poplin-tiered-maxi-dress/white-01-hero.png"],
  "handwoven-aso-oke-clutch": [
    "/products/handwoven-aso-oke-clutch/gold-weave-01-hero.png",
    "/products/handwoven-aso-oke-clutch/gold-weave-02-side.png",
    "/products/handwoven-aso-oke-clutch/gold-weave-03-textile.png",
    "/products/handwoven-aso-oke-clutch/gold-weave-04-interior.png",
    "/products/handwoven-aso-oke-clutch/gold-weave-05-closure.png",
  ],
  "bosiano-crest-leather-handbag": [
    "/products/bosiano-crest-leather-handbag/botanical-cream-01-hero.png",
    "/products/bosiano-crest-leather-handbag/botanical-cream-02-side.png",
  ],
  "ribbed-tank-bodysuit": ["/products/ribbed-tank-bodysuit/black-01-hero.png"],
  "double-breasted-wool-coat": ["/products/double-breasted-wool-coat/camel-01-hero.png"],
  "suede-chelsea-boot": ["/products/suede-chelsea-boot/tobacco-01-hero.png"],
  "silk-twill-scarf": [
    "/products/silk-twill-scarf/rose-garden-01-flat.png",
    "/products/silk-twill-scarf/rose-garden-02-folded.png",
    "/products/silk-twill-scarf/rose-garden-03-edge.png",
  ],

  /* —— Bosiano Collection — product-owned assets only —— */
  "bosiano-crest-knit-sneaker": ["/products/bosiano-crest-knit-sneaker/burgundy-01-hero.png"],
  /* One master lattice scarf only — every frame is derived from champagne-01-flat */
  "bosiano-silk-twill-scarf": [
    "/products/bosiano-silk-twill-scarf/champagne-01-flat.png",
    "/products/bosiano-silk-twill-scarf/champagne-01b-flat.png",
    "/products/bosiano-silk-twill-scarf/champagne-02-folded.png",
    "/products/bosiano-silk-twill-scarf/champagne-03-draped.png",
    "/products/bosiano-silk-twill-scarf/champagne-05-edge.png",
    "/products/bosiano-silk-twill-scarf/champagne-06-label.png",
  ],
  "bosiano-crest-zip-wallet": [
    "/products/bosiano-crest-zip-wallet/cognac-01-hero.png",
    "/products/bosiano-crest-zip-wallet/cognac-02-interior.png",
    "/products/bosiano-crest-zip-wallet/cognac-03-crest.png",
  ],
  "bosiano-b-leather-belt": ["/products/bosiano-b-leather-belt/cognac-01-hero.png"],
  "bosiano-pearl-drop-earrings": [
    "/products/bosiano-pearl-drop-earrings/warm-pearl-01-hero.png",
    "/products/bosiano-pearl-drop-earrings/warm-pearl-02-angle.png",
    "/products/bosiano-pearl-drop-earrings/warm-pearl-03-detail.png",
  ],
  "bosiano-italian-heritage-parfum": [
    "/products/bosiano-italian-heritage-parfum/amber-01-front.png",
    "/products/bosiano-italian-heritage-parfum/amber-02-angle.png",
    "/products/bosiano-italian-heritage-parfum/amber-03-cap.png",
    "/products/bosiano-italian-heritage-parfum/amber-04-box.png",
    "/products/bosiano-italian-heritage-parfum/amber-05-liquid.png",
  ],
  "bosiano-crest-ring-box": [
    "/products/bosiano-crest-ring-box/matte-black-01-hero.png",
    "/products/bosiano-crest-ring-box/matte-black-02-open.png",
  ],
  "bosiano-crest-poplin-shirt": [
    "/products/bosiano-crest-poplin-shirt/ivory-01-hero.png",
    "/products/bosiano-crest-poplin-shirt/ivory-02-collar.png",
  ],
  "bosiano-heritage-watch": ["/products/bosiano-heritage-watch/two-tone-01-hero.png"],
  "bosiano-crest-tee": [
    "/products/bosiano-crest-tee/ivory-01-hero.png",
    "/products/bosiano-crest-tee/ivory-02-crest.png",
  ],
};

/** Internal gallery role captions — NEVER shown on customer-facing PDPs */
export const galleryStories: Record<string, string[]> = {};

function dedupeUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    if (!url || typeof url !== "string" || !url.trim()) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

/** Normalize colour label → imagesByColor key (e.g. "Optic White" → "optic-white") */
export function colorKey(color: string): string {
  return color
    .trim()
    .toLowerCase()
    .replace(/[/\s]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Color-specific galleries — shown when the shopper selects that colour.
 * Each array is an independent copy; never share references across products.
 */
export const productImagesByColor: Record<string, Record<string, string[]>> = {
  "crescent-shoulder-bag": {
    blush: [
      "/products/crescent-shoulder-bag/blush-01-hero.png",
      "/products/crescent-shoulder-bag/blush-02-side.png",
      "/products/crescent-shoulder-bag/blush-03-back.png",
      "/products/crescent-shoulder-bag/blush-04-interior.png",
      "/products/crescent-shoulder-bag/blush-06-hardware.png",
    ],
    chocolate: ["/products/crescent-shoulder-bag/chocolate-01-hero.png"],
    ecru: ["/products/crescent-shoulder-bag/ecru-01-hero.png"],
  },
  "sculptural-heeled-mule": {
    black: ["/products/sculptural-heeled-mule/01-black-hero.png"],
    bone: ["/products/sculptural-heeled-mule/04-bone-hero.png"],
  },
  "minimalist-leather-sneaker": {
    white: ["/products/minimalist-leather-sneaker/01-white-hero.png"],
    black: ["/products/minimalist-leather-sneaker/02-black-hero.png"],
    grey: ["/products/minimalist-leather-sneaker/03-grey-hero.png"],
  },
  "structured-leather-tote": {
    cognac: ["/products/structured-leather-tote/01-cognac-hero.png"],
    black: ["/products/structured-leather-tote/02-black-hero.png"],
    bone: ["/products/structured-leather-tote/bone-01-hero.png"],
  },
  "signet-vermeil-ring": {
    "gold-vermeil": [
      "/products/signet-vermeil-ring/gold-vermeil-01-hero.png",
      "/products/signet-vermeil-ring/gold-vermeil-02-side.png",
      "/products/signet-vermeil-ring/gold-vermeil-03-face.png",
      "/products/signet-vermeil-ring/gold-vermeil-04-worn.png",
      "/products/signet-vermeil-ring/gold-vermeil-05-engraving.png",
      "/products/signet-vermeil-ring/gold-vermeil-06-box.png",
    ],
    "sterling-silver": [
      "/products/signet-vermeil-ring/sterling-silver-01-hero.png",
      "/products/signet-vermeil-ring/sterling-silver-02-side.png",
      "/products/signet-vermeil-ring/sterling-silver-03-face.png",
      "/products/signet-vermeil-ring/sterling-silver-04-worn.png",
      "/products/signet-vermeil-ring/sterling-silver-05-engraving.png",
      "/products/signet-vermeil-ring/sterling-silver-06-box.png",
    ],
  },
  /* Same wrap silhouette — Fog / Charcoal / Camel */
  "cashmere-travel-wrap": {
    fog: [
      "/products/cashmere-travel-wrap/fog-01-hero.png",
      "/products/cashmere-travel-wrap/fog-02-drape.png",
      "/products/cashmere-travel-wrap/fog-03-texture.png",
    ],
    charcoal: ["/products/cashmere-travel-wrap/charcoal-01-hero.png"],
    camel: ["/products/cashmere-travel-wrap/camel-01-hero.png"],
  },
  /* Same Belrose botanical scarf — Rose Garden / Ocean */
  "silk-twill-scarf": {
    "rose-garden": [
      "/products/silk-twill-scarf/rose-garden-01-flat.png",
      "/products/silk-twill-scarf/rose-garden-02-folded.png",
      "/products/silk-twill-scarf/rose-garden-03-edge.png",
    ],
    ocean: [
      "/products/silk-twill-scarf/ocean-01-flat.png",
      "/products/silk-twill-scarf/ocean-02-folded.png",
    ],
  },
  /* BOS-SILK-SCARF-01 — champagne / cognac-forward; frames cropped from one master per color */
  "bosiano-silk-twill-scarf": {
    "champagne-border": [
      "/products/bosiano-silk-twill-scarf/champagne-01-flat.png",
      "/products/bosiano-silk-twill-scarf/champagne-01b-flat.png",
      "/products/bosiano-silk-twill-scarf/champagne-02-folded.png",
      "/products/bosiano-silk-twill-scarf/champagne-03-draped.png",
      "/products/bosiano-silk-twill-scarf/champagne-05-edge.png",
      "/products/bosiano-silk-twill-scarf/champagne-06-label.png",
    ],
    "cognac-border": [
      "/products/bosiano-silk-twill-scarf/cognac-01-flat.png",
      "/products/bosiano-silk-twill-scarf/cognac-02-folded.png",
      "/products/bosiano-silk-twill-scarf/cognac-05-edge.png",
      "/products/bosiano-silk-twill-scarf/cognac-06-label.png",
    ],
  },
  /* Same cognac flap bag silhouette — Cognac / Noir */
  "bosiano-cognac-flap-bag": {
    cognac: [
      "/products/bosiano-cognac-flap-bag/cognac-01-front.png",
      "/products/bosiano-cognac-flap-bag/cognac-02-angle.png",
      "/products/bosiano-cognac-flap-bag/cognac-03-side.png",
      "/products/bosiano-cognac-flap-bag/cognac-04-back.png",
      "/products/bosiano-cognac-flap-bag/cognac-05-hardware.png",
      "/products/bosiano-cognac-flap-bag/cognac-06-leather.png",
      "/products/bosiano-cognac-flap-bag/cognac-07-interior.png",
    ],
    noir: [
      "/products/bosiano-cognac-flap-bag/noir-01-front.png",
      "/products/bosiano-cognac-flap-bag/noir-02-angle.png",
      "/products/bosiano-cognac-flap-bag/noir-03-side.png",
      "/products/bosiano-cognac-flap-bag/noir-05-hardware.png",
    ],
  },
  /* Same oversized shirt silhouette — Optic White / Stone / Slate */
  "organic-cotton-oversized-shirt": {
    "optic-white": [
      "/products/organic-cotton-oversized-shirt/optic-white-01-hero.png",
      "/products/organic-cotton-oversized-shirt/optic-white-02-side.png",
      "/products/organic-cotton-oversized-shirt/optic-white-03-detail.png",
    ],
    stone: ["/products/organic-cotton-oversized-shirt/stone-01-hero.png"],
    slate: ["/products/organic-cotton-oversized-shirt/slate-01-hero.png"],
  },
  /* Women's sculpted wool blazer — Charcoal / Camel / Ivory (full silhouette heroes) */
  "sculpted-wool-blazer": {
    charcoal: [
      "/products/sculpted-wool-blazer/charcoal-01-front.png",
      "/products/sculpted-wool-blazer/charcoal-02-threeq.png",
      "/products/sculpted-wool-blazer/charcoal-03-back.png",
      "/products/sculpted-wool-blazer/charcoal-04-lapel.png",
    ],
    camel: [
      "/products/sculpted-wool-blazer/camel-01-front.png",
      "/products/sculpted-wool-blazer/camel-02-threeq.png",
      "/products/sculpted-wool-blazer/camel-03-back.png",
    ],
    ivory: [
      "/products/sculpted-wool-blazer/ivory-01-front.png",
      "/products/sculpted-wool-blazer/ivory-02-threeq.png",
      "/products/sculpted-wool-blazer/ivory-03-back.png",
    ],
  },
  "fluid-silk-slip-dress": {
    blush: ["/products/fluid-silk-slip-dress/blush-01-hero.png"],
    midnight: ["/products/fluid-silk-slip-dress/midnight-01-hero.png"],
    sage: ["/products/fluid-silk-slip-dress/sage-01-hero.png"],
  },
  /* Same architectural trench silhouette — Sand / Black (real black coat, not a tint) */
  "architectural-trench-coat": {
    sand: [
      "/products/architectural-trench-coat/sand-01-front.png",
      "/products/architectural-trench-coat/sand-02-angle.png",
      "/products/architectural-trench-coat/sand-03-side.png",
      "/products/architectural-trench-coat/sand-04-back.png",
      "/products/architectural-trench-coat/sand-05-detail.png",
      "/products/architectural-trench-coat/sand-06-worn.png",
    ],
    black: [
      "/products/architectural-trench-coat/black-01-front.png",
      "/products/architectural-trench-coat/black-02-angle.png",
      "/products/architectural-trench-coat/black-03-side.png",
      "/products/architectural-trench-coat/black-04-back.png",
      "/products/architectural-trench-coat/black-05-detail.png",
      "/products/architectural-trench-coat/black-06-worn.png",
    ],
  },
  /* Same wrap-midi silhouette — Indigo / Rust adire textile (real colour photos) */
  "adire-wrap-midi-skirt": {
    indigo: [
      "/products/adire-wrap-midi-skirt/indigo-01-hero.png",
      "/products/adire-wrap-midi-skirt/indigo-02-detail.png",
    ],
    rust: [
      "/products/adire-wrap-midi-skirt/rust-01-hero.png",
      "/products/adire-wrap-midi-skirt/rust-02-detail.png",
    ],
  },
  "twisted-hoop-earrings": {
    "gold-vermeil": [
      "/products/twisted-hoop-earrings/gold-vermeil-01-hero.png",
      "/products/twisted-hoop-earrings/gold-vermeil-02-angle.png",
      "/products/twisted-hoop-earrings/gold-vermeil-03-texture.png",
      "/products/twisted-hoop-earrings/gold-vermeil-04-worn.png",
      "/products/twisted-hoop-earrings/gold-vermeil-05-clasp.png",
    ],
  },
  "boro-patchwork-jacket": {
    "black-brown": ["/products/boro-patchwork-jacket/black-brown-01-hero.png"],
    "deep-indigo": ["/products/boro-patchwork-jacket/deep-indigo-01-hero.png"],
  },
  "merino-crewneck-sweater": {
    oatmeal: ["/products/merino-crewneck-sweater/oatmeal-01-hero.png"],
    forest: ["/products/merino-crewneck-sweater/forest-01-hero.png"],
    navy: ["/products/merino-crewneck-sweater/navy-01-hero.png"],
    black: ["/products/merino-crewneck-sweater/black-01-hero.png"],
  },
  "pleated-wide-leg-trouser": {
    charcoal: [
      "/products/pleated-wide-leg-trouser/charcoal-01-front.png",
      "/products/pleated-wide-leg-trouser/charcoal-03-threeq.png",
      "/products/pleated-wide-leg-trouser/charcoal-02-side.png",
      "/products/pleated-wide-leg-trouser/charcoal-06-back.png",
      "/products/pleated-wide-leg-trouser/charcoal-04-waist.png",
      "/products/pleated-wide-leg-trouser/charcoal-05-fabric.png",
      "/products/pleated-wide-leg-trouser/charcoal-07-worn.png",
    ],
    cream: [
      "/products/pleated-wide-leg-trouser/cream-01-front.png",
      "/products/pleated-wide-leg-trouser/cream-03-threeq.png",
      "/products/pleated-wide-leg-trouser/cream-02-side.png",
      "/products/pleated-wide-leg-trouser/cream-06-back.png",
      "/products/pleated-wide-leg-trouser/cream-04-waist.png",
      "/products/pleated-wide-leg-trouser/cream-05-fabric.png",
      "/products/pleated-wide-leg-trouser/cream-07-worn.png",
    ],
  },
  "riviera-linen-shirt": {
    ivory: ["/products/riviera-linen-shirt/ivory-01-hero.png"],
    sand: ["/products/riviera-linen-shirt/sand-01-hero.png"],
    sage: ["/products/riviera-linen-shirt/sage-01-hero.png"],
  },
  "relaxed-selvedge-denim": {
    "raw-indigo": ["/products/relaxed-selvedge-denim/raw-indigo-01-hero.png"],
    "washed-black": ["/products/relaxed-selvedge-denim/washed-black-01-hero.png"],
  },
  "field-utility-overshirt": {
    "olive-green": ["/products/field-utility-overshirt/olive-green-01-hero.png"],
    black: ["/products/field-utility-overshirt/black-01-hero.png"],
  },
  "poplin-tiered-maxi-dress": {
    white: ["/products/poplin-tiered-maxi-dress/white-01-hero.png"],
    lemon: ["/products/poplin-tiered-maxi-dress/lemon-01-hero.png"],
    cornflower: ["/products/poplin-tiered-maxi-dress/cornflower-01-hero.png"],
  },
  "handwoven-aso-oke-clutch": {
    "gold-weave": [
      "/products/handwoven-aso-oke-clutch/gold-weave-01-hero.png",
      "/products/handwoven-aso-oke-clutch/gold-weave-02-side.png",
      "/products/handwoven-aso-oke-clutch/gold-weave-03-textile.png",
      "/products/handwoven-aso-oke-clutch/gold-weave-04-interior.png",
      "/products/handwoven-aso-oke-clutch/gold-weave-05-closure.png",
    ],
    "indigo-weave": ["/products/handwoven-aso-oke-clutch/indigo-weave-01-hero.png"],
  },
  "ribbed-tank-bodysuit": {
    black: ["/products/ribbed-tank-bodysuit/black-01-hero.png"],
    white: ["/products/ribbed-tank-bodysuit/white-01-hero.png"],
    mocha: ["/products/ribbed-tank-bodysuit/mocha-01-hero.png"],
  },
  "double-breasted-wool-coat": {
    camel: ["/products/double-breasted-wool-coat/camel-01-hero.png"],
    "grey-melange": ["/products/double-breasted-wool-coat/grey-melange-01-hero.png"],
    black: ["/products/double-breasted-wool-coat/black-01-hero.png"],
  },
  "suede-chelsea-boot": {
    tobacco: ["/products/suede-chelsea-boot/tobacco-01-hero.png"],
    "charcoal-suede": ["/products/suede-chelsea-boot/charcoal-suede-01-hero.png"],
  },
  "bosiano-crest-leather-handbag": {
    "botanical-cream": [
      "/products/bosiano-crest-leather-handbag/botanical-cream-01-hero.png",
      "/products/bosiano-crest-leather-handbag/botanical-cream-02-side.png",
    ],
    /* Same BCLH-01 silhouette + shield clasp — espresso print only */
    "espresso-print": ["/products/bosiano-crest-leather-handbag/espresso-print-01-hero.png"],
  },
  "bosiano-crest-knit-sneaker": {
    burgundy: ["/products/bosiano-crest-knit-sneaker/burgundy-01-hero.png"],
    jet: ["/products/bosiano-crest-knit-sneaker/jet-01-hero.png"],
  },
  "bosiano-crest-zip-wallet": {
    cognac: [
      "/products/bosiano-crest-zip-wallet/cognac-01-hero.png",
      "/products/bosiano-crest-zip-wallet/cognac-02-interior.png",
      "/products/bosiano-crest-zip-wallet/cognac-03-crest.png",
    ],
    black: [
      "/products/bosiano-crest-zip-wallet/black-01-hero.png",
      "/products/bosiano-crest-zip-wallet/black-02-interior.png",
      "/products/bosiano-crest-zip-wallet/black-03-crest.png",
    ],
  },
  "bosiano-b-leather-belt": {
    cognac: ["/products/bosiano-b-leather-belt/cognac-01-hero.png"],
    black: ["/products/bosiano-b-leather-belt/black-01-hero.png"],
  },
  "bosiano-pearl-drop-earrings": {
    "warm-pearl": [
      "/products/bosiano-pearl-drop-earrings/warm-pearl-01-hero.png",
      "/products/bosiano-pearl-drop-earrings/warm-pearl-02-angle.png",
      "/products/bosiano-pearl-drop-earrings/warm-pearl-03-detail.png",
    ],
    "ivory-pearl": [
      "/products/bosiano-pearl-drop-earrings/ivory-pearl-01-hero.png",
      "/products/bosiano-pearl-drop-earrings/ivory-pearl-02-angle.png",
      "/products/bosiano-pearl-drop-earrings/ivory-pearl-03-detail.png",
    ],
  },
  "bosiano-italian-heritage-parfum": {
    amber: [
      "/products/bosiano-italian-heritage-parfum/amber-01-front.png",
      "/products/bosiano-italian-heritage-parfum/amber-02-angle.png",
      "/products/bosiano-italian-heritage-parfum/amber-03-cap.png",
      "/products/bosiano-italian-heritage-parfum/amber-04-box.png",
      "/products/bosiano-italian-heritage-parfum/amber-05-liquid.png",
    ],
  },
  "bosiano-crest-ring-box": {
    "matte-black": [
      "/products/bosiano-crest-ring-box/matte-black-01-hero.png",
      "/products/bosiano-crest-ring-box/matte-black-02-open.png",
    ],
    "cognac-leather": [
      "/products/bosiano-crest-ring-box/cognac-leather-01-hero.png",
      "/products/bosiano-crest-ring-box/cognac-leather-02-open.png",
    ],
  },
  "bosiano-crest-poplin-shirt": {
    ivory: [
      "/products/bosiano-crest-poplin-shirt/ivory-01-hero.png",
      "/products/bosiano-crest-poplin-shirt/ivory-02-collar.png",
    ],
    "soft-black": ["/products/bosiano-crest-poplin-shirt/soft-black-01-hero.png"],
    champagne: ["/products/bosiano-crest-poplin-shirt/champagne-01-hero.png"],
  },
  "bosiano-heritage-watch": {
    "two-tone": [
      "/products/bosiano-heritage-watch/two-tone-01-hero.png",
      "/products/bosiano-heritage-watch/two-tone-02-dial.png",
    ],
    terracotta: ["/products/bosiano-heritage-watch/terracotta-01-hero.png"],
  },
  "bosiano-crest-tee": {
    ivory: [
      "/products/bosiano-crest-tee/ivory-01-hero.png",
      "/products/bosiano-crest-tee/ivory-02-crest.png",
    ],
    jet: ["/products/bosiano-crest-tee/jet-01-hero.png"],
    "gold-dust": ["/products/bosiano-crest-tee/gold-dust-01-hero.png"],
  },
};

/**
 * Multi-colour SKUs: productImages must be the default colour gallery only —
 * never a mixed Unsplash pack of unrelated garments.
 * Overwrites productImages[slug] from the first imagesByColor entry when present.
 */
(function syncDefaultGalleriesFromColorMaps() {
  for (const [slug, byColor] of Object.entries(productImagesByColor)) {
    const keys = Object.keys(byColor);
    if (!keys.length) continue;
    const preferred =
      keys.find((k) => byColor[k]?.length && productImages[slug]?.[0] && byColor[k].includes(productImages[slug][0])) ??
      keys.find((k) => byColor[k]?.length) ??
      keys[0];
    const gallery = byColor[preferred];
    if (gallery?.length) {
      productImages[slug] = dedupeUrls([...gallery]);
    }
  }
})();

/**
 * One styleId per SKU — every colour variant must share this identifier.
 * Prevents tote-in-black / backpack-in-cognac style collisions.
 */
export const productStyleIdBySlug: Record<string, string> = {
  "crescent-shoulder-bag": "belrose-crescent-shoulder-bag-01",
  "sculptural-heeled-mule": "sculptural-heeled-mule-01",
  "signet-vermeil-ring": "signet-vermeil-ring-01",
  "minimalist-leather-sneaker": "minimalist-leather-sneaker-01",
  "structured-leather-tote": "sanso-structured-leather-tote-01",
  "suede-chelsea-boot": "suede-chelsea-boot-01",
  "cashmere-travel-wrap": "cashmere-travel-wrap-01",
  "silk-twill-scarf": "silk-twill-scarf-01",
  "bosiano-silk-twill-scarf": "bosiano-silk-twill-scarf-01",
  "bosiano-crest-knit-sneaker": "bosiano-crest-knit-sneaker-01",
  "bosiano-heritage-watch": "bosiano-heritage-watch-01",
  "organic-cotton-oversized-shirt": "organic-cotton-oversized-shirt-01",
  "merino-crewneck-sweater": "merino-crewneck-sweater-01",
  "fluid-silk-slip-dress": "belrose-fluid-silk-slip-dress-01",
  "handwoven-aso-oke-clutch": "okoro-handwoven-aso-oke-clutch-01",
  "bosiano-crest-leather-handbag": "bosiano-crest-leather-handbag-01",
  "bosiano-cognac-flap-bag": "bosiano-cognac-flap-bag-01",
  "bosiano-crest-ring-box": "bosiano-crest-ring-box-01",
  "bosiano-crest-zip-wallet": "bosiano-crest-zip-wallet-01",
  "bosiano-b-leather-belt": "bosiano-b-leather-belt-01",
  "architectural-trench-coat": "architectural-trench-coat-01",
  "sculpted-wool-blazer": "sculpted-wool-blazer-01",
  "adire-wrap-midi-skirt": "adire-wrap-midi-skirt-01",
  "twisted-hoop-earrings": "twisted-hoop-earrings-01",
  "bosiano-pearl-drop-earrings": "bosiano-pearl-drop-earrings-01",
  "bosiano-italian-heritage-parfum": "bosiano-italian-heritage-perfume-01",
  "bosiano-crest-poplin-shirt": "bosiano-crest-poplin-shirt-01",
  "bosiano-crest-tee": "bosiano-crest-tee-01",
  "riviera-linen-shirt": "riviera-linen-shirt-01",
  "pleated-wide-leg-trouser": "pleated-wide-leg-trouser-01",
  "relaxed-selvedge-denim": "relaxed-selvedge-denim-01",
  "boro-patchwork-jacket": "boro-patchwork-jacket-01",
  "field-utility-overshirt": "field-utility-overshirt-01",
  "poplin-tiered-maxi-dress": "poplin-tiered-maxi-dress-01",
  "double-breasted-wool-coat": "double-breasted-wool-coat-01",
  "ribbed-tank-bodysuit": "ribbed-tank-bodysuit-01",
};

/** Physical design id — all colour galleries of one SKU share this */
export const productDesignIdBySlug: Record<string, string> = {
  "bosiano-cognac-flap-bag": "BCFB-01",
  "bosiano-crest-leather-handbag": "BCLH-01",
  "crescent-shoulder-bag": "CRESCENT-SHOULDER-BAG-01",
  "fluid-silk-slip-dress": "BFSD-01",
  "organic-cotton-oversized-shirt": "OCOS-01",
  "merino-crewneck-sweater": "MCRS-01",
  "handwoven-aso-oke-clutch": "HAOC-01",
  "structured-leather-tote": "SLT-01",
  "architectural-trench-coat": "architectural-trench-coat-01",
  "bosiano-silk-twill-scarf": "BOS-SILK-SCARF-01",
  "bosiano-crest-knit-sneaker": "BOS-SNEAKER-01",
  "sculpted-wool-blazer": "SWB-01",
  "adire-wrap-midi-skirt": "AWMS-01",
  "twisted-hoop-earrings": "THE-01",
  "bosiano-crest-zip-wallet": "BOS-ZIP-WALLET-01",
  "poplin-tiered-maxi-dress": "POPLIN-MAXI-01",
  "double-breasted-wool-coat": "DB-WOOL-COAT-01",
  "bosiano-b-leather-belt": "BOS-BELT-01",
  "bosiano-pearl-drop-earrings": "BOS-PEARL-DROP-01",
  "signet-vermeil-ring": "SIGNET-RING-01",
  "bosiano-italian-heritage-parfum": "BOS-PERFUME-01",
  "bosiano-crest-ring-box": "BOS-RINGBOX-01",
  "bosiano-crest-poplin-shirt": "BOS-POPLIN-01",
  "bosiano-crest-tee": "BOS-TEE-01",
  "bosiano-heritage-watch": "BOS-WATCH-01",
  "riviera-linen-shirt": "RIVIERA-LINEN-SHIRT-01",
  "pleated-wide-leg-trouser": "PLEATED-WIDE-LEG-PANT-01",
  "relaxed-selvedge-denim": "RELAXED-DENIM-01",
  "boro-patchwork-jacket": "BORO-JACKET-01",
  "field-utility-overshirt": "FIELD-OVERSHIRT-01",
};

/** Canonical productType per slug — used by catalog validators */
export const productTypeBySlug: Record<string, string> = {
  "fluid-silk-slip-dress": "slip-dress",
  "crescent-shoulder-bag": "shoulder-bag",
  "sculptural-heeled-mule": "heeled-mule",
  "signet-vermeil-ring": "ring",
  "minimalist-leather-sneaker": "sneaker",
  "structured-leather-tote": "tote",
  "suede-chelsea-boot": "boot",
  "organic-cotton-oversized-shirt": "shirt",
  "merino-crewneck-sweater": "crewneck-sweater",
  "handwoven-aso-oke-clutch": "clutch",
  "bosiano-crest-leather-handbag": "shoulder-bag",
  "bosiano-cognac-flap-bag": "shoulder-bag",
  "cashmere-travel-wrap": "wrap",
  "silk-twill-scarf": "scarf",
  "bosiano-silk-twill-scarf": "scarf",
  "bosiano-crest-knit-sneaker": "sneaker",
  "architectural-trench-coat": "trench-coat",
  "sculpted-wool-blazer": "blazer",
  "adire-wrap-midi-skirt": "wrap-skirt",
  "twisted-hoop-earrings": "earring",
  "bosiano-crest-zip-wallet": "wallet",
  "bosiano-b-leather-belt": "belt",
  "bosiano-pearl-drop-earrings": "earring",
  "bosiano-italian-heritage-parfum": "perfume",
  "bosiano-crest-ring-box": "ring-box",
  "bosiano-crest-poplin-shirt": "poplin-shirt",
  "bosiano-crest-tee": "tee",
  "bosiano-heritage-watch": "watch",
  "riviera-linen-shirt": "linen-shirt",
  "pleated-wide-leg-trouser": "trouser",
  "relaxed-selvedge-denim": "denim",
  "boro-patchwork-jacket": "jacket",
  "field-utility-overshirt": "overshirt",
  "poplin-tiered-maxi-dress": "dress",
  "double-breasted-wool-coat": "coat",
};

/** Signature hardware identity — must stay constant across a SKU’s galleries */
export const productHardwareIdBySlug: Record<string, string> = {
  "bosiano-crest-leather-handbag": "BOSIANO-SHIELD-CLASP-01",
  "bosiano-cognac-flap-bag": "BOSIANO-SHIELD-CLASP-01",
  "bosiano-crest-zip-wallet": "BOSIANO-SHIELD-EMBOSS-01",
  "bosiano-b-leather-belt": "BOSIANO-B-BUCKLE-01",
  "bosiano-crest-knit-sneaker": "BOSIANO-CREST-HEEL-01",
};

/** Per-colour hardware overrides (e.g. pearl tone + metal finish variants) */
export const productHardwareIdByColor: Record<string, Record<string, string>> = {
  "bosiano-pearl-drop-earrings": {
    "warm-pearl": "BOSIANO-PEARL-CLASP-GOLD-01",
    "ivory-pearl": "BOSIANO-PEARL-CLASP-SILVER-01",
  },
};

/** Print / pattern identity — must stay constant across scarf (and similar) galleries */
export const productPatternIdBySlug: Record<string, string> = {
  "bosiano-silk-twill-scarf": "BOS-LATTICE-01",
};

/** Border construction identity */
export const productBorderStyleIdBySlug: Record<string, string> = {
  "bosiano-silk-twill-scarf": "BOS-COGNAC-BORDER-01",
};

/** Paths / URL fragments that must never appear on non-Nike SKUs */
export const COMPETITOR_IMAGE_PATTERNS = [
  /nike/i,
  /swoosh/i,
  /air[- ]?force/i,
  /air[- ]?max/i,
  /dri[- ]?fit/i,
  /nike\.com/i,
  /zara/i,
  /comme[\s-]?des[\s-]?garcons/i,
  /comme/i,
  /photo-1542291026/i, // known Nike red sneaker
  /photo-1600269452121/i, // Nike AF1 lifestyle
  /photo-1606107557195/i, // Nike training
  /photo-1549298916/i, // Nike x Carhartt
  /photo-1460353581641/i, // Nike Air Max on feet
  /photo-1595950653106/i, // Nike AF1 Shadow
  /photo-1600185365483/i, // Nike Air Max 1
];

/** Suspicious cross-type image signals (dev / CI) */
export const PRODUCT_TYPE_FORBIDDEN_PATHS: Record<string, RegExp[]> = {
  ring: [/necklace|pearl|bracelet|earring|backpack|boot|sneaker|mule/i],
  "heeled-mule": [/boot|sneaker|nike|floral|pump|lace-up|backpack|necklace/i],
  "shoulder-bag": [/backpack|tote\/|boot|sneaker|ring|necklace|dress|rack/i],
  clutch: [/dress|skirt|blouse|t-?shirt|tee-|jacket|coat|rack|hanging|apparel/i],
  sneaker: [/nike|swoosh|air[- ]?max|boot|mule|heel|necklace/i],
  tote: [/crescent|backpack|sneaker|mule|ring/i],
  boot: [/mule|heel|sneaker|nike|floral/i],
  wrap: [/t-?shirt|tee-|graphic|dress|sneaker|boot|rack|jacket/i],
  scarf: [/dress|jacket|rack|street|t-?shirt|tee-|sweater|coat|blazer|sneaker|trouser|watch/i],
  shirt: [/hoodie|sweatshirt|turtleneck|sneaker|boot|mule|necklace/i],
  "crewneck-sweater": [/hoodie|cardigan|turtleneck|t-?shirt|tee-|sneaker|boot/i],
  "trench-coat": [/sneaker|shoe|trouser|watch|comme|nike|flat-?lay-outfit|t-?shirt|tee-/i],
  blazer: [/trouser-suit|three-piece|windowpane|necktie|suit-vest|waistcoat/i],
  "wrap-skirt": [/mini-pleat|sneaker|blazer|trouser|ring|necklace/i],
  earring: [/ring\/|signet|pendant|necklace|bracelet|silver-hoop|photo-1605100804763|photo-1599643478518/i],
  perfume: [/logo-heritage|crest-gold\.png|jewelry-box|handbag|sneaker|tee-|t-shirt/i],
  "ring-box": [/necklace|pearl-strand|shopping-bag|handbag|sneaker|tee-/i],
  "poplin-shirt": [/crewneck|jersey-tee|t-shirt|tee-|hoodie/i],
  tee: [/poplin|button-front|dress-shirt|collar-placket|cufflink/i],
};

/**
 * Owned gallery for a product slug — independent copy, deduped.
 * Colour selects imagesByColor[colorId] when present.
 * Never returns another product’s images or category keyword pools.
 */
export function getProductGallery(slug: string, color?: string): string[] {
  const byColor = productImagesByColor[slug];
  if (color && byColor) {
    const keyed = byColor[colorKey(color)];
    if (keyed?.length) return dedupeUrls([...keyed]);
    /* Colour map exists but this swatch has no gallery — do NOT fall back to mixed defaults */
    if (process.env.NODE_ENV === "development") {
      console.warn(`[images] Missing imagesByColor["${slug}"]["${colorKey(color)}"] — placeholder`);
    }
    return [DEFAULT_PRODUCT_PLACEHOLDER];
  }

  const list = productImages[slug];
  if (!list?.length) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[images] Missing gallery for product "${slug}" — using placeholder`);
    }
    return [DEFAULT_PRODUCT_PLACEHOLDER];
  }
  return dedupeUrls([...list]);
}

/** Card / shop grid image — always first owned gallery frame */
export function getProductCardImage(slug: string, color?: string): string {
  return getProductGallery(slug, color)[0] ?? DEFAULT_PRODUCT_PLACEHOLDER;
}

export function productGalleryLength(slug: string): number {
  return getProductGallery(slug).length;
}

export function galleryStoryLabel(slug: string, index: number): string | undefined {
  return galleryStories[slug]?.[index];
}

/** Product-specific alt text for gallery frames */
export function productImageAlt(productName: string, color: string | undefined, index: number, role?: string): string {
  const colorBit = color ? ` in ${color}` : "";
  const roleBit = role ? ` — ${role}` : index === 0 ? " — hero" : ` — view ${index + 1}`;
  return `${productName}${colorBit}${roleBit}`;
}

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Longest-slug-first match for seeds like `fluid-silk-slip-dress-0-2` */
function productSlugFromSeed(seed: string): string | null {
  const spin = seed.match(/^(.+)-spin-\d+$/);
  if (spin) return spin[1];
  const video = seed.match(/^(.+)-video$/);
  if (video) return video[1];

  const gallery = seed.match(/^(.+)-(\d+)-(\d+)$/);
  if (gallery) {
    const candidate = gallery[1];
    if (candidate in productImages) return candidate;
  }

  const slugs = Object.keys(productImages).sort((a, b) => b.length - a.length);
  for (const slug of slugs) {
    if (seed === slug || seed.startsWith(`${slug}-`)) return slug;
  }
  return null;
}

/**
 * Resolve Media seeds / absolute paths.
 * Product seeds resolve ONLY to that product’s gallery — never category pools.
 */
export function resolveImage(seed: string): string {
  if (seed.startsWith("/") || seed.startsWith("http://") || seed.startsWith("https://")) {
    return seed;
  }

  if (seed in editorial) return editorial[seed as keyof typeof editorial];

  const brandKey = seed.replace(/-editorial$/, "");
  if (brandKey in brandImages) {
    const list = brandImages[brandKey];
    return seed.endsWith("-editorial") ? list[1] ?? list[0] : list[0];
  }

  if (seed.startsWith("look-")) {
    const key = seed as keyof typeof editorial;
    if (key in editorial) return editorial[key];
    return editorial["look-quiet-luxury"];
  }

  if (seed.startsWith("tryon-")) {
    const slug = productSlugFromSeed(seed.replace(/^tryon-/, "")) ?? Object.keys(productImages).find((s) => seed.includes(s));
    if (slug) {
      const g = getProductGallery(slug);
      return g[Math.min(1, g.length - 1)] ?? g[0];
    }
    return DEFAULT_PRODUCT_PLACEHOLDER;
  }

  const slug = productSlugFromSeed(seed);
  if (slug) {
    const list = getProductGallery(slug);
    const gallery = seed.match(/^.+-(\d+)-(\d+)$/);
    if (gallery) {
      const imageIndex = Number(gallery[2]);
      return list[imageIndex % list.length] ?? list[0];
    }
    const spin = seed.match(/^.+-spin-(\d+)$/);
    if (spin) return list[Number(spin[1]) % list.length] ?? list[0];
    if (seed.endsWith("-video")) return list[Math.min(1, list.length - 1)] ?? list[0];
    return list[hash(seed) % list.length] ?? list[0];
  }

  /* Non-product seeds (legacy editorial keys) — never invent a random product photo */
  if (process.env.NODE_ENV === "development") {
    console.warn(`[images] Unresolved seed "${seed}" — placeholder`);
  }
  return DEFAULT_PRODUCT_PLACEHOLDER;
}
