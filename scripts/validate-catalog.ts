/**
 * Catalog integrity gate — fail CI on severe product/image errors.
 *
 * Run: npm run validate:catalog
 */
import fs from "fs";
import path from "path";
import { products, auditProductCatalog, type CatalogIssue } from "../src/lib/products";
import {
  COMPETITOR_IMAGE_PATTERNS,
  productDesignIdBySlug,
  productImages,
  productImagesByColor,
} from "../src/lib/images";
import { megaNav } from "../src/lib/nav";

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

function localPathExists(src: string): boolean {
  if (!src.startsWith("/")) return true; // remote — not checked here
  const file = path.join(publicDir, src.replace(/^\//, ""));
  return fs.existsSync(file);
}

function main() {
  const issues: CatalogIssue[] = [...auditProductCatalog(products)];

  /* Broken local paths across productImages + colour maps */
  const allLocal = new Map<string, string>();
  for (const [slug, urls] of Object.entries(productImages)) {
    for (const url of urls) {
      allLocal.set(`${slug}::${url}`, slug);
      if (url.startsWith("/") && !localPathExists(url)) {
        issues.push({
          severity: "error",
          code: "broken-local-path",
          message: `Missing local image file: ${url}`,
          slug,
        });
      }
      for (const re of COMPETITOR_IMAGE_PATTERNS) {
        if (re.test(url)) {
          issues.push({
            severity: "error",
            code: "competitor-image",
            message: `Competitor pattern in productImages: ${url.slice(0, 80)}`,
            slug,
          });
        }
      }
    }
  }

  for (const [slug, byColor] of Object.entries(productImagesByColor)) {
    for (const [color, urls] of Object.entries(byColor)) {
      const uniq = new Set(urls);
      if (uniq.size !== urls.length) {
        issues.push({
          severity: "warn",
          code: "duplicate-in-color-gallery",
          message: `Duplicate URLs in imagesByColor["${color}"]`,
          slug,
        });
      }
      if (!urls.length) {
        issues.push({
          severity: "error",
          code: "empty-color-gallery",
          message: `Empty imagesByColor["${color}"]`,
          slug,
        });
      }
      for (const url of urls) {
        if (!url) {
          issues.push({
            severity: "error",
            code: "empty-src",
            message: `Empty src in imagesByColor["${color}"]`,
            slug,
          });
          continue;
        }
        if (url.startsWith("/") && !localPathExists(url)) {
          issues.push({
            severity: "error",
            code: "broken-local-path",
            message: `Missing local image for ${color}: ${url}`,
            slug,
          });
        }
      }
    }
  }

  /* Critical route smoke checks */
  const critical: Record<
    string,
    { price: number; brandId: string; productType: string; styleId: string; colors: string[] }
  > = {
    "crescent-shoulder-bag": {
      price: 780,
      brandId: "belrose",
      productType: "shoulder-bag",
      styleId: "belrose-crescent-shoulder-bag-01",
      colors: ["blush", "chocolate", "ecru"],
    },
    "sculptural-heeled-mule": {
      price: 560,
      brandId: "maison-verane",
      productType: "heeled-mule",
      styleId: "sculptural-heeled-mule-01",
      colors: ["black", "bone"],
    },
    "signet-vermeil-ring": {
      price: 210,
      brandId: "sanso",
      productType: "ring",
      styleId: "signet-vermeil-ring-01",
      colors: ["gold-vermeil", "sterling-silver"],
    },
    "minimalist-leather-sneaker": {
      price: 340,
      brandId: "sanso",
      productType: "sneaker",
      styleId: "minimalist-leather-sneaker-01",
      colors: ["white", "black", "grey"],
    },
    "cashmere-travel-wrap": {
      price: 480,
      brandId: "hana-mori",
      productType: "wrap",
      styleId: "cashmere-travel-wrap-01",
      colors: ["fog", "charcoal", "camel"],
    },
    "silk-twill-scarf": {
      price: 145,
      brandId: "belrose",
      productType: "scarf",
      styleId: "silk-twill-scarf-01",
      colors: ["rose-garden", "ocean"],
    },
    "bosiano-silk-twill-scarf": {
      price: 295,
      brandId: "bosiano",
      productType: "scarf",
      styleId: "bosiano-silk-twill-scarf-01",
      colors: ["champagne-border", "cognac-border"],
    },
    "organic-cotton-oversized-shirt": {
      price: 240,
      brandId: "atelier-norde",
      productType: "shirt",
      styleId: "organic-cotton-oversized-shirt-01",
      colors: ["optic-white", "stone", "slate"],
    },
    "merino-crewneck-sweater": {
      price: 220,
      brandId: "atelier-norde",
      productType: "crewneck-sweater",
      styleId: "merino-crewneck-sweater-01",
      colors: ["oatmeal", "forest", "navy", "black"],
    },
    "fluid-silk-slip-dress": {
      price: 690,
      brandId: "belrose",
      productType: "slip-dress",
      styleId: "belrose-fluid-silk-slip-dress-01",
      colors: ["blush", "midnight", "sage"],
    },
    "structured-leather-tote": {
      price: 1150,
      brandId: "sanso",
      productType: "tote",
      styleId: "sanso-structured-leather-tote-01",
      colors: ["cognac", "black", "bone"],
    },
    "bosiano-cognac-flap-bag": {
      price: 1180,
      brandId: "bosiano",
      productType: "shoulder-bag",
      styleId: "bosiano-cognac-flap-bag-01",
      colors: ["cognac", "noir"],
    },
    "handwoven-aso-oke-clutch": {
      price: 340,
      brandId: "okoro",
      productType: "clutch",
      styleId: "okoro-handwoven-aso-oke-clutch-01",
      colors: ["gold-weave", "indigo-weave"],
    },
    "bosiano-crest-leather-handbag": {
      price: 1280,
      brandId: "bosiano",
      productType: "shoulder-bag",
      styleId: "bosiano-crest-leather-handbag-01",
      colors: ["botanical-cream", "espresso-print"],
    },
    "bosiano-crest-zip-wallet": {
      price: 420,
      brandId: "bosiano",
      productType: "wallet",
      styleId: "bosiano-crest-zip-wallet-01",
      colors: ["cognac", "black"],
    },
    "bosiano-b-leather-belt": {
      price: 380,
      brandId: "bosiano",
      productType: "belt",
      styleId: "bosiano-b-leather-belt-01",
      colors: ["cognac", "black"],
    },
    "sculpted-wool-blazer": {
      price: 1290,
      brandId: "maison-verane",
      productType: "blazer",
      styleId: "sculpted-wool-blazer-01",
      colors: ["charcoal", "camel", "ivory"],
    },
    "adire-wrap-midi-skirt": {
      price: 380,
      brandId: "okoro",
      productType: "wrap-skirt",
      styleId: "adire-wrap-midi-skirt-01",
      colors: ["indigo", "rust"],
    },
    "twisted-hoop-earrings": {
      price: 165,
      brandId: "belrose",
      productType: "earring",
      styleId: "twisted-hoop-earrings-01",
      colors: ["gold-vermeil"],
    },
    "bosiano-pearl-drop-earrings": {
      price: 380,
      brandId: "bosiano",
      productType: "earring",
      styleId: "bosiano-pearl-drop-earrings-01",
      colors: ["warm-pearl", "ivory-pearl"],
    },
    "bosiano-crest-knit-sneaker": {
      price: 490,
      brandId: "bosiano",
      productType: "sneaker",
      styleId: "bosiano-crest-knit-sneaker-01",
      colors: ["burgundy", "jet"],
    },
    "bosiano-italian-heritage-parfum": {
      price: 195,
      brandId: "bosiano",
      productType: "perfume",
      styleId: "bosiano-italian-heritage-perfume-01",
      colors: ["amber"],
    },
    "bosiano-crest-ring-box": {
      price: 95,
      brandId: "bosiano",
      productType: "ring-box",
      styleId: "bosiano-crest-ring-box-01",
      colors: ["matte-black", "cognac-leather"],
    },
    "bosiano-crest-poplin-shirt": {
      price: 320,
      brandId: "bosiano",
      productType: "poplin-shirt",
      styleId: "bosiano-crest-poplin-shirt-01",
      colors: ["ivory", "soft-black", "champagne"],
    },
    "bosiano-crest-tee": {
      price: 145,
      brandId: "bosiano",
      productType: "tee",
      styleId: "bosiano-crest-tee-01",
      colors: ["ivory", "jet", "gold-dust"],
    },
    "bosiano-heritage-watch": {
      price: 2450,
      brandId: "bosiano",
      productType: "watch",
      styleId: "bosiano-heritage-watch-01",
      colors: ["two-tone", "terracotta"],
    },
    "riviera-linen-shirt": {
      price: 190,
      brandId: "solene",
      productType: "linen-shirt",
      styleId: "riviera-linen-shirt-01",
      colors: ["ivory", "sand", "sage"],
    },
    "pleated-wide-leg-trouser": {
      price: 420,
      brandId: "maison-verane",
      productType: "trouser",
      styleId: "pleated-wide-leg-trouser-01",
      colors: ["charcoal", "cream"],
    },
    // display name validated separately → Pleated Wide-Leg Pant
    "relaxed-selvedge-denim": {
      price: 260,
      brandId: "kestrel",
      productType: "denim",
      styleId: "relaxed-selvedge-denim-01",
      colors: ["raw-indigo", "washed-black"],
    },
    "boro-patchwork-jacket": {
      price: 920,
      brandId: "hana-mori",
      productType: "jacket",
      styleId: "boro-patchwork-jacket-01",
      colors: ["black-brown", "deep-indigo"],
    },
    "field-utility-overshirt": {
      price: 310,
      brandId: "kestrel",
      productType: "overshirt",
      styleId: "field-utility-overshirt-01",
      colors: ["olive-green", "black"],
    },
  };

  for (const [slug, expect] of Object.entries(critical)) {
    const p = products.find((x) => x.slug === slug);
    if (!p) {
      issues.push({ severity: "error", code: "missing-product", message: `Missing critical product`, slug });
      continue;
    }
    if (expect.price && p.price !== expect.price) {
      issues.push({
        severity: "error",
        code: "price-mismatch",
        message: `Expected price ${expect.price}, got ${p.price}`,
        slug,
      });
    }
    if (expect.brandId && p.brandId !== expect.brandId) {
      issues.push({
        severity: "error",
        code: "brand-mismatch",
        message: `Expected brand ${expect.brandId}, got ${p.brandId}`,
        slug,
      });
    }
    if (expect.productType && p.productType !== expect.productType) {
      issues.push({
        severity: "error",
        code: "product-type-mismatch",
        message: `Expected productType ${expect.productType}, got ${p.productType}`,
        slug,
      });
    }
    if (expect.styleId && p.styleId !== expect.styleId) {
      issues.push({
        severity: "error",
        code: "style-id-mismatch",
        message: `Expected styleId ${expect.styleId}, got ${p.styleId}`,
        slug,
      });
    }
    if (!productImagesByColor[slug]) {
      issues.push({
        severity: "error",
        code: "missing-images-by-color",
        message: `Critical multi-colour SKU missing imagesByColor`,
        slug,
      });
    }
    for (const colorId of expect.colors) {
      if (!productImagesByColor[slug]?.[colorId]?.length) {
        issues.push({
          severity: "error",
          code: "missing-color-gallery",
          message: `Critical colour "${colorId}" missing gallery`,
          slug,
        });
      }
      if (!p.variants.some((v) => v.colorId === colorId)) {
        issues.push({
          severity: "error",
          code: "color-id-mismatch",
          message: `Expected variant colorId "${colorId}"`,
          slug,
        });
      }
    }
    if (!p.defaultColor || !expect.colors.includes(p.defaultColor)) {
      issues.push({
        severity: "error",
        code: "default-color-mismatch",
        message: `defaultColor "${p.defaultColor}" not in expected colours`,
        slug,
      });
    }
    if (!p.cardImage || !p.variants.some((v) => v.images.includes(p.cardImage))) {
      issues.push({
        severity: "error",
        code: "card-image-not-in-gallery",
        message: `cardImage missing from galleries`,
        slug,
      });
    }

    /* Breadcrumb category must match product.category label source */
    if (slug === "sculpted-wool-blazer" && (p.category !== "women" || p.gender !== "women")) {
      issues.push({
        severity: "error",
        code: "breadcrumb-category-mismatch",
        message: `Sculpted Wool Blazer must be category=women / gender=women`,
        slug,
      });
    }
    if (slug === "organic-cotton-oversized-shirt" && p.category !== "unisex") {
      issues.push({
        severity: "error",
        code: "breadcrumb-category-mismatch",
        message: `Organic Cotton Oversized Shirt must be category=unisex`,
        slug,
      });
    }
    if (slug === "twisted-hoop-earrings") {
      for (const url of p.variants.flatMap((v) => v.images)) {
        if (/unsplash|photo-1605100804763|photo-1599643478518|signet|ring\//i.test(url)) {
          issues.push({
            severity: "error",
            code: "cross-product-gallery",
            message: `Twisted hoop gallery contains unrelated jewelry stock: ${url.slice(0, 80)}`,
            slug,
          });
        }
      }
    }
    if (slug === "bosiano-b-leather-belt") {
      if (p.category !== "accessories" || p.subcategory !== "Belts") {
        issues.push({
          severity: "error",
          code: "belt-in-bags-category",
          message: `Belt must be category=accessories / Belts (got ${p.category}/${p.subcategory})`,
          slug,
        });
      }
    }
    if (slug === "bosiano-heritage-watch") {
      if (p.category === "jewelry" || p.category !== "men" || p.subcategory !== "Watches") {
        issues.push({
          severity: "error",
          code: "watch-in-jewelry",
          message: `Watch must be Men / Watches, not Jewelry (got ${p.category}/${p.subcategory})`,
          slug,
        });
      }
    }
    if (slug === "pleated-wide-leg-trouser") {
      if (!/^Pleated Wide-Leg Pant$/i.test(p.name)) {
        issues.push({
          severity: "error",
          code: "heading-product-mismatch",
          message: `Expected display name Pleated Wide-Leg Pant, got "${p.name}"`,
          slug,
        });
      }
      if (productDesignIdBySlug?.[slug] && productDesignIdBySlug[slug] !== "PLEATED-WIDE-LEG-PANT-01") {
        issues.push({
          severity: "error",
          code: "design-id-mismatch",
          message: `Expected designId PLEATED-WIDE-LEG-PANT-01`,
          slug,
        });
      }
    }
    if (slug === "bosiano-silk-twill-scarf" && p.category !== "accessories") {
      issues.push({
        severity: "error",
        code: "breadcrumb-category-mismatch",
        message: `Scarf breadcrumb must start Accessories`,
        slug,
      });
    }
    if (slug === "bosiano-crest-zip-wallet" && (p.category !== "bags" || p.subcategory !== "Small Leather Goods")) {
      issues.push({
        severity: "error",
        code: "breadcrumb-category-mismatch",
        message: `Wallet breadcrumb must be Bags / Small Leather Goods`,
        slug,
      });
    }
    if (slug === "signet-vermeil-ring") {
      for (const url of p.variants.flatMap((v) => v.images)) {
        if (/necklace|pearl-strand|04-packaging/i.test(url)) {
          issues.push({
            severity: "error",
            code: "ring-necklace-image",
            message: `Ring gallery contains unrelated jewelry: ${url}`,
            slug,
          });
        }
      }
      const silver = productImagesByColor[slug]?.["sterling-silver"] ?? [];
      if (!silver.length || silver.every((u) => /gold-vermeil|packaging/i.test(u))) {
        issues.push({
          severity: "error",
          code: "sterling-missing-gallery",
          message: `Sterling Silver ring missing real silver gallery`,
          slug,
        });
      }
    }
    if (slug === "bosiano-pearl-drop-earrings") {
      const ivory = productImagesByColor[slug]?.["ivory-pearl"] ?? [];
      if (ivory.some((u) => /warm-pearl/i.test(u))) {
        issues.push({
          severity: "error",
          code: "pearl-hardware-mismatch",
          message: `Ivory Pearl gallery reuses Warm Pearl paths`,
          slug,
        });
      }
    }
    if (slug === "bosiano-italian-heritage-parfum") {
      if (p.category !== "fragrance") {
        issues.push({
          severity: "error",
          code: "perfume-women-category",
          message: `Perfume category must be fragrance`,
          slug,
        });
      }
      if (!/^Bosiano Italian Heritage Perfume$/i.test(p.name)) {
        issues.push({
          severity: "error",
          code: "perfume-name-mismatch",
          message: `Display name must be Bosiano Italian Heritage Perfume`,
          slug,
        });
      }
      for (const url of p.variants.flatMap((v) => v.images)) {
        if (/logo-heritage|crest-gold\.png|jewelry-box-packaging/i.test(url)) {
          issues.push({
            severity: "error",
            code: "perfume-unrelated-gallery",
            message: `Perfume gallery contains unrelated brand art: ${url}`,
            slug,
          });
        }
      }
    }
    if (slug === "bosiano-crest-tee" || slug === "bosiano-crest-poplin-shirt") {
      const otherSlug = slug === "bosiano-crest-tee" ? "bosiano-crest-poplin-shirt" : "bosiano-crest-tee";
      const other = products.find((x) => x.slug === otherSlug);
      if (other && p.cardImage === other.cardImage) {
        issues.push({
          severity: "error",
          code: "tee-poplin-shared-image",
          message: `Shared card image with ${otherSlug}`,
          slug,
        });
      }
    }
  }

  /* Men menu: Trousers (never Pant/Pants/Trouser); no Accessories; Watches reachable */
  const menNav = megaNav.find((n) => n.label === "Men");
  if (menNav?.columns) {
    const menLabels = menNav.columns.flatMap((c) => c.links.map((l) => l.label));
    for (const col of menNav.columns) {
      if (/^accessories$/i.test(col.heading)) {
        issues.push({
          severity: "error",
          code: "men-menu-accessories",
          message: `Men mega-nav still has Accessories column`,
        });
      }
      for (const link of col.links) {
        if (/^accessories$/i.test(link.label)) {
          issues.push({
            severity: "error",
            code: "men-menu-accessories",
            message: `Men mega-nav still links Accessories`,
          });
        }
        if (/^(pant|pants|trouser)$/i.test(link.label)) {
          issues.push({
            severity: "error",
            code: "men-menu-trousers-label",
            message: `Men menu must use "Trousers", not "${link.label}"`,
          });
        }
      }
    }
    if (!menLabels.some((l) => l === "Trousers")) {
      issues.push({
        severity: "error",
        code: "men-menu-trousers-label",
        message: `Men mega-nav missing Trousers link`,
      });
    }
    const trousersHref = menNav.columns
      .flatMap((c) => c.links)
      .find((l) => l.label === "Trousers")?.href;
    if (trousersHref && !/[?&]sub=Trousers\b/.test(trousersHref)) {
      issues.push({
        severity: "error",
        code: "men-menu-trousers-label",
        message: `Trousers link must use sub=Trousers (got ${trousersHref})`,
      });
    }
    const hasWatches = menLabels.some((l) => /watch/i.test(l));
    if (!hasWatches) {
      issues.push({
        severity: "error",
        code: "men-menu-missing-watches",
        message: `Men mega-nav missing Watches link`,
      });
    }
  }

  const pantProduct = products.find((p) => p.slug === "pleated-wide-leg-trouser");
  if (pantProduct) {
    if (pantProduct.subcategory !== "Trousers") {
      issues.push({
        severity: "error",
        code: "men-menu-trousers-label",
        message: `Pleated Wide-Leg Pant subcategory must be Trousers (got ${pantProduct.subcategory})`,
        slug: pantProduct.slug,
      });
    }
    if (!/^Pleated Wide-Leg Pant$/i.test(pantProduct.name)) {
      issues.push({
        severity: "error",
        code: "heading-product-mismatch",
        message: `Product display name must remain Pleated Wide-Leg Pant`,
        slug: pantProduct.slug,
      });
    }
  }

  /* Jewelry shop results must not include the heritage watch */
  if (products.some((p) => p.slug === "bosiano-heritage-watch" && p.category === "jewelry")) {
    issues.push({
      severity: "error",
      code: "watch-in-jewelry",
      message: `Heritage Watch still categorized as jewelry`,
      slug: "bosiano-heritage-watch",
    });
  }

  /* Pixel heuristics for colour integrity (Jet≠red, Cognac≠black) via Pillow when available */
  try {
    const { execFileSync } = require("child_process") as typeof import("child_process");
    const probe = `
from PIL import Image
import json, sys
def avg(path):
    im=Image.open(path).convert('RGB')
    w,h=im.size
    r=g=b=n=0
    for y in range(0,h,max(1,h//48)):
      for x in range(0,w,max(1,w//48)):
        pr,pg,pb=im.getpixel((x,y))
        lum=(pr+pg+pb)/3
        if 20 < lum < 210:
          r+=pr; g+=pg; b+=pb; n+=1
    if n<20: return None
    return [r/n,g/n,b/n]
out={}
pairs=json.loads(sys.argv[1])
for key, rel in pairs.items():
    try:
      out[key]=avg(rel)
    except Exception:
      out[key]=None
print(json.dumps(out))
`;
    const pairs: Record<string, string> = {};
    const jetHero = productImagesByColor["bosiano-crest-knit-sneaker"]?.jet?.[0];
    const cognacBeltHero = productImagesByColor["bosiano-b-leather-belt"]?.cognac?.[0];
    if (jetHero) pairs.jet = path.join(publicDir, jetHero.replace(/^\//, ""));
    if (cognacBeltHero) pairs.cognac = path.join(publicDir, cognacBeltHero.replace(/^\//, ""));
    if (Object.keys(pairs).length) {
      const raw = execFileSync("python", ["-c", probe, JSON.stringify(pairs)], {
        encoding: "utf8",
      });
      const avgs = JSON.parse(raw.trim()) as Record<string, [number, number, number] | null>;
      if (avgs.jet) {
        const [r, g, b] = avgs.jet;
        if (r > g + 18 && r > b + 18) {
          issues.push({
            severity: "error",
            code: "jet-shows-red",
            message: `Jet sneaker hero averages reddish RGB(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)})`,
            slug: "bosiano-crest-knit-sneaker",
          });
        }
      }
      if (avgs.cognac) {
        const [r, g, b] = avgs.cognac;
        const brownish = r > b + 15 && g > b && r > 40;
        const nearBlack = r < 45 && g < 45 && b < 45;
        if (nearBlack || !brownish) {
          issues.push({
            severity: "error",
            code: "cognac-not-brown",
            message: `Cognac belt hero not brown/cognac RGB(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)})`,
            slug: "bosiano-b-leather-belt",
          });
        }
      }
    }
  } catch {
    /* Pillow unavailable — path-level checks in auditProductCatalog still apply */
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warns = issues.filter((i) => i.severity === "warn");

  for (const i of issues) {
    const prefix = i.severity === "error" ? "ERROR" : "WARN ";
    console.log(`${prefix} [${i.code}] ${i.slug ?? "-"} — ${i.message}`);
  }

  console.log(`\nCatalog audit: ${errors.length} error(s), ${warns.length} warning(s), ${allLocal.size} image refs scanned.`);

  if (errors.length) {
    process.exit(1);
  }
}

main();
