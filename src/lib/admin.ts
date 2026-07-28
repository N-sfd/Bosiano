import { products, totalStock } from "./products";
import { brands } from "./brands";
import { orders } from "./orders";
import { journal } from "./journal";
import { looks } from "./looks";
import { boutiques } from "./stores";
import { stylists } from "./stylists";
import { CLUB_TIERS } from "./club";
import type {
  AdminCategory,
  AdminCustomer,
  AdminNotification,
  AdminPromotion,
  CuratedCollection,
  GiftCardRecord,
  LandingPageDraft,
  MerchCampaign,
  MerchBadgeId,
  RecommendationConfig,
  AdminLookbookEdit,
} from "./types";

export const ADMIN_SECTIONS = [
  { id: "overview", label: "Dashboard", href: "/admin" },
  { id: "analytics", label: "Analytics", href: "/admin/analytics" },
  { id: "merchandising", label: "Merchandising", href: "/admin/merchandising" },
  { id: "products", label: "Products", href: "/admin/products" },
  { id: "categories", label: "Categories", href: "/admin/categories" },
  { id: "designers", label: "Designers", href: "/admin/designers" },
  { id: "inventory", label: "Inventory", href: "/admin/inventory" },
  { id: "orders", label: "Orders", href: "/admin/orders" },
  { id: "customers", label: "Customers", href: "/admin/customers" },
  { id: "returns", label: "Returns", href: "/admin/returns" },
  { id: "promotions", label: "Promotions", href: "/admin/promotions" },
  { id: "loyalty", label: "Loyalty", href: "/admin/loyalty" },
  { id: "gift-cards", label: "Gift cards", href: "/admin/gift-cards" },
  { id: "editorial", label: "Editorial", href: "/admin/editorial" },
  { id: "lookbooks", label: "Lookbooks", href: "/admin/lookbooks" },
  { id: "campaigns", label: "Campaigns", href: "/admin/campaigns" },
  { id: "reviews", label: "Reviews", href: "/admin/reviews" },
  { id: "notifications", label: "Notifications", href: "/admin/notifications" },
  { id: "stores", label: "Store locations", href: "/admin/stores" },
  { id: "appointments", label: "Appointments", href: "/admin/appointments" },
  { id: "stylists", label: "Stylists", href: "/admin/stylists" },
  { id: "support", label: "Support tickets", href: "/admin/support" },
] as const;

export type AdminSectionId = (typeof ADMIN_SECTIONS)[number]["id"];

export const MERCH_BADGE_OPTIONS: { id: MerchBadgeId; label: string }[] = [
  { id: "sale", label: "Sale" },
  { id: "new", label: "New" },
  { id: "exclusive", label: "Exclusive" },
  { id: "conscious", label: "Conscious" },
  { id: "limited", label: "Limited" },
  { id: "trending", label: "Trending" },
  { id: "editors-pick", label: "Editor's Pick" },
];

export function defaultCategories(): AdminCategory[] {
  const map = new Map<string, number>();
  for (const p of products) {
    const key = `${p.category}|${p.subcategory}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()].map(([key, count], i) => {
    const [parent, name] = key.split("|");
    return {
      id: `cat-${i}`,
      name,
      parent,
      productCount: count,
      visible: true,
    };
  });
}

export function defaultCustomers(): AdminCustomer[] {
  return [
    {
      id: "cust-1",
      name: "Amelia Rousseau",
      email: "amelia@example.com",
      tier: "Gold",
      orders: 12,
      spend: 8420,
      joined: "2024-03-12",
      location: "London",
    },
    {
      id: "cust-2",
      name: "James Keats",
      email: "james.k@example.com",
      tier: "Member",
      orders: 4,
      spend: 1680,
      joined: "2025-11-02",
      location: "New York",
    },
    {
      id: "cust-3",
      name: "Sofia Moretti",
      email: "sofia.m@example.com",
      tier: "Private Client",
      orders: 28,
      spend: 21450,
      joined: "2023-06-18",
      location: "Milan",
    },
    {
      id: "cust-4",
      name: "Priya Nair",
      email: "priya.n@example.com",
      tier: "Gold",
      orders: 9,
      spend: 5120,
      joined: "2024-09-01",
      location: "Paris",
    },
    {
      id: "cust-5",
      name: "Noah Chen",
      email: "noah.c@example.com",
      tier: "Member",
      orders: 2,
      spend: 890,
      joined: "2026-05-20",
      location: "Singapore",
    },
  ];
}

export function defaultPromotions(): AdminPromotion[] {
  return [
    {
      id: "promo-1",
      code: "AUTUMN10",
      label: "Autumn sitewide 10%",
      type: "percent",
      value: 10,
      active: true,
      regions: [],
      minSpend: 250,
      endsAt: "2026-09-30",
    },
    {
      id: "promo-2",
      code: "NYCSHIP",
      label: "Free express — NYC metro",
      type: "shipping",
      value: 0,
      active: true,
      regions: ["US-NY", "New York"],
      endsAt: "2026-08-31",
    },
    {
      id: "promo-3",
      code: "LDN50",
      label: "£50 off London boutique pickup",
      type: "fixed",
      value: 50,
      active: false,
      regions: ["GB-LDN", "London"],
      minSpend: 400,
    },
  ];
}

export function defaultCampaigns(): MerchCampaign[] {
  return [
    {
      id: "camp-1",
      name: "Soft Tailoring Launch",
      channel: "email",
      status: "live",
      startsAt: "2026-07-20",
      endsAt: "2026-08-10",
      productIds: ["sculpted-wool-blazer", "pleated-wide-leg-trouser"],
      note: "Maison Vérane FW26",
    },
    {
      id: "camp-2",
      name: "Private Client Preview",
      channel: "push",
      status: "scheduled",
      startsAt: "2026-08-05",
      endsAt: "2026-08-12",
      productIds: [],
      note: "Early access drop",
    },
    {
      id: "camp-3",
      name: "Instagram Shop the Look",
      channel: "social",
      status: "draft",
      startsAt: "2026-08-15",
      endsAt: "2026-08-30",
      productIds: ["fluid-silk-slip-dress"],
    },
  ];
}

export function defaultCollections(): CuratedCollection[] {
  return [
    {
      id: "col-1",
      title: "The Soft Power Edit",
      slug: "soft-power-edit",
      description: "Tailoring that moves — blazers, fluid trousers, quiet jewellery.",
      productIds: ["sculpted-wool-blazer", "pleated-wide-leg-trouser", "signet-vermeil-ring"],
      published: true,
      createdAt: Date.now() - 86400000 * 12,
    },
    {
      id: "col-2",
      title: "Riviera Weekends",
      slug: "riviera-weekends",
      description: "Linen, silk, and easy sandals for warm escapes.",
      productIds: products.filter((p) => p.tags.some((t) => /linen|resort|vacation/i.test(t))).slice(0, 4).map((p) => p.id),
      published: false,
      createdAt: Date.now() - 86400000 * 3,
    },
  ];
}

export function defaultLandingPages(): LandingPageDraft[] {
  return [
    {
      id: "lp-1",
      title: "Autumn Arrivals",
      slug: "autumn-arrivals",
      headline: "The season begins in soft structure",
      cta: "Shop the edit",
      collectionId: "col-1",
      published: true,
    },
    {
      id: "lp-2",
      title: "Private Client Early Access",
      slug: "private-early-access",
      headline: "Preview before the world",
      cta: "Enter the salon",
      published: false,
    },
  ];
}

export function defaultRecommendationConfig(): RecommendationConfig {
  return {
    similarWeight: 40,
    trendingWeight: 25,
    personalizedWeight: 35,
    excludeOutOfStock: true,
  };
}

export function defaultGiftCards(): GiftCardRecord[] {
  return [
    {
      id: "gc-1",
      code: "GIFT-BOS-8841",
      balance: 250,
      status: "active",
      issuedTo: "Wedding registry — Sofia M.",
      createdAt: "2026-06-12",
    },
    {
      id: "gc-2",
      code: "GIFT-BOS-2209",
      balance: 0,
      status: "redeemed",
      issuedTo: "Corporate gift — Atelier Nordé",
      createdAt: "2026-05-01",
    },
    {
      id: "gc-3",
      code: "GIFT-BOS-5510",
      balance: 100,
      status: "active",
      issuedTo: "Loyalty apology credit",
      createdAt: "2026-07-18",
    },
  ];
}

export function defaultNotifications(): AdminNotification[] {
  return [
    {
      id: "n-1",
      title: "Back in stock — Sculpted Wool Blazer",
      channel: "email",
      audience: "Waitlist · 184",
      status: "sent",
      scheduledAt: "2026-07-22",
    },
    {
      id: "n-2",
      title: "Live shopping tonight",
      channel: "push",
      audience: "App installs · EU",
      status: "scheduled",
      scheduledAt: "2026-07-29T18:00",
    },
    {
      id: "n-3",
      title: "Private Client trunk show",
      channel: "sms",
      audience: "Private Client tier",
      status: "draft",
    },
  ];
}

export function defaultLookbookEdits(): AdminLookbookEdit[] {
  return looks.map((l) => ({
    id: l.id,
    title: l.title,
    source: l.sourceLabel,
    productCount: l.hotspots.length,
    published: !!l.featured || true,
    shoppable: l.hotspots.length > 0,
  }));
}

export function defaultPinnedIds(): string[] {
  return products.filter((p) => p.isExclusive || p.isNew).slice(0, 3).map((p) => p.id);
}

export function defaultRestockDates(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of products) {
    if (totalStock(p) === 0) out[p.id] = "Aug 18, 2026";
  }
  return out;
}

export function defaultLowStockThresholds(): Record<string, number> {
  return { __global: 5 };
}

export function analyticsSnapshot() {
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const units = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0);
  const lowStock = products.filter((p) => {
    const stock = totalStock(p);
    return stock > 0 && stock <= 5;
  }).length;
  const outOfStock = products.filter((p) => totalStock(p) === 0).length;

  return {
    revenue,
    orders: orders.length,
    units,
    aov: Math.round(revenue / Math.max(1, orders.length)),
    products: products.length,
    designers: brands.length,
    journal: journal.length,
    lookbooks: looks.length,
    boutiques: boutiques.length,
    stylists: stylists.length,
    lowStock,
    outOfStock,
    clubTiers: CLUB_TIERS.length,
    conversion: 3.4,
    returnRate: 8.2,
    nps: 72,
  };
}

export function inventoryRows(threshold = 5) {
  return products.map((p) => {
    const stock = totalStock(p);
    return {
      id: p.id,
      name: p.name,
      brandId: p.brandId,
      sku: p.barcode,
      stock,
      status: stock === 0 ? "out" : stock <= threshold ? "low" : "ok",
    };
  });
}
