/**
 * Centralized Bosiano brand identity — single source of truth.
 *
 * Recognition hierarchy (customers recognise the house by design language):
 * 1. Shield Crest  — iconic hardware signature (primary)
 * 2. B Monogram    — everyday small-scale hardware
 * 3. BOSIANO Wordmark — elegance in packaging & digital
 * 4. Full Crest + Wordmark — flagship brand-building only
 */

export const brand = {
  name: "BOSIANO",
  displayName: "Bosiano",
  subtitle: "ITALIAN HERITAGE",
  tagline: "Italian Heritage",
  origin: "Milan, Italy",
  clubName: "Bosiano Club",
  journalName: "The Bosiano Journal",

  colors: {
    black: "#0B0B0B",
    ivory: "#F7F4EF",
    gold: "#C8A96A",
    navy: "#0C1622",
    guideGold: "#D4AF37",
  },

  /**
   * Hardware metal finishes — never mirror-polished on everyday products.
   */
  hardwareFinishes: {
    preferred: ["satin-gold", "brushed-gold", "antique-gold", "matte-champagne"] as const,
    avoid: ["mirror-polish"] as const,
  },

  /**
   * Four-tier identity system
   */
  identity: {
    shield: {
      name: "Shield Crest",
      role: "Defining design element — iconic hardware signature",
      asset: "crest-simple",
      finishes: ["satin-gold", "brushed-gold", "antique-gold", "matte-champagne"],
      useOn: [
        "Handbags",
        "Crossbody bags",
        "Tote bags",
        "Briefcases",
        "Wallets",
        "Card holders",
        "Travel luggage",
        "Passport holders",
        "Belt buckles (optional)",
        "Lock hardware",
        "Leather tags",
        "Watch dial (12 o’clock)",
        "Favicon",
      ],
      never: ["Very small buttons, rivets, or jewelry faces — use B monogram instead"],
    },
    monogram: {
      name: "B Monogram",
      role: "Secondary brand symbol — luxury hardware signature at small scale",
      asset: "monogram",
      useOn: [
        "Buttons",
        "Snap buttons",
        "Jeans rivets",
        "Shirt cuffs",
        "Watch crown",
        "Zipper pulls (small)",
        "Belt rivets / buckle face",
        "Jewelry clasps",
        "Earrings",
        "Necklace pendants",
        "Bracelet charms",
      ],
      never: ["Never use the full crest at these very small sizes"],
    },
    wordmark: {
      name: "BOSIANO Wordmark",
      role: "Elegance without overwhelming the product",
      asset: "wordmark",
      useOn: [
        "Perfume bottles (front)",
        "Shoe insoles",
        "Garment neck labels",
        "Dust bags",
        "Care cards",
        "Authenticity cards",
        "Shopping bags",
        "Gift boxes",
        "Tissue paper",
        "Website footer",
        "Email signatures",
        "Invoices",
      ],
      rules: ["Maintain generous spacing", "Avoid decorative effects"],
    },
    fullLockup: {
      name: "Full Crest + Wordmark",
      role: "Reserved for brand-building moments",
      asset: "crest-full",
      useOn: [
        "Homepage header",
        "Hero banners",
        "Shopping bags",
        "Premium gift boxes",
        "Marketing campaigns",
        "Store signage",
        "Exhibition booths",
        "Brand lookbooks",
        "Press kits",
        "Corporate documents",
      ],
      never: ["Do not place the full logo directly on every product"],
    },
  },

  /**
   * Product branding matrix — Shield · B · Wordmark · Full
   * Values: "yes" | "optional" | "no" | placement note
   */
  matrix: [
    { product: "Luxury Handbag", shield: "Hardware", monogram: "Optional inside", wordmark: "Interior stamp", full: "no" },
    { product: "Wallet", shield: "Emboss", monogram: "Optional zipper", wordmark: "Interior", full: "no" },
    { product: "Travel Bag", shield: "Hardware", monogram: "Optional", wordmark: "Interior", full: "no" },
    { product: "Belt", shield: "Optional buckle", monogram: "Buckle", wordmark: "Interior", full: "no" },
    { product: "Watch", shield: "12 o’clock", monogram: "Crown", wordmark: "Caseback / clasp", full: "no" },
    { product: "Ring", shield: "no", monogram: "yes", wordmark: "Interior engraving", full: "no" },
    { product: "Earrings", shield: "no", monogram: "yes", wordmark: "Packaging", full: "no" },
    { product: "Necklace", shield: "Optional clasp", monogram: "Pendant", wordmark: "Packaging", full: "no" },
    { product: "Perfume", shield: "Cap", monogram: "no", wordmark: "Front", full: "Box only" },
    { product: "Shoes", shield: "Heel tab", monogram: "Eyelets", wordmark: "Insole", full: "no" },
    { product: "Clothing", shield: "Small embroidery", monogram: "Buttons", wordmark: "Neck label", full: "no" },
    { product: "Shopping Bag", shield: "Small crest", monogram: "no", wordmark: "Large", full: "yes" },
    { product: "Gift Box", shield: "Small crest", monogram: "no", wordmark: "yes", full: "yes" },
    { product: "Website Header", shield: "Mobile only", monogram: "no", wordmark: "no", full: "yes" },
    { product: "Website Footer", shield: "Optional small", monogram: "no", wordmark: "yes", full: "no" },
    { product: "Favicon", shield: "yes", monogram: "no", wordmark: "no", full: "no" },
  ] as const,

  /**
   * Target catalog mix (quiet luxury):
   * 40% none · 30% small embroidery · 20% leather emboss · 10% foil/metal/packaging
   */
  distribution: {
    none: 0.4,
    subtle: 0.3,
    emboss: 0.2,
    foilMetal: 0.1,
  },

  visibility: {
    prominent: [
      "handbag",
      "wallet",
      "perfume",
      "watch",
      "jewelry-box",
      "shopping-bag",
      "gift-box",
      "hang-tag",
      "dust-bag",
      "website",
      "belt",
      "travel",
    ],
    subtle: ["tee", "polo", "sweater", "hoodie", "cap", "shoe", "sneaker"],
    none: [
      "dress",
      "blazer",
      "trouser",
      "skirt",
      "scarf",
      "knitwear",
      "suit",
      "jewelry-piece",
    ],
  },

  assets: {
    primaryWordmark: "/brand/wordmark-bosiano.svg",
    darkWordmark: "/brand/bosiano-full-logo.png",
    lightWordmark: "/brand/bosiano-full-logo.png",
    fullCrest: "/brand/bosiano-full-logo.png",
    digitalLockup: "/brand/bosiano-full-logo.png",
    simpleCrest: "/brand/bosiano-crest-transparent.png",
    digitalCrest: "/brand/bosiano-crest-transparent.png",
    oneColorCrest: "/favicon.svg",
    monogram: "/brand/monogram-gold.svg",
    favicon: "/favicon.svg",
    faviconPng: "/brand/crest-shield.png",
    applications: {
      handbag: "/brand/bosiano-floral-handbag.png",
      cognacBag: "/brand/08_wallet_application.png",
      sneaker: "/brand/bosiano-sneaker-application.png",
      perfume: "/brand/06_perfume_application.png",
      wallet: "/brand/08_wallet_application.png",
      ringBox: "/brand/09_ring_box_application.png",
      jewelryBox: "/brand/jewelry-box-packaging.png",
      tee: "/brand/tee-crest-embroidery.png",
      hardware: "/brand/crest-metal-hardware.png",
      embossLeather: "/brand/logo-emboss-leather.png",
      shoppingBag: "/brand/bosiano-floral-handbag.png",
      usageVariants: "/brand/logo-emboss-beige.png",
      primaryLockupPhoto: "/brand/logo-primary-lockup.png",
      wordmarkTypography: "/brand/logo-digital-lockup.png",
    },
  },

  /**
   * Placement rules — shield / B / wordmark / full per product type.
   * Commerce cards never watermark photography.
   */
  placement: {
    shirt: {
      primary: "left-chest-shield",
      mark: "crest-simple",
      finish: "embroidery",
      secondary: "neck-wordmark",
      monogram: "buttons",
    },
    tee: {
      primary: "left-chest-shield",
      mark: "crest-simple",
      finish: "embroidery",
      secondary: "neck-wordmark",
      monogram: "hem-or-sleeve",
    },
    polo: {
      primary: "left-chest-shield",
      mark: "crest-simple",
      finish: "embroidery",
      secondary: "neck-wordmark",
      monogram: "buttons",
    },
    hoodie: { primary: "left-chest-shield", mark: "crest-simple", finish: "embroidery", secondary: "neck-wordmark" },
    sweatshirt: { primary: "left-chest-shield", mark: "crest-simple", finish: "embroidery", secondary: "neck-wordmark" },
    cap: { primary: "front-wordmark", mark: "wordmark", secondary: "back-subtitle" },
    watch: {
      primary: "dial-shield-12",
      mark: "crest-simple",
      monogram: "crown",
      secondary: "caseback-wordmark",
      tertiary: "clasp-wordmark",
    },
    wallet: {
      primary: "exterior-shield-emboss",
      mark: "crest-simple",
      finish: "blind",
      monogram: "optional-zipper",
      secondary: "interior-wordmark",
    },
    belt: {
      primary: "buckle-monogram",
      mark: "monogram",
      finish: "satin-gold",
      crest: "optional-buckle",
      secondary: "interior-wordmark",
    },
    shoe: {
      primary: "heel-shield",
      mark: "crest-simple",
      monogram: "eyelets",
      secondary: "insole-wordmark",
    },
    sunglasses: { primary: "temple", mark: "wordmark", secondary: "interior-subtitle" },
    perfume: {
      primary: "bottle-wordmark",
      mark: "wordmark",
      crest: "cap-shield",
      box: "full-lockup-optional",
    },
    jewelry: {
      primary: "monogram",
      mark: "monogram",
      crest: "optional-clasp",
      box: "crest",
      secondary: "packaging-wordmark",
    },
    bag: {
      primary: "crest-hardware",
      mark: "crest-simple",
      finish: "satin-gold",
      monogram: "optional-interior",
      secondary: "interior-wordmark",
    },
    scarf: { primary: "none-exterior", mark: "none", secondary: "woven-wordmark-label" },
    dress: { primary: "none-exterior", mark: "none", monogram: "snaps-optional", secondary: "neck-wordmark" },
    blazer: { primary: "none-exterior", mark: "none", monogram: "buttons", secondary: "interior-label" },
    jacket: {
      primary: "hardware-crest",
      mark: "crest-simple",
      monogram: "snaps-zippers",
      secondary: "interior-leather-wordmark",
    },
  } as const,

  sizes: {
    headerWordmarkPx: { min: 150, max: 190 },
    leftChestCm: { min: 4.5, max: 6 },
    poloCrestMm: { min: 18, max: 22 },
    /** Never use full crest below this — switch to B monogram */
    monogramMaxMm: 12,
    shieldMinMm: 14,
  },
} as const;

export type BrandConfig = typeof brand;
export type BrandProductType = keyof typeof brand.placement;
export type BrandAssetKey = keyof typeof brand.assets;
export type BrandVisibilityTier = "prominent" | "subtle" | "none";
export type HardwareFinish = (typeof brand.hardwareFinishes.preferred)[number];

export function brandVisibilityFor(categoryHint: string): BrandVisibilityTier {
  const h = categoryHint.toLowerCase();
  if (brand.visibility.none.some((k) => h.includes(k))) return "none";
  if (brand.visibility.subtle.some((k) => h.includes(k))) return "subtle";
  if (brand.visibility.prominent.some((k) => h.includes(k))) return "prominent";
  return "none";
}

export function brandAlt(decorative = false): string {
  return decorative ? "" : "Bosiano Italian Heritage";
}

export function brandLockupLabel(): string {
  return "Bosiano Italian Heritage";
}
