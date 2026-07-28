import type { Product, ProductVariant, StoreLocation, ModelMeasurements } from "./types";
import { brands } from "./brands";
import { seeded, slugify } from "./utils";

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
}

function buildVariants(id: string, colors: [string, string][], sizes: string[]): ProductVariant[] {
  return colors.map(([color, hex], ci) => {
    const rnd = seeded(id.length * 31 + ci * 97 + 7);
    const inventory: Record<string, number> = {};
    sizes.forEach((s, si) => {
      const roll = rnd();
      inventory[s] = roll < 0.14 ? 0 : roll < 0.34 ? Math.ceil(rnd() * 3) : Math.ceil(rnd() * 24) + 3;
      void si;
    });
    return {
      id: `${id}-${slugify(color)}`,
      color,
      hex,
      images: Array.from({ length: 4 }, (_, i) => `${id}-${ci}-${i}`),
      inventory,
    };
  });
}

const seeds: Seed[] = [
  {
    name: "Sculpted Wool Blazer",
    brandId: "maison-verane",
    category: "women",
    subcategory: "Tailoring",
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
    category: "women",
    subcategory: "Shirts",
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
    gender: "unisex",
    price: 920,
    colors: [["Indigo", "#26374f"], ["Sumi", "#22232a"]],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Inspired by Japanese boro mending, this chore jacket is pieced from indigo-dyed cotton with visible sashiko stitching — a celebration of imperfection.",
    details: ["Hand sashiko stitching", "Patchwork indigo cotton", "Three patch pockets", "Corozo buttons"],
    materials: "100% indigo-dyed cotton.",
    care: "Machine wash cold, hang dry.",
    tags: ["jacket", "workwear", "artisanal", "indigo"],
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
    name: "Pleated Wide-Leg Trouser",
    brandId: "maison-verane",
    category: "men",
    subcategory: "Trousers",
    gender: "men",
    price: 420,
    colors: [["Taupe", "#a99a86"], ["Charcoal", "#33343a"], ["Cream", "#e9e2d3"]],
    sizes: ["28", "30", "32", "34", "36", "38"],
    description:
      "A double-pleated wide-leg trouser in a fluid wool blend, cut high on the waist for a clean, elongating line reminiscent of 1940s tailoring.",
    details: ["Double forward pleats", "High rise", "Wide straight leg", "Side adjusters, no belt loops"],
    materials: "78% wool, 22% mohair.",
    care: "Dry clean only.",
    tags: ["trouser", "tailoring", "wide-leg", "evening"],
    vibe: ["structured", "elegant", "vintage", "tailored", "neutral", "evening"],
    rating: 4.7,
    reviewCount: 188,
  },
  {
    name: "Riviera Linen Shirt",
    brandId: "solene",
    category: "men",
    subcategory: "Shirts",
    gender: "men",
    price: 190,
    colors: [["White", "#f3efe6"], ["Sky", "#a9c4d6"], ["Terracotta", "#c07a55"]],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A breezy camp-collar shirt in garment-dyed European linen — made for long lunches and golden-hour aperitivos.",
    details: ["Camp collar", "Garment-dyed linen", "Chest patch pocket", "Relaxed fit"],
    materials: "100% European linen.",
    care: "Machine wash cold, tumble dry low.",
    tags: ["shirt", "linen", "resort", "summer"],
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
    gender: "unisex",
    price: 260,
    colors: [["Raw Indigo", "#2b3852"], ["Washed Black", "#2a2a2c"]],
    sizes: ["28", "30", "32", "34", "36", "38"],
    description:
      "A relaxed straight jean in 14oz Japanese selvedge denim that breaks in to become uniquely yours.",
    details: ["14oz Japanese selvedge denim", "Relaxed straight leg", "Button fly", "Chain-stitched hem"],
    materials: "100% cotton selvedge denim.",
    care: "Wash sparingly, inside out, cold.",
    tags: ["denim", "jeans", "everyday", "unisex"],
    vibe: ["workwear", "everyday", "americana", "relaxed", "unisex", "casual"],
    rating: 4.8,
    reviewCount: 458,
  },
  {
    name: "Field Utility Overshirt",
    brandId: "kestrel",
    category: "men",
    subcategory: "Outerwear",
    gender: "men",
    price: 310,
    colors: [["Olive", "#5c5a3c"], ["Ecru", "#ddd3bf"], ["Navy", "#232c3d"]],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A shirt-jacket in waxed organic cotton with four utility pockets — the layer that does everything.",
    details: ["Waxed organic cotton", "Four flap pockets", "Corozo buttons", "Relaxed fit"],
    materials: "100% waxed organic cotton.",
    care: "Spot clean; re-wax as needed.",
    tags: ["overshirt", "jacket", "utility", "layering"],
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
    gender: "women",
    price: 540,
    colors: [["White", "#f2eee4"], ["Lemon", "#e6cf7f"], ["Cornflower", "#8ea6cf"]],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "A breezy tiered maxi in crisp cotton poplin with a smocked bodice — resort dressing at its most romantic.",
    details: ["Crisp cotton poplin", "Smocked bodice", "Tiered skirt", "Adjustable ties at shoulder"],
    materials: "100% cotton poplin.",
    care: "Machine wash cold, line dry.",
    tags: ["dress", "maxi", "resort", "summer"],
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
    gender: "women",
    price: 1490,
    colors: [["Camel", "#b58a56"], ["Grey Melange", "#8f9095"], ["Black", "#171717"]],
    sizes: ["XS", "S", "M", "L"],
    description:
      "A timeless double-breasted overcoat in a wool-cashmere blend, cut long and lean with a peak lapel.",
    details: ["Wool-cashmere blend", "Peak lapel", "Double-breasted, six-button", "Below-knee length"],
    materials: "90% wool, 10% cashmere.",
    care: "Dry clean only.",
    tags: ["coat", "outerwear", "tailoring", "winter"],
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
];

export const products: Product[] = seeds.map((s, index) => {
  const slug = slugify(s.name);
  const id = slug;
  const brand = brands.find((b) => b.id === s.brandId);
  const materialTags = extractMaterialTags(s.materials, s.tags);
  const occasions = extractOccasions(s.tags, s.vibe);
  const rnd = seeded(index * 41 + 9);
  return {
    id,
    slug,
    name: s.name,
    brandId: s.brandId,
    category: s.category,
    subcategory: s.subcategory,
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
    variants: buildVariants(id, s.colors, s.sizes),
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
    spin: Array.from({ length: 8 }, (_, i) => `${id}-spin-${i}`),
    video: s.video ? `${id}-video` : undefined,
  };
});

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug || p.id === slug);
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
  return products
    .filter((x) => x.id !== p.id)
    .map((x) => ({
      x,
      score:
        (x.brandId === p.brandId ? 3 : 0) +
        (x.category === p.category ? 2 : 0) +
        (x.subcategory === p.subcategory ? 3 : 0) +
        x.vibe.filter((v) => p.vibe.includes(v)).length * 2 +
        x.materialTags.filter((m) => p.materialTags.includes(m)).length * 2 +
        x.occasions.filter((o) => p.occasions.includes(o)).length +
        (Math.abs(x.price - p.price) < p.price * 0.35 ? 1 : 0),
    }))
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
