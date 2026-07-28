import { brands } from "./brands";
import { products } from "./products";
import { orders } from "./orders";
import type { AnalyticsEvent, MerchCampaign } from "./types";

export type AnalyticsReport = {
  revenue: number;
  conversionRate: number;
  aov: number;
  searchTerms: { term: string; count: number }[];
  zeroResultSearches: { term: string; count: number }[];
  filterUse: { filter: string; count: number }[];
  wishlistActivity: { adds: number; removes: number; net: number };
  cartAbandonment: { rate: number; abandoned: number; recovered: number };
  productViews: { productId: string; name: string; views: number }[];
  repeatPurchases: { rate: number; repeatCustomers: number };
  loyaltyEnrollment: { members: number; rate: number; newThisPeriod: number };
  designerPerformance: {
    brandId: string;
    name: string;
    revenue: number;
    units: number;
    views: number;
  }[];
  returnReasons: { reason: string; count: number }[];
  campaignPerformance: {
    id: string;
    name: string;
    status: string;
    channel: string;
    engagement: number;
    attributedRevenue: number;
  }[];
  customerLifetimeValue: { avg: number; topTier: number; median: number };
};

const SEED_SEARCHES = [
  { term: "wool blazer", count: 184 },
  { term: "silk slip", count: 142 },
  { term: "quiet luxury", count: 98 },
  { term: "linen shirt", count: 76 },
  { term: "leather tote", count: 71 },
];

const SEED_ZERO = [
  { term: "neon track pants", count: 12 },
  { term: "logo hoodie xl", count: 9 },
  { term: "cheap designer", count: 7 },
  { term: "fast fashion dupe", count: 5 },
];

const SEED_FILTERS = [
  { filter: "category:women", count: 920 },
  { filter: "sale=true", count: 410 },
  { filter: "material:linen", count: 188 },
  { filter: "conscious=true", count: 156 },
  { filter: "size:S", count: 134 },
  { filter: "sort:price-asc", count: 98 },
];

const SEED_RETURNS = [
  { reason: "Fit — too small", count: 28 },
  { reason: "Fit — too large", count: 19 },
  { reason: "Changed mind", count: 15 },
  { reason: "Quality concern", count: 8 },
  { reason: "Wrong item", count: 4 },
];

export function seedAnalyticsEvents(): AnalyticsEvent[] {
  const now = Date.now();
  return [
    { id: "ae1", type: "search", label: "wool blazer", at: now - 3600000 },
    { id: "ae2", type: "zero-search", label: "neon track pants", at: now - 7200000 },
    { id: "ae3", type: "filter", label: "sale=true", at: now - 5400000 },
    { id: "ae4", type: "wishlist", label: "add:sculpted-wool-blazer", at: now - 1800000 },
    { id: "ae5", type: "cart-abandon", label: "session-8841", meta: "2 items", at: now - 86400000 },
    { id: "ae6", type: "product-view", label: "sculpted-wool-blazer", at: now - 900000 },
    { id: "ae7", type: "loyalty-join", label: "Gold upgrade", at: now - 172800000 },
    { id: "ae8", type: "return", label: "Fit — too small", at: now - 259200000 },
  ];
}

function countBy(events: AnalyticsEvent[], type: AnalyticsEvent["type"], key: (e: AnalyticsEvent) => string) {
  const map = new Map<string, number>();
  for (const e of events.filter((x) => x.type === type)) {
    const k = key(e);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildAnalyticsReport(input: {
  events: AnalyticsEvent[];
  recentlyViewed: string[];
  wishlistCount: number;
  cartCount: number;
  loyaltyPoints: number;
  campaigns: MerchCampaign[];
  returnReasonsLive: string[];
}): AnalyticsReport {
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const orderCount = orders.length;
  const aov = Math.round(revenue / Math.max(1, orderCount));

  const liveSearches = countBy(input.events, "search", (e) => e.label.toLowerCase());
  const liveZero = countBy(input.events, "zero-search", (e) => e.label.toLowerCase());
  const liveFilters = countBy(input.events, "filter", (e) => e.label);

  const mergeCounts = (
    seed: { term?: string; filter?: string; count: number }[],
    live: { term: string; count: number }[],
    key: "term" | "filter"
  ) => {
    const map = new Map<string, number>();
    for (const s of seed) {
      const k = (s as { term?: string; filter?: string })[key] ?? "";
      map.set(k, s.count);
    }
    for (const l of live) map.set(l.term, (map.get(l.term) ?? 0) + l.count);
    return [...map.entries()]
      .map(([k, count]) => (key === "term" ? { term: k, count } : { filter: k, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  };

  const searchTerms = mergeCounts(SEED_SEARCHES, liveSearches, "term") as { term: string; count: number }[];
  const zeroResultSearches = mergeCounts(SEED_ZERO, liveZero, "term") as { term: string; count: number }[];
  const filterUse = mergeCounts(SEED_FILTERS, liveFilters, "filter") as { filter: string; count: number }[];

  const wishlistAdds = input.events.filter((e) => e.type === "wishlist" && e.label.startsWith("add:")).length;
  const wishlistRemoves = input.events.filter((e) => e.type === "wishlist" && e.label.startsWith("remove:")).length;

  const abandoned = 42 + input.events.filter((e) => e.type === "cart-abandon").length;
  const recovered = 11;
  const cartAbandonRate = Math.round((abandoned / (abandoned + recovered + orderCount)) * 1000) / 10;

  const viewMap = new Map<string, number>();
  for (const id of input.recentlyViewed) viewMap.set(id, (viewMap.get(id) ?? 0) + 3);
  for (const e of input.events.filter((x) => x.type === "product-view")) {
    viewMap.set(e.label, (viewMap.get(e.label) ?? 0) + 1);
  }
  // seed views
  for (const p of products.slice(0, 10)) {
    viewMap.set(p.id, (viewMap.get(p.id) ?? 0) + 40 + (p.reviewCount % 30));
  }
  const productViews = [...viewMap.entries()]
    .map(([productId, views]) => ({
      productId,
      name: products.find((p) => p.id === productId)?.name ?? productId,
      views,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const designerPerformance = brands.map((b) => {
    const brandProducts = products.filter((p) => p.brandId === b.id);
    const brandRevenue = orders.reduce((sum, o) => {
      return (
        sum +
        o.items
          .filter((i) => i.brand === b.name)
          .reduce((s, i) => s + i.price * i.qty, 0)
      );
    }, 0);
    const units = orders.reduce((sum, o) => {
      return sum + o.items.filter((i) => i.brand === b.name).reduce((s, i) => s + i.qty, 0);
    }, 0);
    const views = brandProducts.reduce((s, p) => s + (viewMap.get(p.id) ?? 0), 0);
    return {
      brandId: b.id,
      name: b.name,
      revenue: brandRevenue || Math.round(brandProducts.length * 180 + views * 2),
      units: units || Math.max(1, Math.round(brandProducts.length / 2)),
      views,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const returnMap = new Map(SEED_RETURNS.map((r) => [r.reason, r.count]));
  for (const r of input.returnReasonsLive) {
    returnMap.set(r, (returnMap.get(r) ?? 0) + 1);
  }
  for (const e of input.events.filter((x) => x.type === "return")) {
    returnMap.set(e.label, (returnMap.get(e.label) ?? 0) + 1);
  }
  const returnReasons = [...returnMap.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);

  const campaignPerformance = input.campaigns.map((c, i) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    channel: c.channel,
    engagement: 12 + i * 7 + (c.status === "live" ? 40 : 0),
    attributedRevenue: c.status === "live" ? 2400 + i * 600 : c.status === "ended" ? 1800 : 0,
  }));

  const loyaltyJoins = 3 + input.events.filter((e) => e.type === "loyalty-join").length;

  return {
    revenue,
    conversionRate: 3.4,
    aov,
    searchTerms,
    zeroResultSearches,
    filterUse,
    wishlistActivity: {
      adds: 156 + wishlistAdds,
      removes: 41 + wishlistRemoves,
      net: input.wishlistCount,
    },
    cartAbandonment: {
      rate: cartAbandonRate,
      abandoned,
      recovered,
    },
    productViews,
    repeatPurchases: { rate: 28.5, repeatCustomers: 2 },
    loyaltyEnrollment: {
      members: 12840 + (input.loyaltyPoints > 0 ? 1 : 0),
      rate: 22.4,
      newThisPeriod: loyaltyJoins,
    },
    designerPerformance,
    returnReasons,
    campaignPerformance,
    customerLifetimeValue: {
      avg: 1840,
      median: 920,
      topTier: 12400,
    },
  };
}
