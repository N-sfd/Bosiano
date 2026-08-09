/**
 * Dev catalog gallery audit — prints per-product colour / image coverage.
 *
 * Run: npm run audit:catalog
 */
import { products } from "../src/lib/products";
import { productImagesByColor } from "../src/lib/images";

function main() {
  const multi = products.filter((p) => p.colors.length > 1);
  let flags = 0;

  console.log("=== Catalog gallery audit ===\n");

  for (const p of products) {
    const map = p.imagesByColor;
    const lines: string[] = [];
    lines.push(`${p.name}`);
    lines.push(`  slug: ${p.slug}`);
    lines.push(`  productType: ${p.productType}  styleId: ${p.styleId}`);
    lines.push(`  defaultColor: ${p.defaultColor}`);
    lines.push(`  colors: ${p.colors.map((c) => c.id).join(", ")}`);

    if (p.colors.length > 1 && (!map || !Object.keys(map).length)) {
      lines.push(`  FLAG: colors > 1 but imagesByColor missing`);
      flags++;
    }

    for (const c of p.colors) {
      const frames = map?.[c.id] ?? [];
      const hero = frames[0]?.src ?? "(none)";
      lines.push(`  ${c.id}: ${frames.length} images · hero ${hero}`);
      if (p.colors.length > 1 && !frames.length) {
        lines.push(`    FLAG: missing imagesByColor["${c.id}"]`);
        flags++;
      }
    }

    console.log(lines.join("\n"));
    console.log("");
  }

  console.log(`=== Summary ===`);
  console.log(`Products: ${products.length}`);
  console.log(`Multi-colour: ${multi.length}`);
  console.log(`With imagesByColor: ${multi.filter((p) => p.imagesByColor && Object.keys(p.imagesByColor).length).length}`);
  console.log(`Module maps: ${Object.keys(productImagesByColor).length}`);
  console.log(`Flags: ${flags}`);
  if (flags) process.exit(1);
}

main();
