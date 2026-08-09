process.env.CATALOG_VALIDATE = "1";
import { writeFileSync } from "fs";
import { products } from "../src/lib/products";
import { productImagesByColor } from "../src/lib/images";

const multi = products.filter((p) => p.variants.length > 1);
const shared = multi.filter((p) => {
  const keys = p.variants.map((v) => v.images.join("|"));
  return new Set(keys).size === 1;
});

const payload = shared.map((p) => ({
  slug: p.slug,
  colors: p.variants.map((v) => ({ color: v.color, hex: v.hex })),
  hero: p.variants[0]?.images[0] ?? "",
}));

writeFileSync("scripts/.tmp-shared-galleries.json", JSON.stringify(payload, null, 2));
console.log(`shared-gallery multi-color SKUs: ${payload.length}`);
payload.forEach((p) => console.log(` - ${p.slug}`));
