/**
 * Concierge follow-up context + filter tests.
 * Run: npx tsx scripts/test-concierge-context.ts
 */
import {
  aiReply,
  detectMaxPrice,
  detectOrdinal,
  resolveReferent,
  searchCatalog,
  selectConciergeProduct,
  type ConciergeContext,
} from "../src/lib/concierge";

let failed = 0;

function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", msg);
  } else {
    console.log("ok:", msg);
  }
}

function flow(label: string, steps: { q: string; check: (r: ReturnType<typeof aiReply>, ctx: ConciergeContext) => void }[]) {
  console.log(`\n=== ${label} ===`);
  let ctx: ConciergeContext = {};
  for (const step of steps) {
    const r = aiReply(step.q, false, ctx);
    ctx = r.context;
    console.log(`Q: ${step.q}`);
    console.log(`  intent=${r.intent} selected=${ctx.lastSelectedProduct ?? "null"} results=${(ctx.lastResultSet ?? []).length}`);
    console.log(`  A: ${r.text.slice(0, 160)}`);
    step.check(r, ctx);
  }
}

/* —— Unit: price parse —— */
assert(detectMaxPrice("show me a brown handbag under $500") === 500, "detectMaxPrice under $500");
assert(detectMaxPrice("bags below 300") === 300, "detectMaxPrice below 300");
assert(detectMaxPrice("less than $1,200".replace(",", "")) === 1200 || detectMaxPrice("less than $1200") === 1200, "detectMaxPrice less than");

/* —— Unit: ordinal —— */
assert(detectOrdinal("show me the first one", 4) === 0, "ordinal first");
assert(detectOrdinal("the second one", 4) === 1, "ordinal second");
assert(detectOrdinal("the last one", 4) === 3, "ordinal last");

/* —— Unit: catalog AND filters —— */
{
  const hits = searchCatalog({
    categoryLabel: "Bags",
    color: "brown",
    maxPrice: 500,
    productKind: "handbag",
    limit: 10,
  });
  assert(hits.length === 0, "no brown handbag under $500 (wallet excluded)");
  assert(
    hits.every((p) => p.price <= 500),
    "price filter AND"
  );
}

{
  const wallets = searchCatalog({
    categoryLabel: "Wallets",
    color: "brown",
    maxPrice: 500,
    productKind: "wallet",
    limit: 10,
  });
  assert(
    wallets.some((p) => p.slug === "bosiano-crest-zip-wallet"),
    "zip wallet matches brown wallet under $500"
  );
}

/* —— FLOW 1: brown handbag under $500 → this in black asks which —— */
flow("FLOW 1 budget + ambiguous this", [
  {
    q: "show me a brown handbag under $500",
    check: (r, ctx) => {
      assert(r.intent === "product_discovery", "flow1 discovery");
      const isClosestHint = /couldn't find/i.test(r.text);
      if (!isClosestHint) {
        assert(!r.products?.some((p) => p.price > 500), "flow1 no over-budget cards");
      } else {
        assert(Boolean(r.products?.length), "flow1 closest suggestion present");
      }
      assert(ctx.lastSelectedProduct == null || (r.products?.length ?? 0) <= 1, "flow1 no auto-select on multi/closest");
      assert(
        r.text.toLowerCase().includes("couldn't find") || (r.products?.every((p) => p.price <= 500) ?? true),
        "flow1 explains miss or respects budget"
      );
    },
  },
  {
    q: "do you have this in black?",
    check: (r, ctx) => {
      // If closest single product was mentioned, may answer for that one;
      // if multi or no selection with multi history — clarify.
      if ((ctx.lastResultSet?.length ?? 0) > 1 && !ctx.lastSelectedProduct) {
        assert(r.intent === "clarify" || r.text.includes("Which one"), "flow1 clarify which");
      } else {
        // single closest referent — colour check only that product
        assert(
          r.intent === "specific_product" || r.intent === "clarify" || r.intent === "product_discovery",
          "flow1 follow-up handled"
        );
        assert(!(r.products && r.products.length > 1 && r.text.toLowerCase().includes("here are")), "flow1 not all black bags");
      }
    },
  },
]);

/* —— FLOW 1b: multi bags → this in black asks which —— */
flow("FLOW 1b multi then ambiguous this", [
  {
    q: "show bags",
    check: (r, ctx) => {
      assert((ctx.lastResultSet?.length ?? 0) > 1, "flow1b multi");
      assert(ctx.lastSelectedProduct == null, "flow1b no select");
    },
  },
  {
    q: "do you have this in black?",
    check: (r) => {
      assert(r.intent === "clarify", "flow1b clarify intent");
      assert(/Which one do you mean/i.test(r.text), "flow1b which one copy");
      assert((r.products?.length ?? 0) > 1, "flow1b lists options");
    },
  },
]);

flow("FLOW 2 selected zip wallet", [
  {
    q: "show me Bosiano Crest Zip Wallet",
    check: (r, ctx) => {
      assert(r.intent === "specific_product", "flow2 specific");
      assert(ctx.lastSelectedProduct === "bosiano-crest-zip-wallet", "flow2 selected");
      assert(r.products?.length === 1, "flow2 one card");
    },
  },
  {
    q: "do you have this in black?",
    check: (r, ctx) => {
      assert(r.intent === "specific_product", "flow2 colour intent");
      assert(ctx.lastSelectedProduct === "bosiano-crest-zip-wallet", "flow2 still wallet");
      assert(r.products?.length === 1 && r.products[0]?.slug === "bosiano-crest-zip-wallet", "flow2 only wallet");
      assert(/yes|available in black/i.test(r.text), "flow2 yes black");
    },
  },
]);

/* —— FLOW 3: watches → first one → it in black —— */
flow("FLOW 3 ordinal then colour", [
  {
    q: "show me watches",
    check: (r, ctx) => {
      assert(r.intent === "product_discovery", "flow3 discovery");
      assert((ctx.lastResultSet?.length ?? 0) >= 1, "flow3 results");
      assert(ctx.lastSelectedProduct == null || (ctx.lastResultSet?.length ?? 0) === 1, "flow3 no auto-select multi");
    },
  },
  {
    q: "show me the first one",
    check: (r, ctx) => {
      assert(r.intent === "specific_product", "flow3 select first");
      assert(Boolean(ctx.lastSelectedProduct), "flow3 has selection");
    },
  },
  {
    q: "do you have it in black?",
    check: (r, ctx) => {
      assert(r.products?.length === 1, "flow3 single product colour check");
      assert(r.products?.[0]?.slug === ctx.lastSelectedProduct, "flow3 same product");
    },
  },
]);

/* —— FLOW 4: bags → name cognac flap → show it in black —— */
flow("FLOW 4 name then black", [
  {
    q: "show bags",
    check: (r, ctx) => {
      assert((ctx.lastResultSet?.length ?? 0) > 1, "flow4 multi bags");
      assert(ctx.lastSelectedProduct == null, "flow4 no auto select");
    },
  },
  {
    q: "the cognac flap bag",
    check: (r, ctx) => {
      assert(ctx.lastSelectedProduct === "bosiano-cognac-flap-bag", "flow4 selected flap");
      assert(r.products?.length === 1, "flow4 one card");
    },
  },
  {
    q: "show it in black",
    check: (r) => {
      assert(r.products?.length === 1 && r.products[0]?.slug === "bosiano-cognac-flap-bag", "flow4 only flap");
      assert(/noir|black/i.test(r.text), "flow4 mentions black/noir");
    },
  },
]);

/* —— UI select —— */
{
  console.log("\n=== UI product_selected ===");
  let ctx: ConciergeContext = aiReply("show bags", false, {}).context;
  assert(ctx.lastSelectedProduct == null, "ui pre-select null");
  const sel = selectConciergeProduct(ctx, "bosiano-crest-zip-wallet");
  ctx = sel.context;
  assert(ctx.lastSelectedProduct === "bosiano-crest-zip-wallet", "ui selected");
  const follow = aiReply("do you have this in black?", false, ctx);
  assert(follow.products?.length === 1 && follow.products[0]?.slug === "bosiano-crest-zip-wallet", "ui this→wallet only");
}

/* —— Pronoun resolve unit —— */
{
  const ctx: ConciergeContext = {
    lastIntent: "product_discovery",
    lastCategory: "Bags",
    lastResultSet: ["structured-leather-tote", "bosiano-cognac-flap-bag"].map((slug) => {
      // resolve needs ids — use search
      return slug;
    }),
  };
  // Fix ids properly
  const bags = searchCatalog({ categoryLabel: "Bags", productKind: "bag", limit: 4 });
  const ctx2: ConciergeContext = {
    lastIntent: "product_discovery",
    lastCategory: "Bags",
    lastResultSet: bags.map((p) => p.id),
    lastSelectedProduct: null,
  };
  const r = resolveReferent("do you have this in black?", ctx2);
  assert(r.product == null && r.ambiguous.length > 1, "pronoun ambiguous without selection");
  const ctx3 = { ...ctx2, lastSelectedProduct: bags[0]!.slug };
  const r2 = resolveReferent("do you have this in black?", ctx3);
  assert(r2.product?.slug === bags[0]!.slug, "pronoun uses selection");
}

/* —— Product without black —— */
flow("CASE C no black", [
  {
    q: "show me Bosiano Crest Leather Handbag",
    check: (r, ctx) => {
      assert(ctx.lastSelectedProduct === "bosiano-crest-leather-handbag", "caseC selected");
    },
  },
  {
    q: "is it available in black?",
    check: (r) => {
      assert(/isn't available in Black/i.test(r.text), "caseC no black message");
      assert(r.products?.length === 1, "caseC only that bag");
      assert(!/structured leather tote/i.test(r.text), "caseC no other bags");
    },
  },
]);

if (failed) {
  console.error(`\n${failed} assertion(s) failed`);
  process.exit(1);
}
console.log("\nAll concierge context tests passed.");
