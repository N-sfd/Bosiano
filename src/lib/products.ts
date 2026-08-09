import type {
  Product,
  ProductColor,
  ProductImage,
  ProductImageRole,
  ProductImageView,
  ProductVariant,
  StoreLocation,
  ModelMeasurements,
} from "./types";
import type { ProductBranding } from "./branding";
import { brandingHints, resolveProductBranding } from "./branding";
import {
  COMPETITOR_IMAGE_PATTERNS,
  PRODUCT_TYPE_FORBIDDEN_PATHS,
  colorKey,
  getProductCardImage,
  getProductGallery,
  productDesignIdBySlug,
  productHardwareIdBySlug,
  productHardwareIdByColor,
  productPatternIdBySlug,
  productBorderStyleIdBySlug,
  productStyleIdBySlug,
  productTypeBySlug,
  productImagesByColor,
} from "./images";
import { brands } from "./brands";
import { seeded, slugify } from "./utils";

const VIEW_LABELS: Record<string, string> = {
  front: "Front",
  angle: "Angle",
  side: "Side",
  back: "Back",
  hardware: "Crest detail",
  leather: "Leather",
  interior: "Interior",
  detail: "Detail",
  lifestyle: "Lifestyle",
  view: "View",
};

function inferImageRole(src: string, index: number): ProductImageRole {
  const s = src.toLowerCase();
  const file = s.split("/").pop() ?? s;
  if (/interior/.test(file)) return "interior";
  if (/hardware|clasp/.test(file) || /(^|[-_])crest([-_.]|$)/.test(file)) return "hardware";
  if (/leather|grain|texture|edge/.test(file)) return "leather";
  if (/packaging|gift-?box|dust-?bag/.test(file)) return "detail";
  if (/back/.test(file)) return "back";
  if (/side/.test(file)) return "side";
  if (/angle|three-quarter|threeq|3q/.test(file)) return "angle";
  if (/lifestyle|worn|drape|draped/.test(file)) return "lifestyle";
  if (/detail|label|folded|flat|lapel|cuff|fabric/.test(file)) return "detail";
  if (/front|hero|01-/.test(file) || index === 0) return "front";
  return index === 0 ? "front" : "view";
}

function inferImageView(src: string, index: number): ProductImageView | undefined {
  const s = src.toLowerCase();
  const file = s.split("/").pop() ?? s;
  if (/packaging|gift-?box|dust-?bag|(^|[-_])box([-_.]|$)/.test(file)) return "packaging";
  if (/label/.test(file)) return "label";
  if (/edge/.test(file)) return "edge";
  if (/worn/.test(file)) return "worn";
  if (/draped|drape/.test(file)) return "draped";
  if (/folded/.test(file)) return "folded";
  if (/engraving|face/.test(file)) return "detail";
  if (/threeq|three-quarter|3q/.test(file)) return "angle";
  if (/lapel|cuff|fabric|detail/.test(file)) return "detail";
  if (/interior/.test(file)) return "interior";
  if (/hardware|clasp/.test(file) || /(^|[-_])crest([-_.]|$)/.test(file)) return "hardware";
  if (/angle/.test(file)) return "angle";
  if (/side/.test(file)) return "side";
  if (/back/.test(file)) return "back";
  if (/front/.test(file)) return "front";
  if (/flat|hero/.test(file) || index === 0) return "hero";
  return undefined;
}

function buildProductImages(
  productName: string,
  colorLabel: string,
  urls: string[],
  styleId: string,
  designId: string,
  hardwareId?: string,
  productSlug?: string,
  variant?: string,
  patternId?: string,
  borderStyleId?: string
): ProductImage[] {
  return urls.map((src, index) => {
    const role = inferImageRole(src, index);
    const view = inferImageView(src, index);
    const label =
      (view && view !== "hero" ? view.replace(/^\w/, (c) => c.toUpperCase()) : undefined) ??
      VIEW_LABELS[role] ??
      (index === 0 ? "Front" : `View ${index + 1}`);
    const roleBit = role === "front" && index === 0 ? "" : ` — ${label.toLowerCase()}`;
    return {
      src,
      zoomSrc: src,
      alt: `${productName} in ${colorLabel}${roleBit}`,
      role,
      label,
      ...(view ? { view } : {}),
      styleId,
      designId,
      ...(hardwareId ? { hardwareId } : {}),
      ...(productSlug ? { productSlug } : {}),
      ...(variant ? { variant } : {}),
      ...(patternId ? { patternId } : {}),
      ...(borderStyleId ? { borderStyleId } : {}),
    };
  });
}

const MATERIAL_KEYWORDS = [
  "wool",
  "silk",
  "cotton",
  "linen",
  "leather",
  "cashmere",
  "denim",
  "organic",
  "cupro",
  "merino",
  "suede",
  "nylon",
  "polyester",
  "viscose",
  "twill",
  "poplin",
] as const;

const OCCASION_KEYWORDS = [
  "work",
  "office",
  "wedding",
  "evening",
  "date",
  "vacation",
  "resort",
  "everyday",
  "casual",
  "formal",
  "party",
  "travel",
] as const;

function extractMaterialTags(materials: string, tags: string[]): string[] {
  const hay = `${materials} ${tags.join(" ")}`.toLowerCase();
  return MATERIAL_KEYWORDS.filter((m) => hay.includes(m));
}

function extractOccasions(tags: string[], vibe: string[]): string[] {
  const hay = [...tags, ...vibe].map((t) => t.toLowerCase());
  const found = OCCASION_KEYWORDS.filter((o) => hay.some((h) => h.includes(o)));
  return found.length ? found : ["everyday"];
}

function barcodeFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return `BOS${String(h % 1_000_000_000).padStart(9, "0")}`;
}

function modelFor(id: string, sizes: string[]): ModelMeasurements | undefined {
  if (!sizes.some((s) => ["XS", "S", "M", "L", "XL"].includes(s))) return undefined;
  const rnd = seeded(id.length * 97 + 13);
  const sizeWorn = sizes[Math.min(Math.floor(rnd() * sizes.length), sizes.length - 1)] ?? "S";
  return {
    height: `${170 + Math.floor(rnd() * 12)} cm`,
    bust: `${84 + Math.floor(rnd() * 10)} cm`,
    waist: `${62 + Math.floor(rnd() * 10)} cm`,
    hips: `${88 + Math.floor(rnd() * 12)} cm`,
    sizeWorn,
  };
}

function storesFor(id: string): StoreLocation[] {
  const rnd = seeded(id.length * 53 + 21);
  const cities = [
    { id: "nyc", name: "Bosiano Madison", city: "New York" },
    { id: "ldn", name: "Bosiano Mayfair", city: "London" },
    { id: "par", name: "Bosiano Saint-Honoré", city: "Paris" },
    { id: "mil", name: "Bosiano Brera", city: "Milan" },
  ];
  return cities.map((c, i) => {
    const roll = rnd() + i * 0.07;
    return {
      ...c,
      stock: roll < 0.25 ? "out" : roll < 0.5 ? "low" : "in-stock",
    } as StoreLocation;
  });
}

interface Seed {
  name: string;
  brandId: string;
  category: string;
  subcategory: string;
  gender: Product["gender"];
  price: number;
  compareAtPrice?: number;
  colors: [string, string][]; // [name, hex]
  sizes: string[];
  description: string;
  details: string[];
  materials: string;
  care: string;
  tags: string[];
  vibe: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isExclusive?: boolean;
  isSustainable?: boolean;
  video?: boolean;
  /** Optional override of category-default branding */
  branding?: Partial<ProductBranding>;
  /** Fine-grained product type for gallery integrity */
  productType?: string;
  /** Stable design id shared by every colour of this SKU */
  styleId?: string;
  /** Stable URL slug when display name would change it (e.g. Parfum → Perfume) */
  slug?: string;
}

function inferProductType(s: Seed, id: string): string {
  if (s.productType) return s.productType;
  if (productTypeBySlug[id]) return productTypeBySlug[id];
  const hay = `${s.name} ${s.subcategory} ${s.tags.join(" ")}`.toLowerCase();
  if (hay.includes("mule")) return "heeled-mule";
  if (hay.includes("sneaker")) return "sneaker";
  if (hay.includes("boot")) return "boot";
  if (hay.includes("tote")) return "tote";
  if (hay.includes("shoulder") && hay.includes("bag")) return "shoulder-bag";
  /* Word-boundary match — avoid "tailoring".includes("ring") false positives */
  if (/\bring\b/.test(hay) && !hay.includes("earring")) return "ring";
  if (hay.includes("trouser") || hay.includes("pant")) return "trouser";
  if (hay.includes("denim") || hay.includes("jean")) return "denim";
  if (hay.includes("trench")) return "trench-coat";
  if (hay.includes("coat") && !hay.includes("overshirt")) return "coat";
  if (hay.includes("overshirt")) return "overshirt";
  if (hay.includes("jacket") || (hay.includes("outerwear") && !hay.includes("coat"))) return "jacket";
  if (hay.includes("linen") && hay.includes("shirt")) return "linen-shirt";
  if (hay.includes("maxi") || (hay.includes("dress") && hay.includes("tier"))) return "dress";
  if (hay.includes("dress")) return "dress";
  if (hay.includes("shirt")) return "shirt";
  if (hay.includes("watch")) return "watch";
  if (hay.includes("scarf")) return "scarf";
  if (hay.includes("wrap")) return "wrap";
  if (hay.includes("earring")) return "earring";
  if (s.category === "bags") return "bag";
  if (s.category === "shoes") return "shoe";
  if (s.category === "jewelry") return "jewelry";
  return slugify(s.subcategory || s.category || "product");
}

function inferStyleId(s: Seed, id: string): string {
  return s.styleId || productStyleIdBySlug[id] || `${id}-01`;
}

function buildVariants(id: string, colors: [string, string][], sizes: string[]): ProductVariant[] {
  /* Each variant owns an independent gallery copy — colour-specific when mapped. */
  const variants = colors.map(([color, hex], ci) => {
    const colorId = colorKey(color);
    const gallery = getProductGallery(id, colorId);
    const rnd = seeded(id.length * 31 + ci * 97 + 7);
    const inventory: Record<string, number> = {};
    sizes.forEach((s) => {
      const roll = rnd();
      inventory[s] = roll < 0.14 ? 0 : roll < 0.34 ? Math.ceil(rnd() * 3) : Math.ceil(rnd() * 24) + 3;
    });
    return {
      id: `${id}-${colorId}`,
      colorId,
      color,
      hex,
      images: [...gallery],
      inventory,
    };
  });

  /* Never leave a product fully sold out by RNG — restock the first colourway */
  const anyStock = variants.some((v) => Object.values(v.inventory).some((n) => n > 0));
  if (!anyStock && variants[0] && sizes[0]) {
    variants[0].inventory[sizes[0]] = 6 + Math.ceil(seeded(id.length * 17)() * 10);
  }

  return variants;
}

const seeds: Seed[] = [
  {
    name: "Sculpted Wool Blazer",
    brandId: "maison-verane",
    category: "women",
    subcategory: "Tailoring",
    productType: "blazer",
    styleId: "sculpted-wool-blazer-01",
    gender: "women",
    price: 1290,
    colors: [["Charcoal", "#2f3033"], ["Camel", "#b8895a"], ["Ivory", "#efe9dd"]],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "A single-breasted blazer cut from Italian virgin wool with a softly rounded shoulder and a nipped waist. The house's signature 'architectural drape' gives it movement without structure.",
    details: ["Single-breasted, one-button closure", "Softly padded shoulder", "Functional horn buttons at cuff", "Fully lined in cupro"],
    materials: "100% virgin wool. Lining: 100% cupro.",
    care: "Dry clean only.",
    tags: ["blazer", "tailoring", "workwear", "evening"],
    vibe: ["structured", "minimal", "office", "power dressing", "neutral", "autumn"],
    rating: 4.8,
    reviewCount: 214,
    isExclusive: true,
    video: true,
  },
  {
    name: "Fluid Silk Slip Dress",
    brandId: "belrose",
    category: "women",
    subcategory: "Dresses",
    productType: "slip-dress",
    styleId: "belrose-fluid-silk-slip-dress-01",
    gender: "women",
    price: 690,
    compareAtPrice: 890,
    colors: [["Blush", "#d9b9b1"], ["Midnight", "#1c1f2a"], ["Sage", "#9aa488"]],
    sizes: ["XS", "S", "M", "L"],
    description:
      "The slip dress, perfected. Bias-cut sandwashed silk skims the body with a cowl neck and adjustable straps — an effortless line from day to evening.",
    details: ["Bias cut for fluid drape", "Adjustable spaghetti straps", "Cowl neckline", "Midi length"],
    materials: "100% sandwashed silk.",
    care: "Dry clean or hand wash cold.",
    tags: ["dress", "silk", "evening", "romantic"],
    vibe: ["romantic", "evening", "soft", "date night", "summer", "fluid"],
    rating: 4.7,
    reviewCount: 389,
    isNew: true,
  },
  {
    name: "Organic Cotton Oversized Shirt",
    brandId: "atelier-norde",
    category: "unisex",
    subcategory: "Shirts",
    productType: "shirt",
    styleId: "organic-cotton-oversized-shirt-01",
    gender: "unisex",
    price: 240,
    colors: [["Optic White", "#f4f1ea"], ["Stone", "#c9c2b4"], ["Slate", "#57606a"]],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "An oversized shirt in crisp organic poplin with a relaxed, genderless cut. Made in a solar-powered atelier from GOTS-certified cotton.",
    details: ["Relaxed oversized fit", "Mother-of-pearl buttons", "Curved hem", "GOTS-certified organic cotton"],
    materials: "100% GOTS organic cotton.",
    care: "Machine wash cold, line dry.",
    tags: ["shirt", "cotton", "everyday", "unisex"],
    vibe: ["minimal", "everyday", "clean", "scandinavian", "relaxed", "sustainable"],
    rating: 4.9,
    reviewCount: 512,
    isSustainable: true,
  },
  {
    name: "Architectural Trench Coat",
    brandId: "sanso",
    category: "women",
    subcategory: "Outerwear",
    productType: "trench-coat",
    styleId: "architectural-trench-coat-01",
    gender: "women",
    price: 1650,
    colors: [["Sand", "#cbb9a2"], ["Black", "#161616"]],
    sizes: ["XS", "S", "M", "L"],
    description:
      "A double-faced cotton trench reimagined with clean, seamless lines. No storm flaps, no epaulettes — only proportion and a precise belt.",
    details: ["Double-faced water-repellent cotton", "Concealed placket", "Self-tie belt", "Deep back vent"],
    materials: "100% double-faced cotton with DWR finish.",
    care: "Dry clean only.",
    tags: ["trench", "coat", "outerwear", "minimal"],
    vibe: ["minimal", "architectural", "transitional", "clean", "neutral", "city"],
    rating: 4.6,
    reviewCount: 143,
    isExclusive: true,
    video: true,
  },
  {
    name: "Adire Wrap Midi Skirt",
    brandId: "okoro",
    category: "women",
    subcategory: "Skirts",
    productType: "wrap-skirt",
    styleId: "adire-wrap-midi-skirt-01",
    gender: "women",
    price: 380,
    colors: [["Indigo", "#2a3b57"], ["Rust", "#a4562f"]],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "A wrap midi in hand-dyed adire cotton, each panel unique. Traditional Yoruba resist-dye techniques meet a modern, high-waisted silhouette.",
    details: ["Hand-dyed adire cotton", "Adjustable wrap tie", "High waist", "Each piece is one of a kind"],
    materials: "100% hand-dyed cotton.",
    care: "Hand wash cold separately.",
    tags: ["skirt", "print", "artisanal", "statement"],
    vibe: ["artisanal", "bold", "color", "heritage", "statement", "summer"],
    rating: 4.8,
    reviewCount: 97,
    isNew: true,
    isSustainable: true,
  },
  {
    name: "Boro Patchwork Jacket",
    brandId: "hana-mori",
    category: "men",
    subcategory: "Outerwear",
    productType: "jacket",
    styleId: "boro-patchwork-jacket-01",
    gender: "unisex",
    price: 920,
    colors: [["Black/Brown", "#2a211b"], ["Deep Indigo", "#1e2a3d"]],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Inspired by Japanese boro mending, this chore jacket is pieced from indigo-dyed cotton with visible sashiko stitching — a celebration of imperfection.",
    details: ["Hand sashiko stitching", "Patchwork indigo cotton", "Three patch pockets", "Corozo buttons"],
    materials: "100% indigo-dyed cotton.",
    care: "Machine wash cold, hang dry.",
    tags: ["jacket", "workwear", "artisanal", "indigo", "patchwork", "boro"],
    vibe: ["artisanal", "workwear", "heritage", "relaxed", "unisex", "autumn"],
    rating: 4.9,
    reviewCount: 76,
    isExclusive: true,
  },
  {
    name: "Merino Crewneck Sweater",
    brandId: "atelier-norde",
    category: "men",
    subcategory: "Knitwear",
    productType: "crewneck-sweater",
    styleId: "merino-crewneck-sweater-01",
    gender: "men",
    price: 220,
    colors: [["Oatmeal", "#d8cdba"], ["Forest", "#3a4a3b"], ["Navy", "#20293c"], ["Black", "#171717"]],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "A featherweight crewneck knit from extra-fine merino, breathable enough for every season. The everyday layer, elevated.",
    details: ["Extra-fine 19.5 micron merino", "Ribbed collar, cuffs and hem", "Fully fashioned seams"],
    materials: "100% extra-fine merino wool.",
    care: "Hand wash cold or dry clean.",
    tags: ["sweater", "knitwear", "everyday", "layering"],
    vibe: ["minimal", "everyday", "cozy", "layering", "neutral", "winter"],
    rating: 4.8,
    reviewCount: 631,
    isSustainable: true,
  },
  {
    name: "Pleated Wide-Leg Pant",
    slug: "pleated-wide-leg-trouser",
    brandId: "maison-verane",
    category: "men",
    subcategory: "Trousers",
    productType: "trouser",
    styleId: "pleated-wide-leg-trouser-01",
    gender: "men",
    price: 420,
    colors: [["Charcoal", "#33343a"], ["Cream", "#e9e2d3"]],
    sizes: ["28", "30", "32", "34", "36", "38"],
    description:
      "An elegant high-rise wide-leg pant with precise front pleats and a fluid tailored drape in a wool blend, cut for a clean, elongating line.",
    details: ["Double forward pleats", "High rise", "Wide straight leg", "Side adjusters, no belt loops"],
    materials: "78% wool, 22% mohair.",
    care: "Dry clean only.",
    tags: ["pants", "tailoring", "wide-leg", "evening", "trouser"],
    vibe: ["structured", "elegant", "vintage", "tailored", "neutral", "evening"],
    rating: 4.7,
    reviewCount: 188,
  },
  {
    name: "Riviera Linen Shirt",
    brandId: "solene",
    category: "men",
    subcategory: "Shirts",
    productType: "linen-shirt",
    styleId: "riviera-linen-shirt-01",
    gender: "men",
    price: 190,
    colors: [["Ivory", "#f3efe6"], ["Sand", "#d4c4a8"], ["Sage", "#9aa488"]],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A breezy camp-collar shirt in garment-dyed European linen — made for long lunches and golden-hour aperitivos.",
    details: ["Camp collar", "Garment-dyed linen", "Chest patch pocket", "Relaxed fit"],
    materials: "100% European linen.",
    care: "Machine wash cold, tumble dry low.",
    tags: ["shirt", "linen", "resort", "summer", "camp-collar"],
    vibe: ["resort", "summer", "relaxed", "vacation", "warm", "golden hour"],
    rating: 4.6,
    reviewCount: 254,
    isNew: true,
  },
  {
    name: "Structured Leather Tote",
    brandId: "sanso",
    category: "bags",
    subcategory: "Totes",
    productType: "tote",
    styleId: "sanso-structured-leather-tote-01",
    gender: "women",
    price: 1150,
    colors: [["Cognac", "#8a5a34"], ["Black", "#151515"], ["Bone", "#d8cfbf"]],
    sizes: ["One Size"],
    description:
      "A minimalist north-south tote in vegetable-tanned Italian leather that patinas beautifully. Roomy enough for the everyday, refined enough for the boardroom.",
    details: ["Vegetable-tanned full-grain leather", "Suede-lined interior", "Magnetic closure", "Fits a 15\" laptop"],
    materials: "Full-grain Italian leather; suede lining.",
    care: "Wipe with a dry cloth; condition periodically.",
    tags: ["bag", "tote", "leather", "work"],
    vibe: ["minimal", "work", "structured", "everyday", "neutral", "investment"],
    rating: 4.9,
    reviewCount: 421,
    isExclusive: true,
    video: true,
  },
  {
    name: "Crescent Shoulder Bag",
    brandId: "belrose",
    category: "bags",
    subcategory: "Shoulder Bags",
    productType: "shoulder-bag",
    styleId: "belrose-crescent-shoulder-bag-01",
    gender: "women",
    price: 780,
    colors: [["Blush", "#dcb6ac"], ["Chocolate", "#4a3527"], ["Ecru", "#e4dccb"]],
    sizes: ["One Size"],
    description:
      "A softly curved shoulder bag in buttery nappa leather that tucks neatly under the arm — the house's most-loved silhouette.",
    details: ["Soft nappa leather", "Adjustable strap", "Zip top", "Gold-tone hardware"],
    materials: "Nappa leather; cotton twill lining.",
    care: "Store in dust bag; avoid moisture.",
    tags: ["bag", "shoulder", "leather", "evening"],
    vibe: ["romantic", "everyday", "soft", "date night", "feminine", "spring"],
    rating: 4.7,
    reviewCount: 302,
    isNew: true,
  },
  {
    name: "Minimalist Leather Sneaker",
    brandId: "sanso",
    category: "shoes",
    subcategory: "Sneakers",
    productType: "sneaker",
    gender: "unisex",
    price: 340,
    colors: [["White", "#f0ede6"], ["Black", "#161616"], ["Grey", "#9b9a95"]],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    description:
      "A pared-back low-top in Italian calf leather with a clean cupsole and no visible branding — quietly luxurious footwear.",
    details: ["Italian calf leather upper", "Margom cupsole", "Leather lining", "Made in Italy"],
    materials: "Calf leather upper; rubber sole.",
    care: "Wipe clean; use leather protector.",
    tags: ["sneaker", "shoes", "everyday", "unisex"],
    vibe: ["minimal", "everyday", "clean", "versatile", "neutral", "unisex"],
    rating: 4.8,
    reviewCount: 706,
    isSustainable: false,
  },
  {
    name: "Sculptural Heeled Mule",
    brandId: "maison-verane",
    category: "shoes",
    subcategory: "Heels",
    productType: "heeled-mule",
    gender: "women",
    price: 560,
    colors: [["Black", "#151515"], ["Bone", "#ded4c2"]],
    sizes: ["36", "37", "38", "39", "40", "41"],
    description:
      "A backless mule on a sculpted 75mm heel in supple nappa — the elegant answer to the everyday heel.",
    details: ["75mm sculpted heel", "Nappa leather upper", "Leather sole with rubber insert", "Padded footbed"],
    materials: "Nappa leather; leather sole.",
    care: "Store with shoe trees; avoid rain.",
    tags: ["heels", "mule", "shoes", "evening"],
    vibe: ["elegant", "evening", "sculptural", "office", "neutral", "date night"],
    rating: 4.5,
    reviewCount: 168,
  },
  {
    name: "Signet Vermeil Ring",
    brandId: "sanso",
    category: "jewelry",
    subcategory: "Rings",
    productType: "ring",
    styleId: "signet-vermeil-ring-01",
    gender: "unisex",
    price: 210,
    colors: [["Gold Vermeil", "#c9a24b"], ["Sterling Silver", "#c7c9cc"]],
    sizes: ["5", "6", "7", "8", "9", "10"],
    description:
      "A modern take on the classic signet, hand-finished in 18k gold vermeil over recycled sterling silver.",
    details: ["18k gold vermeil / recycled silver", "Hand polished", "Hallmarked", "Comes gift boxed"],
    materials: "Recycled sterling silver with 18k gold vermeil.",
    care: "Keep dry; polish with a soft cloth.",
    tags: ["ring", "jewelry", "gift", "unisex"],
    vibe: ["minimal", "gift", "everyday", "timeless", "unisex", "gold"],
    rating: 4.9,
    reviewCount: 233,
    isSustainable: true,
    isNew: true,
  },
  {
    name: "Twisted Hoop Earrings",
    brandId: "belrose",
    category: "jewelry",
    subcategory: "Earrings",
    productType: "earring",
    styleId: "twisted-hoop-earrings-01",
    gender: "women",
    price: 165,
    colors: [["Gold Vermeil", "#c9a24b"]],
    sizes: ["One Size"],
    description:
      "Sculpted mid-size hoops with a hand-twisted profile that catches the light — an everyday statement.",
    details: ["18k gold vermeil", "Hand-twisted profile", "Secure hinged closure", "30mm diameter"],
    materials: "18k gold vermeil over sterling silver.",
    care: "Avoid moisture and perfume.",
    tags: ["earrings", "jewelry", "everyday", "gift"],
    vibe: ["everyday", "feminine", "gold", "gift", "timeless", "spring"],
    rating: 4.7,
    reviewCount: 341,
  },
  {
    name: "Cashmere Travel Wrap",
    brandId: "hana-mori",
    category: "women",
    subcategory: "Accessories",
    productType: "wrap",
    styleId: "cashmere-travel-wrap-01",
    gender: "unisex",
    price: 480,
    colors: [["Fog", "#c8c6c0"], ["Charcoal", "#3a3b3f"], ["Camel", "#b58c5f"]],
    sizes: ["One Size"],
    description:
      "An oversized double-faced cashmere wrap that doubles as a blanket at altitude — the ultimate travel companion.",
    details: ["Double-faced pure cashmere", "Generous 200 x 70cm", "Hand-finished edges", "Comes with travel pouch"],
    materials: "100% Grade-A Mongolian cashmere.",
    care: "Dry clean or gentle hand wash.",
    tags: ["scarf", "cashmere", "travel", "gift"],
    vibe: ["cozy", "travel", "luxe", "gift", "winter", "neutral"],
    rating: 4.9,
    reviewCount: 289,
    isExclusive: true,
  },
  {
    name: "Relaxed Selvedge Denim",
    brandId: "kestrel",
    category: "men",
    subcategory: "Denim",
    productType: "denim",
    styleId: "relaxed-selvedge-denim-01",
    gender: "unisex",
    price: 260,
    colors: [["Raw Indigo", "#2b3852"], ["Washed Black", "#2a2a2c"]],
    sizes: ["28", "30", "32", "34", "36", "38"],
    description:
      "A relaxed straight jean in 14oz Japanese selvedge denim that breaks in to become uniquely yours.",
    details: ["14oz Japanese selvedge denim", "Relaxed straight leg", "Button fly", "Chain-stitched hem"],
    materials: "100% cotton selvedge denim.",
    care: "Wash sparingly, inside out, cold.",
    tags: ["denim", "jeans", "everyday", "unisex", "selvedge"],
    vibe: ["workwear", "everyday", "americana", "relaxed", "unisex", "casual"],
    rating: 4.8,
    reviewCount: 458,
  },
  {
    name: "Field Utility Overshirt",
    brandId: "kestrel",
    category: "men",
    subcategory: "Outerwear",
    productType: "overshirt",
    styleId: "field-utility-overshirt-01",
    gender: "men",
    price: 310,
    colors: [["Olive Green", "#5c5a3c"], ["Black", "#171717"]],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A shirt-jacket in waxed organic cotton with four utility pockets — the layer that does everything.",
    details: ["Waxed organic cotton", "Four flap pockets", "Corozo buttons", "Relaxed fit"],
    materials: "100% waxed organic cotton.",
    care: "Spot clean; re-wax as needed.",
    tags: ["overshirt", "utility", "layering", "workwear"],
    vibe: ["workwear", "utility", "layering", "autumn", "relaxed", "outdoors"],
    rating: 4.7,
    reviewCount: 197,
    isSustainable: true,
    isNew: true,
  },
  {
    name: "Poplin Tiered Maxi Dress",
    brandId: "solene",
    category: "women",
    subcategory: "Dresses",
    productType: "dress",
    styleId: "poplin-tiered-maxi-dress-01",
    gender: "women",
    price: 540,
    colors: [["White", "#f2eee4"], ["Lemon", "#e6cf7f"], ["Cornflower", "#8ea6cf"]],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "A breezy tiered maxi in crisp cotton poplin with a smocked bodice — resort dressing at its most romantic.",
    details: ["Crisp cotton poplin", "Smocked bodice", "Tiered skirt", "Adjustable ties at shoulder"],
    materials: "100% cotton poplin.",
    care: "Machine wash cold, line dry.",
    tags: ["dress", "maxi", "resort", "summer", "tiered", "poplin"],
    vibe: ["resort", "romantic", "summer", "vacation", "feminine", "golden hour"],
    rating: 4.6,
    reviewCount: 176,
    isNew: true,
  },
  {
    name: "Handwoven Aso-Oke Clutch",
    brandId: "okoro",
    category: "bags",
    subcategory: "Clutches",
    productType: "clutch",
    styleId: "okoro-handwoven-aso-oke-clutch-01",
    gender: "women",
    price: 340,
    colors: [["Gold Weave", "#b5904a"], ["Indigo Weave", "#2f3f5c"]],
    sizes: ["One Size"],
    description:
      "An evening clutch handwoven from traditional aso-oke cloth and finished with leather trim — a modern heirloom.",
    details: ["Handwoven aso-oke cloth", "Leather trim and lining", "Magnetic closure", "Detachable chain"],
    materials: "Aso-oke cloth; leather trim.",
    care: "Spot clean only.",
    tags: ["clutch", "bag", "evening", "artisanal"],
    vibe: ["evening", "artisanal", "statement", "heritage", "gold", "occasion"],
    rating: 4.8,
    reviewCount: 64,
    isExclusive: true,
  },
  {
    name: "Ribbed Tank Bodysuit",
    brandId: "sanso",
    category: "women",
    subcategory: "Tops",
    gender: "women",
    price: 120,
    colors: [["Black", "#161616"], ["White", "#f1eee7"], ["Mocha", "#5a4636"]],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "A second-skin ribbed bodysuit in a modal blend that layers seamlessly under tailoring.",
    details: ["Fine-gauge ribbed modal", "Snap gusset closure", "Scoop neck", "Second-skin fit"],
    materials: "92% modal, 8% elastane.",
    care: "Machine wash cold, lay flat.",
    tags: ["top", "bodysuit", "layering", "everyday"],
    vibe: ["minimal", "layering", "everyday", "clean", "neutral", "essential"],
    rating: 4.6,
    reviewCount: 512,
  },
  {
    name: "Double-Breasted Wool Coat",
    brandId: "maison-verane",
    category: "women",
    subcategory: "Outerwear",
    productType: "coat",
    styleId: "double-breasted-wool-coat-01",
    gender: "women",
    price: 1490,
    colors: [["Camel", "#b58a56"], ["Grey Melange", "#8f9095"], ["Black", "#171717"]],
    sizes: ["XS", "S", "M", "L"],
    description:
      "A timeless double-breasted overcoat in a wool-cashmere blend, cut long and lean with a peak lapel.",
    details: ["Wool-cashmere blend", "Peak lapel", "Double-breasted, six-button", "Below-knee length"],
    materials: "90% wool, 10% cashmere.",
    care: "Dry clean only.",
    tags: ["coat", "outerwear", "tailoring", "winter", "double-breasted"],
    vibe: ["elegant", "winter", "structured", "investment", "neutral", "city"],
    rating: 4.9,
    reviewCount: 267,
    isExclusive: true,
    video: true,
  },
  {
    name: "Suede Chelsea Boot",
    brandId: "kestrel",
    category: "shoes",
    subcategory: "Boots",
    gender: "men",
    price: 430,
    colors: [["Tobacco", "#7a5236"], ["Charcoal Suede", "#43434a"]],
    sizes: ["40", "41", "42", "43", "44", "45", "46"],
    description:
      "A refined Chelsea boot in Italian suede on a lightweight commando sole — equal parts rugged and elegant.",
    details: ["Italian suede upper", "Elastic side gores", "Lightweight commando sole", "Leather lining"],
    materials: "Suede upper; rubber sole.",
    care: "Brush regularly; use suede protector.",
    tags: ["boots", "chelsea", "shoes", "autumn"],
    vibe: ["autumn", "versatile", "elegant", "everyday", "neutral", "city"],
    rating: 4.7,
    reviewCount: 219,
    isNew: true,
  },
  {
    name: "Silk Twill Scarf",
    brandId: "belrose",
    category: "women",
    subcategory: "Accessories",
    productType: "scarf",
    styleId: "silk-twill-scarf-01",
    gender: "women",
    price: 145,
    colors: [["Rose Garden", "#c98a8a"], ["Ocean", "#3f6b83"]],
    sizes: ["One Size"],
    description:
      "A hand-rolled silk twill scarf printed with an exclusive Belrose botanical motif — an instant finishing touch.",
    details: ["100% silk twill", "Hand-rolled edges", "Exclusive print", "90 x 90cm"],
    materials: "100% silk twill.",
    care: "Dry clean only.",
    tags: ["scarf", "silk", "accessory", "gift"],
    vibe: ["romantic", "gift", "feminine", "print", "spring", "finishing touch"],
    rating: 4.8,
    reviewCount: 154,
  },
  /* —— Bosiano Collection — four-tier identity (Shield · B · Wordmark · Full) —— */
  {
    name: "Bosiano Crest Leather Handbag",
    brandId: "bosiano",
    category: "bags",
    subcategory: "Shoulder Bags",
    productType: "shoulder-bag",
    styleId: "bosiano-crest-leather-handbag-01",
    gender: "women",
    price: 1280,
    colors: [["Botanical Cream", "#e8dfd0"], ["Espresso Print", "#3b2a1f"]],
    sizes: ["One Size"],
    description:
      "Structured top-handle flap bag in a botanical house print. Satin-gold shield crest clasp on the flap — the defining Bosiano hardware — with optional B monogram inside and a wordmark interior stamp. No full exterior logo.",
    details: [
      "Satin-gold shield crest clasp hardware",
      "Blind emboss beside lock",
      "Optional B monogram interior detail",
      "BOSIANO interior stamp · dust bag",
      "Top handle and shoulder strap",
    ],
    materials: "100% Italian leather; satin-gold hardware (no mirror polish).",
    care: "Wipe with soft cloth; store in dust bag.",
    tags: ["bag", "handbag", "leather", "bosiano", "shield", "hardware", "emboss", "heritage"],
    vibe: ["heritage", "investment", "italian", "quiet luxury", "everyday", "statement"],
    rating: 4.9,
    reviewCount: 86,
    isNew: true,
    isExclusive: true,
    branding: {
      mode: "metal",
      placement: "hardware",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "satin-gold",
      usesBrandedPhotography: true,
    },
  },
  {
    name: "Bosiano Cognac Flap Bag",
    brandId: "bosiano",
    category: "bags",
    subcategory: "Shoulder Bags",
    productType: "shoulder-bag",
    styleId: "bosiano-cognac-flap-bag-01",
    gender: "women",
    price: 1180,
    colors: [["Cognac", "#7a5236"], ["Noir", "#121212"]],
    sizes: ["One Size"],
    description:
      "Crafted from smooth Italian calf leather, the Bosiano Cognac Flap Bag pairs a structured silhouette with the house's signature shield clasp in brushed gold-tone hardware. A sculpted top handle, detachable shoulder strap and refined hand-finished edges complete the design.",
    details: [
      "Smooth Italian calf leather",
      "Brushed gold-tone shield crest clasp",
      "Sculpted top handle and detachable shoulder strap",
      "Hand-finished tonal edges",
      "Dust bag included",
    ],
    materials: "Italian calf leather; satin-gold or brushed-gold hardware.",
    care: "Wipe clean; condition leather seasonally.",
    tags: ["bag", "handbag", "leather", "bosiano", "shield", "hardware", "emboss", "cognac"],
    vibe: ["heritage", "investment", "italian", "quiet luxury", "everyday"],
    rating: 4.9,
    reviewCount: 54,
    isNew: true,
    isExclusive: true,
    branding: {
      mode: "metal",
      placement: "hardware",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "satin-gold",
      usesBrandedPhotography: true,
    },
  },
  {
    name: "Bosiano Crest Knit Sneaker",
    brandId: "bosiano",
    category: "shoes",
    subcategory: "Sneakers",
    productType: "sneaker",
    styleId: "bosiano-crest-knit-sneaker-01",
    gender: "unisex",
    price: 490,
    colors: [["Burgundy", "#7a1f2e"], ["Jet", "#0A0A0A"]],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    description:
      "Knit cupsole with shield crest on the heel tab, B monogram eyelets, and BOSIANO wordmark on the insole — never a giant side logo or full crest lockup.",
    details: [
      "Shield crest heel tab",
      "B monogram eyelets",
      "BOSIANO insole wordmark",
      "Knit upper · cushioned cupsole",
    ],
    materials: "Technical knit; rubber cupsole; leather heel tab.",
    care: "Spot clean; air dry.",
    tags: ["sneaker", "shoes", "bosiano", "shield", "monogram", "wordmark", "subtle"],
    vibe: ["heritage", "everyday", "italian", "sport-luxe", "statement"],
    rating: 4.8,
    reviewCount: 64,
    isNew: true,
    isExclusive: true,
    branding: {
      mode: "subtle",
      placement: "heel",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "satin-gold",
      usesBrandedPhotography: true,
    },
  },
  {
    name: "Bosiano Silk Twill Scarf",
    slug: "bosiano-silk-twill-scarf",
    brandId: "bosiano",
    category: "accessories",
    subcategory: "Scarves",
    productType: "scarf",
    styleId: "bosiano-silk-twill-scarf-01",
    gender: "women",
    price: 295,
    colors: [["Champagne Border", "#d4bc8a"], ["Cognac Border", "#a67c52"]],
    sizes: ["One Size"],
    description:
      "Pure silk twill with a calm champagne field, cognac border and a restrained geometric lattice — no exterior crest. House identity lives on the woven BOSIANO care label.",
    details: [
      "100% silk twill",
      "Restrained geometric lattice · cognac border",
      "Woven BOSIANO neck / care label",
      "Hand-rolled edges · 90 × 90 cm",
      "Champagne Border or Cognac-forward colorway — same design",
    ],
    materials: "100% silk twill.",
    care: "Dry clean only.",
    tags: ["scarf", "silk", "bosiano", "quiet luxury", "accessory", "wordmark"],
    vibe: ["heritage", "gift", "italian", "feminine", "finishing touch"],
    rating: 4.8,
    reviewCount: 97,
    isNew: true,
    isExclusive: true,
    branding: {
      mode: "none",
      placement: "interior",
      asset: "none",
      tertiary: "wordmark",
      usesBrandedPhotography: false,
    },
  },
  {
    name: "Bosiano Crest Zip Wallet",
    brandId: "bosiano",
    category: "bags",
    subcategory: "Small Leather Goods",
    productType: "wallet",
    styleId: "bosiano-crest-zip-wallet-01",
    gender: "unisex",
    price: 420,
    colors: [["Cognac", "#7a5236"], ["Black", "#1a1510"]],
    sizes: ["One Size"],
    description:
      "Pebbled leather zip wallet with shield crest blind emboss, optional B monogram on the zipper pull, and BOSIANO wordmark inside — never a full exterior logo.",
    details: [
      "Pebbled calf leather",
      "Shield crest blind emboss",
      "Optional B monogram zipper pull",
      "BOSIANO interior stamp",
    ],
    materials: "Italian calf leather; satin-gold or matte champagne metal.",
    care: "Wipe clean; condition leather seasonally.",
    tags: ["wallet", "leather", "bosiano", "shield", "emboss", "monogram", "accessory"],
    vibe: ["heritage", "everyday", "italian", "gift", "investment"],
    rating: 4.9,
    reviewCount: 142,
    isExclusive: true,
    branding: {
      mode: "embossed",
      placement: "flap",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "blind",
      usesBrandedPhotography: true,
    },
  },
  {
    name: "Bosiano B Leather Belt",
    brandId: "bosiano",
    category: "accessories",
    subcategory: "Belts",
    productType: "belt",
    styleId: "bosiano-b-leather-belt-01",
    gender: "unisex",
    price: 380,
    colors: [["Cognac", "#7a5236"], ["Black", "#1a1510"]],
    sizes: ["80", "85", "90", "95", "100", "105"],
    description:
      "Smooth calf belt with a satin-gold B monogram buckle — the everyday hardware signature. Optional shield on the buckle face; BOSIANO stamped on the strap interior.",
    details: [
      "B monogram buckle (satin-gold)",
      "Optional shield crest on buckle face",
      "Interior BOSIANO wordmark stamp",
      "Italian calf · 3 cm width",
    ],
    materials: "Italian calf leather; satin-gold buckle (no mirror polish).",
    care: "Wipe hardware; condition leather.",
    tags: ["belt", "leather", "bosiano", "monogram", "buckle", "hardware", "accessory"],
    vibe: ["heritage", "everyday", "italian", "investment"],
    rating: 4.8,
    reviewCount: 91,
    isNew: true,
    isExclusive: true,
    branding: {
      mode: "metal",
      placement: "buckle",
      asset: "monogram",
      secondary: "crest",
      tertiary: "wordmark",
      finish: "satin-gold",
      usesBrandedPhotography: true,
    },
  },
  {
    name: "Bosiano Pearl Drop Earrings",
    brandId: "bosiano",
    category: "jewelry",
    subcategory: "Earrings",
    productType: "earring",
    styleId: "bosiano-pearl-drop-earrings-01",
    gender: "women",
    price: 380,
    colors: [["Warm Pearl", "#e8dcc8"], ["Ivory Pearl", "#f4efe6"]],
    sizes: ["One Size"],
    description:
      "Cultured pearl drops with a B monogram clasp — never a full crest at jewelry scale. Packaging carries the wordmark and a small shield crest.",
    details: [
      "Warm Pearl — gold B monogram clasp",
      "Ivory Pearl — silver B monogram clasp",
      "Same drop silhouette across metal finishes",
      "No large logo on the jewelry face",
      "Wordmark on packaging",
    ],
    materials: "Cultured pearls; gold vermeil or sterling-silver findings.",
    care: "Wipe with soft cloth; avoid water.",
    tags: ["earrings", "jewelry", "pearl", "bosiano", "monogram", "quiet luxury", "gift"],
    vibe: ["heritage", "evening", "italian", "gift", "refined"],
    rating: 4.8,
    reviewCount: 73,
    isNew: true,
    branding: {
      mode: "subtle",
      placement: "packaging",
      asset: "monogram",
      secondary: "wordmark",
      tertiary: "crest",
      finish: "satin-gold",
      usesBrandedPhotography: true,
    },
  },
  {
    name: "Bosiano Italian Heritage Perfume",
    slug: "bosiano-italian-heritage-parfum",
    brandId: "bosiano",
    category: "fragrance",
    subcategory: "Perfume",
    productType: "perfume",
    styleId: "bosiano-italian-heritage-perfume-01",
    gender: "unisex",
    price: 195,
    colors: [["Amber", "#c07a55"]],
    sizes: ["50ml", "100ml"],
    description:
      "Amber eau de parfum in clear glass — warm amber liquid, satin-gold cap with a miniature shield crest, and a quiet BOSIANO wordmark on the bottle front.",
    details: [
      "BOSIANO wordmark on bottle front",
      "Small shield crest on cap",
      "Clear glass with amber liquid",
      "Matching gift box packaging",
    ],
    materials: "Fragrance oils; glass bottle.",
    care: "Store away from heat and light.",
    tags: ["fragrance", "perfume", "bosiano", "wordmark", "shield", "gift"],
    vibe: ["heritage", "gift", "italian", "evening", "signature"],
    rating: 4.7,
    reviewCount: 188,
    isNew: true,
    branding: {
      mode: "full",
      placement: "center",
      asset: "wordmark",
      secondary: "crest",
      tertiary: "full-logo",
      finish: "foil",
      usesBrandedPhotography: true,
    },
  },
  {
    name: "Bosiano Crest Ring Box",
    brandId: "bosiano",
    category: "gifts",
    subcategory: "Packaging",
    productType: "ring-box",
    styleId: "bosiano-crest-ring-box-01",
    gender: "unisex",
    price: 95,
    colors: [["Matte Black", "#1a1510"], ["Cognac Leather", "#7a5236"]],
    sizes: ["One Size"],
    description:
      "Premium ring presentation box — full crest + wordmark in gold foil on the lid, satin-lined ring cushion within. Packaging is where the complete identity shines.",
    details: [
      "Full crest + BOSIANO foil on lid",
      "Satin-lined ring cushion",
      "Magnetic closure · dust pouch",
      "Sized for rings",
    ],
    materials: "Board; leatherette or leather; satin lining; Italian cream texture.",
    care: "Wipe exterior; keep dry.",
    tags: ["jewelry", "gift", "bosiano", "packaging", "box", "full-logo", "ring"],
    vibe: ["heritage", "gift", "italian", "heirloom"],
    rating: 4.9,
    reviewCount: 56,
    isExclusive: true,
    branding: {
      mode: "full",
      placement: "packaging",
      asset: "full-logo",
      secondary: "crest",
      tertiary: "wordmark",
      finish: "foil",
      usesBrandedPhotography: true,
    },
  },
  {
    name: "Bosiano Crest Poplin Shirt",
    brandId: "bosiano",
    category: "clothing",
    subcategory: "Shirts",
    productType: "poplin-shirt",
    styleId: "bosiano-crest-poplin-shirt-01",
    gender: "unisex",
    price: 320,
    colors: [["Ivory", "#f5f0e6"], ["Soft Black", "#2a211b"], ["Champagne", "#e8dcc8"]],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Italian cotton poplin with a classic collar, button front, and a small embroidered shield at the left chest — never a full crest lockup on the garment.",
    details: [
      "Small left-chest shield embroidery",
      "BOSIANO woven neck label",
      "B monogram buttons",
      "Classic collar · woven poplin",
    ],
    materials: "100% Italian cotton poplin.",
    care: "Machine wash cold or dry clean.",
    tags: ["shirt", "cotton", "bosiano", "shield", "monogram", "embroidery", "subtle", "poplin"],
    vibe: ["heritage", "everyday", "italian", "minimal", "work"],
    rating: 4.8,
    reviewCount: 121,
    isNew: true,
    branding: {
      mode: "embroidered",
      placement: "chest",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "embroidery",
      usesBrandedPhotography: true,
    },
  },
  {
    name: "Bosiano Heritage Watch",
    brandId: "bosiano",
    category: "men",
    subcategory: "Watches",
    productType: "watch",
    styleId: "bosiano-heritage-watch-01",
    gender: "men",
    price: 2450,
    colors: [["Two-Tone", "#a88a4e"], ["Terracotta", "#A65A3A"]],
    sizes: ["One Size"],
    description:
      "Signature timepiece — shield crest at 12 o’clock, B monogram engraved on the crown, wordmark on the caseback and clasp. No full logo on the watch face.",
    details: [
      "Shield crest at 12 o’clock",
      "B monogram engraved crown",
      "Wordmark on caseback and clasp",
      "Two-Tone steel/gold case · Terracotta leather strap option",
      "Sapphire crystal",
    ],
    materials: "Stainless steel; sapphire; leather strap; satin / brushed gold finishes.",
    care: "Avoid water; service every 3–5 years.",
    tags: ["watch", "bosiano", "shield", "monogram", "timepiece", "menswear"],
    vibe: ["heritage", "investment", "italian", "statement", "evening"],
    rating: 4.9,
    reviewCount: 48,
    isNew: true,
    isExclusive: true,
    branding: {
      mode: "metal",
      placement: "dial",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "satin-gold",
      usesBrandedPhotography: true,
    },
  },
  {
    name: "Bosiano Crest Tee",
    brandId: "bosiano",
    category: "clothing",
    subcategory: "Tops",
    productType: "tee",
    styleId: "bosiano-crest-tee-01",
    gender: "unisex",
    price: 145,
    colors: [["Ivory", "#f7f4ef"], ["Jet", "#1a1510"], ["Gold Dust", "#e8d5a8"]],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Fine jersey tee with a reduced left-chest shield embroidery, BOSIANO at the neck, and B monogram at the hem — understated clothing branding.",
    details: [
      "Small left-chest shield embroidery",
      "BOSIANO woven neck label",
      "B monogram at hem",
      "Supima cotton · relaxed crewneck",
    ],
    materials: "100% Supima cotton.",
    care: "Machine wash cold, tumble low.",
    tags: ["tee", "cotton", "bosiano", "shield", "monogram", "embroidery", "subtle", "jersey"],
    vibe: ["everyday", "heritage", "italian", "casual", "quiet luxury"],
    rating: 4.6,
    reviewCount: 203,
    isNew: true,
    branding: {
      mode: "embroidered",
      placement: "chest",
      asset: "crest",
      secondary: "monogram",
      tertiary: "wordmark",
      finish: "embroidery",
      usesBrandedPhotography: true,
    },
  },
];

export const products: Product[] = seeds.map((s, index) => {
  const slug = s.slug ?? slugify(s.name);
  const id = slug;
  const brand = brands.find((b) => b.id === s.brandId);
  const materialTags = extractMaterialTags(s.materials, s.tags);
  const occasions = extractOccasions(s.tags, s.vibe);
  const rnd = seeded(index * 41 + 9);
  const productType = inferProductType(s, id);
  const styleId = inferStyleId(s, id);
  const designId =
    productDesignIdBySlug[id] ??
    (styleId.replace(/-01$/, "").toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 12) || "DESIGN-01");
  const defaultHardwareId = productHardwareIdBySlug[id];
  /* Drop colour swatches that have no real hero gallery — never render broken colours */
  const variants = buildVariants(id, s.colors, s.sizes).filter(
    (v) => v.images.length > 0 && Boolean(v.images[0]) && !/unsplash\.com/i.test(v.images[0])
  );
  const defaultColor = variants[0]?.colorId ?? colorKey(s.colors[0]?.[0] ?? "");
  const colors: ProductColor[] = variants.map((v) => ({
    id: v.colorId,
    label: v.color,
    swatch: v.hex,
  }));
  const imagesByColor: Record<string, ProductImage[]> = {};
  for (const v of variants) {
    const hardwareId = productHardwareIdByColor[id]?.[v.colorId] ?? defaultHardwareId;
    const patternId = productPatternIdBySlug[id];
    const borderStyleId = productBorderStyleIdBySlug[id];
    imagesByColor[v.colorId] = buildProductImages(
      s.name,
      v.color,
      v.images,
      styleId,
      designId,
      hardwareId,
      id,
      v.colorId,
      patternId,
      borderStyleId
    );
  }
  const images = imagesByColor[defaultColor] ?? imagesByColor[variants[0]?.colorId] ?? [];
  const cardImage =
    images[0]?.src ??
    variants.find((v) => v.colorId === defaultColor)?.images[0] ??
    getProductCardImage(id, defaultColor) ??
    variants[0]?.images[0] ??
    getProductCardImage(id);
  return {
    id,
    slug,
    name: s.name,
    brandId: s.brandId,
    category: s.category,
    subcategory: s.subcategory,
    productType,
    styleId,
    gender: s.gender,
    price: s.price,
    compareAtPrice: s.compareAtPrice,
    currency: "USD",
    description: s.description,
    details: s.details,
    materials: s.materials,
    materialTags,
    care: s.care,
    sizes: s.sizes,
    colors,
    defaultColor,
    images,
    imagesByColor,
    variants,
    cardImage,
    rating: s.rating,
    reviewCount: s.reviewCount,
    tags: s.tags,
    vibe: s.vibe,
    occasions,
    countryOfOrigin: brand?.origin.split(",").pop()?.trim() ?? brand?.origin ?? "Italy",
    barcode: barcodeFor(id),
    modelMeasurements: modelFor(id, s.sizes),
    stores: storesFor(id),
    isNew: s.isNew,
    isExclusive: s.isExclusive,
    isSustainable: s.isSustainable,
    isPreorder: !s.isNew && rnd() < 0.12,
    sameDayEligible: rnd() > 0.55,
    branding: resolveProductBranding(
      brandingHints({
        brandId: s.brandId,
        category: s.category,
        subcategory: s.subcategory,
        name: s.name,
        tags: s.tags,
      }),
      s.branding
    ),
    /* No fake 360 — only set spin when real multi-angle frames exist */
    spin: undefined,
    video: s.video ? `${id}-video` : undefined,
  };
});

export type CatalogIssue = { severity: "error" | "warn"; code: string; message: string; slug?: string };

const DEFAULT_SAFE_SHARE = "/brand/logo-emboss-beige.png";

/** Shared catalog audit used in dev + CI (`scripts/validate-catalog.ts`). */
export function auditProductCatalog(list: Product[]): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  const slugs = new Set<string>();
  const ids = new Set<string>();
  const galleryOwners = new Map<string, string>();

  for (const p of list) {
    if (slugs.has(p.slug)) {
      issues.push({ severity: "error", code: "duplicate-slug", message: `Duplicate slug: ${p.slug}`, slug: p.slug });
    }
    if (ids.has(p.id)) {
      issues.push({ severity: "error", code: "duplicate-id", message: `Duplicate id: ${p.id}`, slug: p.slug });
    }
    slugs.add(p.slug);
    ids.add(p.id);

    if (!p.name || !p.category || !p.brandId) {
      issues.push({ severity: "error", code: "incomplete-metadata", message: `Incomplete metadata`, slug: p.slug });
    }
    if (!p.productType) {
      issues.push({ severity: "error", code: "missing-product-type", message: `Missing productType`, slug: p.slug });
    }
    if (!p.styleId) {
      issues.push({ severity: "error", code: "missing-style-id", message: `Missing styleId`, slug: p.slug });
    }
    if (!p.cardImage) {
      issues.push({ severity: "error", code: "missing-card-image", message: `Missing cardImage`, slug: p.slug });
    }
    if (!p.defaultColor) {
      issues.push({ severity: "error", code: "missing-default-color", message: `Missing defaultColor`, slug: p.slug });
    } else if (p.colors.length && !p.colors.some((c) => c.id === p.defaultColor)) {
      issues.push({
        severity: "error",
        code: "default-color-mismatch",
        message: `defaultColor "${p.defaultColor}" not in colors[]`,
        slug: p.slug,
      });
    }

    if (!p.imagesByColor || typeof p.imagesByColor !== "object") {
      issues.push({ severity: "error", code: "missing-images-by-color", message: `Missing product.imagesByColor`, slug: p.slug });
    }

    if (!p.colors?.length) {
      issues.push({ severity: "error", code: "missing-colors", message: `Missing product.colors`, slug: p.slug });
    }

    /* Multi-colour SKUs must not share one identical gallery across swatches */
    if (p.variants.length > 1) {
      const sigs = p.variants.map((v) => v.images.join("|"));
      if (new Set(sigs).size === 1) {
        issues.push({
          severity: "error",
          code: "identical-color-galleries",
          message: `All colour variants share the same gallery — add imagesByColor`,
          slug: p.slug,
        });
      }
    }

    /* Multi-colour SKUs require imagesByColor covering every colour id */
    const colorMap = productImagesByColor[p.slug];
    const productColorMap = p.imagesByColor;
    if (p.colors.length > 1) {
      if (!colorMap && !productColorMap) {
        issues.push({
          severity: "error",
          code: "missing-images-by-color",
          message: `Multi-colour product has no imagesByColor map`,
          slug: p.slug,
        });
      } else {
        for (const c of p.colors) {
          const gallery =
            productColorMap?.[c.id]?.map((img) => img.src) ??
            colorMap?.[c.id] ??
            [];
          if (!gallery.length) {
            issues.push({
              severity: "error",
              code: "missing-color-gallery",
              message: `No imagesByColor entry for colour id "${c.id}"`,
              slug: p.slug,
            });
          } else if (!gallery[0]) {
            issues.push({
              severity: "error",
              code: "missing-hero",
              message: `Colour "${c.id}" missing hero image`,
              slug: p.slug,
            });
          }
          for (const url of gallery) {
            if (!url) {
              issues.push({
                severity: "error",
                code: "empty-src",
                message: `Empty image src (${c.id})`,
                slug: p.slug,
              });
            }
            if (url.startsWith("/products/") && !url.includes(`/${p.slug}/`)) {
              issues.push({
                severity: "error",
                code: "cross-style-color-image",
                message: `Colour "${c.id}" uses another product folder: ${url.slice(0, 80)}`,
                slug: p.slug,
              });
            }
          }
        }
      }
    }

    /* Multi-colour: heroes must differ between colours (no reused src as fake swatch) */
    if (p.colors.length > 1 && productColorMap) {
      const heroes = p.colors.map((c) => productColorMap[c.id]?.[0]?.src).filter(Boolean) as string[];
      if (heroes.length === p.colors.length && new Set(heroes).size < heroes.length) {
        issues.push({
          severity: "error",
          code: "shared-hero-across-colors",
          message: `Two or more colours reuse the same hero image — each colour needs its own gallery`,
          slug: p.slug,
        });
      }

      /* No shared frame URLs between colour galleries (tint/reuse detection).
         Packaging / brand marks may legitimately be shared across colourways. */
      const srcOwners = new Map<string, string>();
      for (const c of p.colors) {
        for (const frame of productColorMap[c.id] ?? []) {
          if (!frame.src || frame.src.startsWith("/brand/")) continue;
          if (/packaging|box|dust-?bag|gift/i.test(frame.src)) continue;
          const prev = srcOwners.get(frame.src);
          if (prev && prev !== c.id) {
            issues.push({
              severity: "error",
              code: "shared-src-across-colors",
              message: `Image reused across colours "${prev}" and "${c.id}": ${frame.src.slice(0, 80)}`,
              slug: p.slug,
            });
          } else {
            srcOwners.set(frame.src, c.id);
          }
        }
      }

      const designIds = new Set<string>();
      const hardwareIds = new Set<string>();
      const expectedDesign = productDesignIdBySlug[p.slug];
      const expectedHardware = productHardwareIdBySlug[p.slug];
      for (const c of p.colors) {
        for (const frame of productColorMap[c.id] ?? []) {
          if (frame.styleId && frame.styleId !== p.styleId) {
            issues.push({
              severity: "error",
              code: "mixed-style-id",
              message: `Frame styleId "${frame.styleId}" != product.styleId "${p.styleId}" (${c.id})`,
              slug: p.slug,
            });
          }
          if (frame.designId) {
            designIds.add(frame.designId);
            if (expectedDesign && frame.designId !== expectedDesign) {
              issues.push({
                severity: "error",
                code: "design-id-mismatch",
                message: `Frame designId "${frame.designId}" != expected "${expectedDesign}" (${c.id})`,
                slug: p.slug,
              });
            }
          }
          if (frame.zoomSrc && frame.zoomSrc !== frame.src) {
            /* zoomSrc may differ only as a hi-res twin of the same shot — designId must still match */
            if (frame.designId && expectedDesign && frame.designId !== expectedDesign) {
              issues.push({
                severity: "error",
                code: "zoom-design-mismatch",
                message: `zoomSrc designId mismatch for ${frame.src}`,
                slug: p.slug,
              });
            }
          }
          if (frame.hardwareId) {
            hardwareIds.add(frame.hardwareId);
            if (expectedHardware && frame.hardwareId !== expectedHardware) {
              issues.push({
                severity: "error",
                code: "hardware-id-mismatch",
                message: `Frame hardwareId "${frame.hardwareId}" != expected "${expectedHardware}" (${c.id})`,
                slug: p.slug,
              });
            }
          }
        }
      }
      if (designIds.size > 1) {
        issues.push({
          severity: "error",
          code: "mixed-design-id",
          message: `Colour galleries use multiple designIds: ${[...designIds].join(", ")}`,
          slug: p.slug,
        });
      }
      /* Pearl tones intentionally switch gold/silver clasp hardware per colour */
      const allowsHardwareByColor = Boolean(productHardwareIdByColor[p.slug]);
      if (hardwareIds.size > 1 && !allowsHardwareByColor) {
        issues.push({
          severity: "error",
          code: "mixed-hardware-id",
          message: `SKU uses multiple hardwareIds: ${[...hardwareIds].join(", ")}`,
          slug: p.slug,
        });
      }
    }

    /* Image metadata must stay on the owning SKU */
    for (const c of p.colors) {
      for (const frame of productColorMap?.[c.id] ?? []) {
        if (frame.productSlug && frame.productSlug !== p.slug) {
          issues.push({
            severity: "error",
            code: "image-product-slug-mismatch",
            message: `Frame productSlug "${frame.productSlug}" != ${p.slug}`,
            slug: p.slug,
          });
        }
        if (frame.variant && frame.variant !== c.id) {
          issues.push({
            severity: "error",
            code: "image-variant-mismatch",
            message: `Frame variant "${frame.variant}" != colour "${c.id}"`,
            slug: p.slug,
          });
        }
      }
    }

    /* Selectable colour must always resolve a non-empty hero */
    for (const c of p.colors) {
      const gallery = p.imagesByColor?.[c.id] ?? [];
      const hero = gallery[0]?.src;
      if (!hero) {
        issues.push({
          severity: "error",
          code: "selectable-color-missing-hero",
          message: `Selectable colour "${c.id}" has no hero image`,
          slug: p.slug,
        });
      } else if (/placeholder|unavailable|blank/i.test(hero)) {
        issues.push({
          severity: "error",
          code: "blank-hero",
          message: `Colour "${c.id}" uses blank/placeholder hero: ${hero}`,
          slug: p.slug,
        });
      }
    }

    /* Scarf: one physical design — BOS-SILK-SCARF-01 / lattice / border ids */
    if (p.slug === "bosiano-silk-twill-scarf" && productColorMap) {
      const expected = productDesignIdBySlug[p.slug] ?? "BOS-SILK-SCARF-01";
      const expectedPattern = productPatternIdBySlug[p.slug] ?? "BOS-LATTICE-01";
      const expectedBorder = productBorderStyleIdBySlug[p.slug] ?? "BOS-COGNAC-BORDER-01";
      const scarfViews = new Set(["hero", "folded", "draped", "worn", "edge", "label", "packaging"]);
      /* Legacy mismatched assets that must never re-enter the gallery */
      const bannedLegacy = /04-worn|07-packaging|champagne-04|cognac-03-draped|cognac-04-worn/i;
      for (const c of p.colors) {
        const designIds = new Set<string>();
        const patternIds = new Set<string>();
        const borderIds = new Set<string>();
        for (const frame of productColorMap[c.id] ?? []) {
          designIds.add(frame.designId);
          if (frame.patternId) patternIds.add(frame.patternId);
          if (frame.borderStyleId) borderIds.add(frame.borderStyleId);
          if (frame.designId !== expected) {
            issues.push({
              severity: "error",
              code: "scarf-mixed-design",
              message: `Scarf frame designId "${frame.designId}" != ${expected}`,
              slug: p.slug,
            });
          }
          if (frame.patternId && frame.patternId !== expectedPattern) {
            issues.push({
              severity: "error",
              code: "scarf-pattern-mismatch",
              message: `Scarf patternId "${frame.patternId}" != ${expectedPattern}`,
              slug: p.slug,
            });
          }
          if (frame.borderStyleId && frame.borderStyleId !== expectedBorder) {
            issues.push({
              severity: "error",
              code: "scarf-border-mismatch",
              message: `Scarf borderStyleId "${frame.borderStyleId}" != ${expectedBorder}`,
              slug: p.slug,
            });
          }
          if (frame.zoomSrc && frame.zoomSrc !== frame.src) {
            issues.push({
              severity: "error",
              code: "scarf-zoom-mismatch",
              message: `Scarf zoomSrc must match src for ${frame.src}`,
              slug: p.slug,
            });
          }
          if (bannedLegacy.test(frame.src)) {
            issues.push({
              severity: "error",
              code: "scarf-wrong-image",
              message: `Scarf gallery still references removed mismatched asset: ${frame.src}`,
              slug: p.slug,
            });
          }
          if (frame.view && !scarfViews.has(frame.view)) {
            issues.push({
              severity: "warn",
              code: "scarf-unexpected-view",
              message: `Scarf view "${frame.view}" on ${frame.src}`,
              slug: p.slug,
            });
          }
        }
        if (designIds.size > 1) {
          issues.push({
            severity: "error",
            code: "scarf-mixed-design",
            message: `Variant "${c.id}" has multiple designIds: ${[...designIds].join(", ")}`,
            slug: p.slug,
          });
        }
        if (patternIds.size > 1) {
          issues.push({
            severity: "error",
            code: "scarf-pattern-mismatch",
            message: `Variant "${c.id}" has multiple patternIds`,
            slug: p.slug,
          });
        }
        if (borderIds.size > 1) {
          issues.push({
            severity: "error",
            code: "scarf-border-mismatch",
            message: `Variant "${c.id}" has multiple borderStyleIds`,
            slug: p.slug,
          });
        }
      }
      const ids = p.colors.map((c) => c.id);
      if (!ids.includes("champagne-border") || !ids.includes("cognac-border")) {
        issues.push({
          severity: "error",
          code: "scarf-color-missing",
          message: `Scarf must expose champagne-border + cognac-border (got ${ids.join(", ")})`,
          slug: p.slug,
        });
      }
    }

    /* Pearl tone variants: Warm=gold clasp, Ivory=silver clasp — same designId */
    if (p.slug === "bosiano-pearl-drop-earrings" && productColorMap) {
      const warmHw = productHardwareIdByColor[p.slug]?.["warm-pearl"];
      const ivoryHw = productHardwareIdByColor[p.slug]?.["ivory-pearl"];
      if (warmHw && ivoryHw && warmHw === ivoryHw) {
        issues.push({
          severity: "error",
          code: "pearl-hardware-not-differentiated",
          message: `Warm Pearl and Ivory Pearl must use different metal hardwareIds`,
          slug: p.slug,
        });
      }
      for (const frame of productColorMap["warm-pearl"] ?? []) {
        if (warmHw && frame.hardwareId && frame.hardwareId !== warmHw) {
          issues.push({
            severity: "error",
            code: "pearl-hardware-mismatch",
            message: `Warm Pearl must use gold clasp (${warmHw})`,
            slug: p.slug,
          });
        }
      }
      for (const frame of productColorMap["ivory-pearl"] ?? []) {
        if (ivoryHw && frame.hardwareId && frame.hardwareId !== ivoryHw) {
          issues.push({
            severity: "error",
            code: "pearl-hardware-mismatch",
            message: `Ivory Pearl must use silver clasp (${ivoryHw})`,
            slug: p.slug,
          });
        }
      }
    }

    /* Jet sneaker path must not reuse a red/burgundy hero filename */
    if (p.slug === "bosiano-crest-knit-sneaker" && productColorMap?.jet?.[0]?.src) {
      const jetHero = productColorMap.jet[0].src;
      if (/burgundy|oxblood|red/i.test(jetHero)) {
        issues.push({
          severity: "error",
          code: "jet-shows-red",
          message: `Jet sneaker hero path looks red/burgundy: ${jetHero}`,
          slug: p.slug,
        });
      }
      const burgundyHero = productColorMap.burgundy?.[0]?.src;
      if (burgundyHero && jetHero === burgundyHero) {
        issues.push({
          severity: "error",
          code: "jet-shows-red",
          message: `Jet sneaker reuses burgundy hero`,
          slug: p.slug,
        });
      }
    }

    /* Cognac belt must not point at a black-named asset */
    if (p.slug === "bosiano-b-leather-belt" && productColorMap?.cognac?.[0]?.src) {
      const cognacHero = productColorMap.cognac[0].src;
      if (/black/i.test(cognacHero) && !/cognac/i.test(cognacHero)) {
        issues.push({
          severity: "error",
          code: "cognac-not-brown",
          message: `Cognac belt hero path looks black: ${cognacHero}`,
          slug: p.slug,
        });
      }
      const blackHero = productColorMap.black?.[0]?.src;
      if (blackHero && cognacHero === blackHero) {
        issues.push({
          severity: "error",
          code: "cognac-not-brown",
          message: `Cognac belt reuses black hero`,
          slug: p.slug,
        });
      }
    }

    /* Watch: Men / Watches — never Jewelry */
    if (p.slug === "bosiano-heritage-watch") {
      if (p.category === "jewelry") {
        issues.push({
          severity: "error",
          code: "watch-in-jewelry",
          message: `Heritage Watch must not use category=jewelry`,
          slug: p.slug,
        });
      }
      if (p.category !== "men" || p.subcategory !== "Watches") {
        issues.push({
          severity: "error",
          code: "watch-taxonomy",
          message: `Watch must be category=men / Watches (got ${p.category}/${p.subcategory})`,
          slug: p.slug,
        });
      }
      const ids = p.colors.map((c) => c.id);
      if (!ids.includes("two-tone") || !ids.includes("terracotta")) {
        issues.push({
          severity: "error",
          code: "watch-color-missing",
          message: `Watch must expose two-tone + terracotta (got ${ids.join(", ")})`,
          slug: p.slug,
        });
      }
      const tt = productColorMap?.["two-tone"]?.[0]?.src;
      const tc = productColorMap?.terracotta?.[0]?.src;
      if (!tc) {
        issues.push({
          severity: "error",
          code: "missing-terracotta-gallery",
          message: `Missing terracotta watch gallery`,
          slug: p.slug,
        });
      }
      if (tt && tc && tt === tc) {
        issues.push({
          severity: "error",
          code: "watch-shared-hero",
          message: `Two-Tone and Terracotta share the same hero`,
          slug: p.slug,
        });
      }
    }

    /* Signet ring: no necklace/pearl packaging; sterling must have its own gallery */
    if (p.slug === "signet-vermeil-ring" && productColorMap) {
      for (const c of p.colors) {
        for (const frame of productColorMap[c.id] ?? []) {
          if (/necklace|pearl-strand|bracelet|earring/i.test(frame.src) || /04-packaging/.test(frame.src)) {
            issues.push({
              severity: "error",
              code: "ring-necklace-image",
              message: `Ring gallery contains unrelated jewelry: ${frame.src}`,
              slug: p.slug,
            });
          }
        }
      }
      const silver = productColorMap["sterling-silver"] ?? [];
      if (!silver.length || silver.every((f) => /gold-vermeil|04-packaging/i.test(f.src))) {
        issues.push({
          severity: "error",
          code: "sterling-missing-gallery",
          message: `Sterling Silver ring missing real silver gallery`,
          slug: p.slug,
        });
      }
      if (silver.some((f) => /gold-vermeil/i.test(f.src))) {
        issues.push({
          severity: "error",
          code: "sterling-uses-gold-image",
          message: `Sterling Silver gallery references gold-vermeil assets`,
          slug: p.slug,
        });
      }
    }

    /* Washed black denim must not use indigo/blue hero path */
    if (p.slug === "relaxed-selvedge-denim" && productColorMap?.["washed-black"]?.[0]?.src) {
      const wb = productColorMap["washed-black"][0].src;
      if (/indigo|blue|raw-indigo/i.test(wb) && !/washed-black|black/i.test(wb)) {
        issues.push({
          severity: "error",
          code: "washed-black-is-blue",
          message: `Washed Black denim hero looks indigo/blue: ${wb}`,
          slug: p.slug,
        });
      }
      const indigo = productColorMap["raw-indigo"]?.[0]?.src;
      if (indigo && wb === indigo) {
        issues.push({
          severity: "error",
          code: "washed-black-is-blue",
          message: `Washed Black reuses Raw Indigo hero`,
          slug: p.slug,
        });
      }
    }

    /* Pleated Wide-Leg Pant — name + charcoal/cream same design */
    if (p.slug === "pleated-wide-leg-trouser") {
      if (!/^Pleated Wide-Leg Pant$/i.test(p.name)) {
        issues.push({
          severity: "error",
          code: "heading-product-mismatch",
          message: `Display name must be Pleated Wide-Leg Pant (got "${p.name}")`,
          slug: p.slug,
        });
      }
      if (/trouser/i.test(p.description) && !/pant/i.test(p.description)) {
        issues.push({
          severity: "error",
          code: "heading-product-mismatch",
          message: `Description still uses trouser wording without pant`,
          slug: p.slug,
        });
      }
      const expectedDesign = productDesignIdBySlug[p.slug] ?? "PLEATED-WIDE-LEG-PANT-01";
      if (productColorMap) {
        const charcoal = productColorMap.charcoal?.[0]?.src ?? "";
        const cream = productColorMap.cream?.[0]?.src ?? "";
        if (!charcoal || !cream) {
          issues.push({
            severity: "error",
            code: "trouser-color-missing",
            message: `Pant must have charcoal + cream galleries`,
            slug: p.slug,
          });
        } else if (charcoal === cream) {
          issues.push({
            severity: "error",
            code: "trouser-shared-hero",
            message: `Charcoal and Cream pants share the same hero`,
            slug: p.slug,
          });
        }
        if (/blue|indigo|khaki|taupe/i.test(charcoal) && !/charcoal/i.test(charcoal)) {
          issues.push({
            severity: "error",
            code: "charcoal-is-blue",
            message: `Charcoal pant hero path looks wrong: ${charcoal}`,
            slug: p.slug,
          });
        }
        for (const c of p.colors) {
          for (const frame of productColorMap[c.id] ?? []) {
            if (frame.designId && frame.designId !== expectedDesign) {
              issues.push({
                severity: "error",
                code: "pant-mixed-design",
                message: `Pant "${c.id}" designId ${frame.designId} != ${expectedDesign}`,
                slug: p.slug,
              });
            }
            if (/shirt|blazer|skirt|dress|skirt-/i.test(frame.src) && !/pant|trouser|charcoal|cream/i.test(frame.src)) {
              issues.push({
                severity: "error",
                code: "pant-wrong-image",
                message: `Pant gallery contains unrelated path: ${frame.src}`,
                slug: p.slug,
              });
            }
          }
        }
      }
    }

    /* Riviera must remain a linen shirt (title/productType) */
    if (p.slug === "riviera-linen-shirt") {
      if (!/linen shirt/i.test(p.name)) {
        issues.push({
          severity: "error",
          code: "heading-product-mismatch",
          message: `Riviera title must remain Riviera Linen Shirt`,
          slug: p.slug,
        });
      }
      if (p.productType !== "linen-shirt" && p.productType !== "shirt") {
        issues.push({
          severity: "error",
          code: "heading-product-mismatch",
          message: `Riviera productType must be linen-shirt (got ${p.productType})`,
          slug: p.slug,
        });
      }
      for (const c of p.colors) {
        const hero = productColorMap?.[c.id]?.[0]?.src ?? "";
        if (/polo|tee-|t-shirt|jacket|blazer|necktie/i.test(hero)) {
          issues.push({
            severity: "error",
            code: "heading-product-mismatch",
            message: `Riviera gallery looks non-shirt: ${hero}`,
            slug: p.slug,
          });
        }
      }
    }

    /* Poplin maxi: White/Lemon/Cornflower must not share a red hero */
    if (p.slug === "poplin-tiered-maxi-dress" && productColorMap) {
      const heroes = ["white", "lemon", "cornflower"].map((id) => productColorMap[id]?.[0]?.src).filter(Boolean) as string[];
      if (heroes.length === 3 && new Set(heroes).size < 3) {
        issues.push({
          severity: "error",
          code: "poplin-shared-red-hero",
          message: `Poplin White/Lemon/Cornflower share hero image(s)`,
          slug: p.slug,
        });
      }
      for (const id of ["white", "lemon", "cornflower"] as const) {
        const hero = productColorMap[id]?.[0]?.src ?? "";
        if (/red|floral-red|crimson/i.test(hero) && !new RegExp(id, "i").test(hero)) {
          issues.push({
            severity: "error",
            code: "poplin-shared-red-hero",
            message: `Poplin "${id}" hero looks red: ${hero}`,
            slug: p.slug,
          });
        }
      }
    }

    /* Blazer: first three gallery frames should be full silhouette views */
    if (p.slug === "sculpted-wool-blazer" && productColorMap) {
      for (const c of p.colors) {
        const gallery = productColorMap[c.id] ?? [];
        const firstThree = gallery.slice(0, 3);
        if (firstThree.length < 3) {
          issues.push({
            severity: "error",
            code: "blazer-incomplete-full-views",
            message: `Blazer "${c.id}" needs 3 full-silhouette views (front/threeq/back)`,
            slug: p.slug,
          });
        }
        for (const frame of firstThree) {
          if (/detail|lapel|cuff|fabric|close-?up/i.test(frame.src) && !/front|threeq|back|hero/i.test(frame.src)) {
            issues.push({
              severity: "error",
              code: "blazer-cropped-primary",
              message: `Blazer primary frame looks like a detail crop: ${frame.src}`,
              slug: p.slug,
            });
          }
        }
      }
      const card = p.cardImage ?? "";
      const expected = productColorMap[p.defaultColor]?.[0]?.src;
      if (expected && card !== expected) {
        issues.push({
          severity: "error",
          code: "shop-card-default-mismatch",
          message: `Blazer cardImage != default variant hero`,
          slug: p.slug,
        });
      }
    }

    /* Coat variants must not reuse flat-lay / competitor pack shots */
    if (p.slug === "double-breasted-wool-coat" && productColorMap) {
      for (const c of p.colors) {
        const hero = productColorMap[c.id]?.[0]?.src ?? "";
        if (/comme|flat-?lay|sneaker|play-/i.test(hero)) {
          issues.push({
            severity: "error",
            code: "coat-wrong-image",
            message: `Coat "${c.id}" hero looks like unrelated flat-lay: ${hero}`,
            slug: p.slug,
          });
        }
      }
      const heroes = p.colors.map((c) => productColorMap[c.id]?.[0]?.src).filter(Boolean) as string[];
      if (heroes.length > 1 && new Set(heroes).size === 1) {
        issues.push({
          severity: "error",
          code: "coat-shared-hero",
          message: `All coat colours share the same hero`,
          slug: p.slug,
        });
      }
    }

    /* Wallet: every black/cognac frame must share BOS-ZIP-WALLET-01 */
    if (p.slug === "bosiano-crest-zip-wallet" && productColorMap) {
      const expected = productDesignIdBySlug[p.slug] ?? "BOS-ZIP-WALLET-01";
      for (const c of p.colors) {
        for (const frame of productColorMap[c.id] ?? []) {
          if (frame.designId && frame.designId !== expected) {
            issues.push({
              severity: "error",
              code: "wallet-mixed-design",
              message: `Wallet "${c.id}" frame designId ${frame.designId} != ${expected}`,
              slug: p.slug,
            });
          }
          if (/card-holder|bifold-slim|coin-purse/i.test(frame.src)) {
            issues.push({
              severity: "error",
              code: "wallet-wrong-silhouette",
              message: `Wallet gallery contains different product type path: ${frame.src}`,
              slug: p.slug,
            });
          }
        }
      }
    }

    /* Crescent: blush gallery must not mix unrelated silhouette filenames */
    if (p.slug === "crescent-shoulder-bag" && productColorMap) {
      const expected = productDesignIdBySlug[p.slug] ?? "CRESCENT-SHOULDER-BAG-01";
      for (const c of p.colors) {
        for (const frame of productColorMap[c.id] ?? []) {
          if (frame.designId && frame.designId !== expected) {
            issues.push({
              severity: "error",
              code: "crescent-mixed-silhouette",
              message: `Crescent "${c.id}" designId ${frame.designId} != ${expected}`,
              slug: p.slug,
            });
          }
        }
      }
      const blush = productColorMap.blush ?? [];
      if (blush.length && blush.some((f) => !/blush|01-|02-|03-|04-|06-/.test(f.src))) {
        /* warn only if clearly another colorway leaked into blush */
        if (blush.some((f) => /chocolate|ecru|noir|black/i.test(f.src) && !/blush/i.test(f.src))) {
          issues.push({
            severity: "error",
            code: "crescent-mixed-silhouette",
            message: `Blush gallery contains another colourway path`,
            slug: p.slug,
          });
        }
      }
    }

    /* productType must match catalog map when present */
    const mappedType = productTypeBySlug[p.slug];
    if (mappedType && p.productType && mappedType !== p.productType) {
      issues.push({
        severity: "error",
        code: "product-type-mismatch",
        message: `productType "${p.productType}" != mapped "${mappedType}"`,
        slug: p.slug,
      });
    }

    const oneSize = p.sizes.length === 1 && /^one[\s-]?size$/i.test(p.sizes[0]);
    if (oneSize && p.sizes.length > 1) {
      issues.push({
        severity: "error",
        code: "onesize-mismatch",
        message: `One-size product has unexpected size options`,
        slug: p.slug,
      });
    }
    /* Contract for PDP: One Size SKUs must not gate Add to bag on size selection */
    if (oneSize && p.sizes[0] && !/^one[\s-]?size$/i.test(p.sizes[0])) {
      issues.push({
        severity: "error",
        code: "onesize-select-size-cta",
        message: `One-size product sizes[0] is "${p.sizes[0]}" — PDP would show Select a size`,
        slug: p.slug,
      });
    }

    /* Category / gender / productType consistency (breadcrumb source of truth) */
    if (p.gender === "women" && p.category === "men") {
      issues.push({
        severity: "error",
        code: "category-gender-mismatch",
        message: `gender=women but category=men`,
        slug: p.slug,
      });
    }
    if (p.gender === "men" && p.category === "women") {
      issues.push({
        severity: "error",
        code: "category-gender-mismatch",
        message: `gender=men but category=women`,
        slug: p.slug,
      });
    }
    /* Explicitly genderless apparel must not inherit a Women/Men breadcrumb */
    if (
      p.gender === "unisex" &&
      (p.category === "women" || p.category === "men") &&
      /genderless/i.test(p.description)
    ) {
      issues.push({
        severity: "error",
        code: "unisex-category-mismatch",
        message: `Genderless apparel still uses category="${p.category}" — set category=unisex`,
        slug: p.slug,
      });
    }
    if (p.productType === "blazer" && p.category === "men" && p.gender === "women") {
      issues.push({
        severity: "error",
        code: "breadcrumb-category-mismatch",
        message: `Women's blazer metadata mixed with men category`,
        slug: p.slug,
      });
    }
    if (p.productType === "earring" && /vermeil|gold/i.test(p.colors.map((c) => c.label).join(" "))) {
      for (const v of p.variants) {
        for (const url of v.images) {
          if (/sterling-silver|silver-|photo-1605100804763|photo-1599643478518/i.test(url)) {
            issues.push({
              severity: "error",
              code: "gold-vermeil-silver-image",
              message: `Gold vermeil earring gallery contains silver/unrelated stock: ${url.slice(0, 80)}`,
              slug: p.slug,
            });
          }
        }
      }
    }

    if (p.productType === "belt" && p.category === "bags") {
      issues.push({
        severity: "error",
        code: "belt-in-bags-category",
        message: `Belt must use category=accessories, not bags`,
        slug: p.slug,
      });
    }
    if (p.slug === "bosiano-b-leather-belt" && (p.category !== "accessories" || p.subcategory !== "Belts")) {
      issues.push({
        severity: "error",
        code: "breadcrumb-category-mismatch",
        message: `Belt breadcrumb must be Accessories / Belts`,
        slug: p.slug,
      });
    }
    if (p.slug === "bosiano-crest-zip-wallet") {
      if (p.category !== "bags" || p.subcategory !== "Small Leather Goods") {
        issues.push({
          severity: "error",
          code: "breadcrumb-category-mismatch",
          message: `Wallet breadcrumb must be Bags / Small Leather Goods`,
          slug: p.slug,
        });
      }
      if (productColorMap) {
        const cognacHero = productColorMap.cognac?.[0]?.src ?? "";
        const blackHero = productColorMap.black?.[0]?.src ?? "";
        if (cognacHero && blackHero && cognacHero === blackHero) {
          issues.push({
            severity: "error",
            code: "shared-hero-across-colors",
            message: `Cognac and Black wallet share the same hero`,
            slug: p.slug,
          });
        }
        if (/black/i.test(cognacHero) && !/cognac/i.test(cognacHero)) {
          issues.push({
            severity: "error",
            code: "cognac-using-black-hero",
            message: `Cognac wallet hero path looks black: ${cognacHero}`,
            slug: p.slug,
          });
        }
      }
    }

    if (p.slug === "bosiano-silk-twill-scarf" && p.category !== "accessories") {
      issues.push({
        severity: "error",
        code: "scarf-taxonomy",
        message: `Bosiano scarf must be category=accessories`,
        slug: p.slug,
      });
    }

    if (p.slug === "bosiano-italian-heritage-parfum" && p.category !== "fragrance") {
      issues.push({
        severity: "error",
        code: "perfume-women-category",
        message: `Perfume must use category=fragrance (got ${p.category})`,
        slug: p.slug,
      });
    }
    if (p.slug === "bosiano-crest-tee" || p.slug === "bosiano-crest-poplin-shirt") {
      const other = list.find((x) => x.slug === (p.slug === "bosiano-crest-tee" ? "bosiano-crest-poplin-shirt" : "bosiano-crest-tee"));
      if (other && p.cardImage && other.cardImage && p.cardImage === other.cardImage) {
        issues.push({
          severity: "error",
          code: "tee-poplin-shared-image",
          message: `Tee and Poplin Shirt share cardImage`,
          slug: p.slug,
        });
      }
      const pHero = p.imagesByColor?.[p.defaultColor]?.[0]?.src;
      const oHero = other?.imagesByColor?.[other.defaultColor]?.[0]?.src;
      if (pHero && oHero && pHero === oHero) {
        issues.push({
          severity: "error",
          code: "tee-poplin-shared-image",
          message: `Tee and Poplin Shirt share default hero`,
          slug: p.slug,
        });
      }
    }
    if (p.cardImage && p.defaultColor && p.imagesByColor?.[p.defaultColor]?.[0]?.src) {
      const expected = p.imagesByColor[p.defaultColor][0].src;
      if (p.cardImage !== expected) {
        issues.push({
          severity: "error",
          code: "card-image-not-default-hero",
          message: `cardImage must equal defaultColor hero`,
          slug: p.slug,
        });
      }
    }

    const imgs = p.variants[0]?.images ?? [];
    if (!imgs.length) {
      issues.push({ severity: "error", code: "empty-images", message: `Empty gallery`, slug: p.slug });
    }

    const allVariantImgs = p.variants.flatMap((v) => v.images);
    if (p.cardImage && !allVariantImgs.includes(p.cardImage)) {
      issues.push({
        severity: "error",
        code: "card-image-not-in-gallery",
        message: `cardImage not present in any variant gallery`,
        slug: p.slug,
      });
    }

    const unique = new Set(imgs);
    if (unique.size !== imgs.length) {
      issues.push({ severity: "warn", code: "duplicate-in-gallery", message: `Duplicate URLs in gallery`, slug: p.slug });
    }

    const forbidden = PRODUCT_TYPE_FORBIDDEN_PATHS[p.productType] ?? [];

    for (const v of p.variants) {
      for (const url of v.images) {
        if (!url) {
          issues.push({ severity: "error", code: "empty-src", message: `Empty image src (${v.color})`, slug: p.slug });
          continue;
        }

        for (const re of COMPETITOR_IMAGE_PATTERNS) {
          if (re.test(url) && !p.name.toLowerCase().includes("nike")) {
            issues.push({
              severity: "error",
              code: "competitor-image",
              message: `Competitor/Nike image pattern in gallery: ${url.slice(0, 80)}`,
              slug: p.slug,
            });
          }
        }

        for (const re of forbidden) {
          if (re.test(url)) {
            issues.push({
              severity: "error",
              code: "mixed-product-type",
              message: `Gallery path looks wrong for productType="${p.productType}": ${url.slice(0, 80)}`,
              slug: p.slug,
            });
          }
        }

        /* Colour integrity: black/bone mule must not pull blue/floral stock */
        if (p.productType === "heeled-mule" && /floral|1543163521|1515347619252|1520639888713/i.test(url)) {
          issues.push({
            severity: "error",
            code: "invalid-color-image",
            message: `Mule gallery contains forbidden footwear stock: ${url.slice(0, 80)}`,
            slug: p.slug,
          });
        }

        const owner = galleryOwners.get(url);
        const brandShareOk = url.startsWith("/brand/") || url === DEFAULT_SAFE_SHARE;
        if (owner && owner !== p.slug && !brandShareOk) {
          /* Owned /products/ assets must never cross SKUs; remote stock shares are warnings */
          const severity = url.startsWith("/products/") ? "error" : "warn";
          issues.push({
            severity,
            code: "shared-image-url",
            message: `Shared image URL between "${owner}" and "${p.slug}"`,
            slug: p.slug,
          });
        }
        if (!owner) galleryOwners.set(url, p.slug);
      }
    }
  }

  /* Unrelated outerwear SKUs must never share cardImage */
  const outerwearPair: [string, string][] = [
    ["boro-patchwork-jacket", "field-utility-overshirt"],
  ];
  for (const [a, b] of outerwearPair) {
    const pa = list.find((p) => p.slug === a);
    const pb = list.find((p) => p.slug === b);
    if (pa?.cardImage && pb?.cardImage && pa.cardImage === pb.cardImage) {
      issues.push({
        severity: "error",
        code: "shared-outerwear-card",
        message: `Unrelated outerwear share cardImage: ${pa.cardImage}`,
        slug: a,
      });
    }
  }

  /* Distinct products must not share designId */
  const designOwners = new Map<string, string>();
  for (const p of list) {
    const design = productDesignIdBySlug[p.slug];
    if (!design) continue;
    const prev = designOwners.get(design);
    if (prev && prev !== p.slug) {
      issues.push({
        severity: "error",
        code: "shared-design-id",
        message: `designId "${design}" shared by "${prev}" and "${p.slug}"`,
        slug: p.slug,
      });
    } else {
      designOwners.set(design, p.slug);
    }
  }

  return issues;
}

function validateProductCatalog(list: Product[]) {
  if (process.env.NODE_ENV === "production") return;
  for (const issue of auditProductCatalog(list)) {
    if (issue.severity !== "error") continue;
    console.error(`[products] ${issue.code}: ${issue.message}${issue.slug ? ` (${issue.slug})` : ""}`);
  }
}

validateProductCatalog(products);

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug || p.id === slug);
}

/** Canonical breadcrumb / shop category label from product metadata — never hardcode Women. */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    women: "Women",
    men: "Men",
    unisex: "Unisex",
    clothing: "Clothing",
    bags: "Bags",
    shoes: "Shoes",
    jewelry: "Jewelry",
    accessories: "Accessories",
    fragrance: "Fragrance",
    gifts: "Gifts",
  };
  if (labels[category]) return labels[category];
  if (!category) return "Shop";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Normalize shop `sub` query aliases.
 * Men trousers category is always "Trousers" — never Pant / Pants / Trouser.
 */
export function normalizeShopSubcategory(sub: string): string {
  if (!sub) return "";
  if (/^pants?$/i.test(sub) || /^trouser$/i.test(sub)) return "Trousers";
  return sub;
}

/** Breadcrumb trail from canonical product metadata (Home → … → product). */
export function getProductBreadcrumbs(product: Pick<Product, "name" | "category" | "subcategory">): {
  label: string;
  href?: string;
}[] {
  const crumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
    { label: getCategoryLabel(product.category), href: `/shop?category=${product.category}` },
  ];
  if (product.subcategory) {
    crumbs.push({
      label: product.subcategory,
      href: `/shop?category=${product.category}&sub=${encodeURIComponent(product.subcategory)}`,
    });
  }
  crumbs.push({ label: product.name });
  return crumbs;
}

export function totalStock(p: Product) {
  return p.variants.reduce(
    (sum, v) => sum + Object.values(v.inventory).reduce((a, b) => a + b, 0),
    0
  );
}

/** Deterministic estimated restock date for sold-out pieces. */
export function estimatedRestock(productId: string): string {
  let h = 0;
  for (let i = 0; i < productId.length; i++) h = (h * 31 + productId.charCodeAt(i)) >>> 0;
  const days = 7 + (h % 21);
  const d = new Date(2026, 6, 27);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function relatedProducts(p: Product, limit = 4) {
  return findSimilar(p, limit);
}

/** Find visually / semantically similar products for discovery rails. */
export function findSimilar(p: Product, limit = 8) {
  const pName = p.name.toLowerCase();
  return products
    .filter((x) => x.id !== p.id)
    .map((x) => {
      const xName = x.name.toLowerCase();
      /* Prefer distinct pieces — avoid chaining near-duplicate scarf titles */
      const nearDuplicateName =
        (pName.includes("scarf") && xName.includes("scarf") && p.brandId !== x.brandId) ||
        (pName.includes("wrap") && xName.includes("scarf"));
      return {
        x,
        score:
          (x.brandId === p.brandId ? 3 : 0) +
          (x.category === p.category ? 2 : 0) +
          (x.subcategory === p.subcategory ? 3 : 0) +
          x.vibe.filter((v) => p.vibe.includes(v)).length * 2 +
          x.materialTags.filter((m) => p.materialTags.includes(m)).length * 2 +
          x.occasions.filter((o) => p.occasions.includes(o)).length +
          (Math.abs(x.price - p.price) < p.price * 0.35 ? 1 : 0) -
          (nearDuplicateName ? 4 : 0),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.x);
}

export function findByBarcode(code: string) {
  const normalized = code.trim().toUpperCase();
  return products.find((p) => p.barcode === normalized || p.barcode.endsWith(normalized));
}

export function allMaterialTags() {
  return [...new Set(products.flatMap((p) => p.materialTags))].sort();
}

export function allCountries() {
  return [...new Set(products.map((p) => p.countryOfOrigin))].sort();
}

export function allOccasions() {
  return [...new Set(products.flatMap((p) => p.occasions))].sort();
}
