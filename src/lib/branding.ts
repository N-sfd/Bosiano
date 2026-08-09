/**
 * Product branding metadata — four-tier Bosiano identity.
 *
 * Shield Crest → iconic hardware
 * B Monogram   → small-scale hardware (never full crest at tiny sizes)
 * Wordmark     → labels, packaging, perfume face, digital
 * Full lockup  → brand-building / packaging only — never on every product
 *
 * Commerce photography must NOT receive flat PNG overlays.
 * Marketplace (non-Bosiano) SKUs keep original designer branding.
 */

export type BrandingMode =
  | "none"
  | "subtle"
  | "embossed"
  | "embroidered"
  | "metal"
  | "full";

export type BrandingPlacement =
  | "chest"
  | "center"
  | "corner"
  | "flap"
  | "hardware"
  | "dial"
  | "packaging"
  | "interior"
  | "heel"
  | "tongue"
  | "buckle"
  | "crown"
  | "cap"
  | "none";

export type BrandingAsset =
  | "crest"
  | "wordmark"
  | "full-logo"
  | "monogram"
  | "none";

export type BrandingFinish =
  | "satin-gold"
  | "brushed-gold"
  | "antique-gold"
  | "matte-champagne"
  | "blind"
  | "embroidery"
  | "foil";

export interface ProductBranding {
  /** Primary manufactured mark on / with the product */
  mode: BrandingMode;
  placement: BrandingPlacement;
  asset: BrandingAsset;
  /** Secondary mark (e.g. B on zipper, wordmark on neck) */
  secondary?: BrandingAsset;
  /** Tertiary mark (e.g. interior stamp) */
  tertiary?: BrandingAsset;
  /** Preferred metal / craft finish */
  finish?: BrandingFinish;
  /**
   * When true, gallery may use house application photography that
   * already contains manufactured branding. Never implies a PNG overlay.
   */
  usesBrandedPhotography: boolean;
}

type BrandingRule = Omit<ProductBranding, "usesBrandedPhotography">;

/** Category defaults aligned to the product branding matrix */
const DEFAULTS: { match: (p: BrandingHints) => boolean; branding: BrandingRule }[] = [
  {
    match: (p) => /perfume|fragrance|parfum/.test(p.hay),
    branding: {
      mode: "full",
      placement: "center",
      asset: "wordmark",
      secondary: "crest",
      tertiary: "full-logo",
      finish: "foil",
    },
  },
  {
    match: (p) => /shopping.?bag|gift.?box|dust.?bag|hang.?tag|packaging|ring.?box|jewelry.?box/.test(p.hay),
    branding: {
      mode: "full",
      placement: "packaging",
      asset: "full-logo",
      secondary: "crest",
      tertiary: "wordmark",
      finish: "foil",
    },
  },
  {
    match: (p) => /watch|timepiece/.test(p.hay),
    branding: {
      mode: "metal",
      placement: "dial",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "satin-gold",
    },
  },
  {
    match: (p) => /belt/.test(p.hay),
    branding: {
      mode: "metal",
      placement: "buckle",
      asset: "monogram",
      secondary: "crest",
      tertiary: "wordmark",
      finish: "satin-gold",
    },
  },
  {
    match: (p) => /wallet|card.?holder|passport|small leather|slg/.test(p.hay),
    branding: {
      mode: "embossed",
      placement: "flap",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "blind",
    },
  },
  {
    match: (p) => /handbag|shoulder|crossbody|tote|briefcase|travel|luggage|flap bag|leather bag/.test(p.hay),
    branding: {
      mode: "metal",
      placement: "hardware",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "satin-gold",
    },
  },
  {
    match: (p) => /sneaker|shoe|boot|heel|mule|loafer/.test(p.hay),
    branding: {
      mode: "subtle",
      placement: "heel",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "satin-gold",
    },
  },
  {
    match: (p) => /\btee\b|t-shirt|polo|sweater|hoodie|crewneck/.test(p.hay),
    branding: {
      mode: "embroidered",
      placement: "chest",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "embroidery",
    },
  },
  {
    match: (p) => /shirt|poplin/.test(p.hay) && !/dress|blazer/.test(p.hay),
    branding: {
      mode: "embroidered",
      placement: "chest",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "embroidery",
    },
  },
  {
    match: (p) => /leather jacket|biker|moto|jacket/.test(p.hay) && !/blazer/.test(p.hay),
    branding: {
      mode: "metal",
      placement: "hardware",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "satin-gold",
    },
  },
  {
    match: (p) => /earring|necklace|bracelet|pendant|charm/.test(p.hay),
    branding: {
      mode: "subtle",
      placement: "packaging",
      asset: "monogram",
      secondary: "wordmark",
      tertiary: "crest",
      finish: "satin-gold",
    },
  },
  {
    match: (p) => /\bring\b/.test(p.hay) && !/ring.?box/.test(p.hay),
    branding: {
      mode: "subtle",
      placement: "interior",
      asset: "monogram",
      secondary: "wordmark",
      tertiary: "crest",
      finish: "satin-gold",
    },
  },
  {
    match: (p) => /dress|blazer|suit|trouser|pant|skirt|coat|trench|outerwear/.test(p.hay),
    branding: {
      mode: "none",
      placement: "interior",
      asset: "none",
      secondary: "monogram",
      tertiary: "wordmark",
    },
  },
  {
    match: (p) => /scarf|wrap|shawl/.test(p.hay),
    branding: {
      mode: "none",
      placement: "interior",
      asset: "none",
      tertiary: "wordmark",
    },
  },
  {
    match: (p) => /jewelry/.test(p.hay),
    branding: {
      mode: "subtle",
      placement: "packaging",
      asset: "monogram",
      secondary: "wordmark",
      tertiary: "crest",
    },
  },
];

export type BrandingHints = {
  brandId: string;
  category: string;
  subcategory: string;
  name: string;
  tags: string[];
  hay: string;
};

export function brandingHints(input: {
  brandId: string;
  category: string;
  subcategory: string;
  name: string;
  tags: string[];
}): BrandingHints {
  const hay = [input.name, input.category, input.subcategory, ...input.tags].join(" ").toLowerCase();
  return { ...input, hay };
}

export function resolveProductBranding(
  hints: BrandingHints,
  override?: Partial<ProductBranding>
): ProductBranding {
  if (hints.brandId !== "bosiano") {
    return {
      mode: "none",
      placement: "none",
      asset: "none",
      usesBrandedPhotography: false,
    };
  }

  const matched = DEFAULTS.find((d) => d.match(hints));
  const base: ProductBranding = {
    mode: matched?.branding.mode ?? "none",
    placement: matched?.branding.placement ?? "none",
    asset: matched?.branding.asset ?? "none",
    secondary: matched?.branding.secondary,
    tertiary: matched?.branding.tertiary,
    finish: matched?.branding.finish,
    usesBrandedPhotography: (matched?.branding.mode ?? "none") !== "none",
  };

  return { ...base, ...override };
}

/** Never draw flat PNG crests on commerce product photography */
export function allowCommerceLogoOverlay(branding: ProductBranding): boolean {
  void branding;
  return false;
}

/** Full crest is for packaging / campaigns — not product faces */
export function allowsFullLogoOnProduct(branding: ProductBranding): boolean {
  return branding.asset === "full-logo" && branding.placement === "packaging";
}
