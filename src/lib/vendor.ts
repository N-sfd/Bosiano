import { brands } from "./brands";
import { products, totalStock } from "./products";
import { orders } from "./orders";
import type {
  VendorCampaignSubmission,
  VendorOrderLine,
  VendorPayment,
  VendorProductDraft,
  VendorReturn,
} from "./types";

export const VENDOR_SECTIONS = [
  { id: "overview", label: "Overview", href: "/vendor" },
  { id: "products", label: "Products", href: "/vendor/products" },
  { id: "inventory", label: "Inventory", href: "/vendor/inventory" },
  { id: "orders", label: "Orders", href: "/vendor/orders" },
  { id: "shipments", label: "Shipments", href: "/vendor/shipments" },
  { id: "reports", label: "Sales reports", href: "/vendor/reports" },
  { id: "returns", label: "Returns", href: "/vendor/returns" },
  { id: "campaigns", label: "Campaign content", href: "/vendor/campaigns" },
  { id: "payments", label: "Payments", href: "/vendor/payments" },
  { id: "support", label: "Marketplace support", href: "/vendor/support" },
] as const;

export function defaultVendorBrandId() {
  return brands[0]?.id ?? "maison-verane";
}

export function defaultVendorProducts(): VendorProductDraft[] {
  return [
    {
      id: "vp-1",
      brandId: "maison-verane",
      name: "Archive Reissue Jacket",
      category: "Outerwear",
      price: 1480,
      stock: 12,
      status: "live",
      createdAt: Date.now() - 86400000 * 20,
    },
    {
      id: "vp-2",
      brandId: "maison-verane",
      name: "Soft Power Trouser — Black",
      category: "Tailoring",
      price: 620,
      stock: 0,
      status: "pending",
      createdAt: Date.now() - 86400000 * 2,
    },
  ];
}

export function defaultVendorOrders(): VendorOrderLine[] {
  const lines: VendorOrderLine[] = [];
  let i = 0;
  for (const o of orders) {
    for (const item of o.items) {
      const brand = brands.find((b) => b.name === item.brand);
      const brandId = brand?.id ?? "maison-verane";
      lines.push({
        id: `vo-${++i}`,
        brandId,
        orderId: o.id,
        productName: item.name,
        sku: `SKU-${item.name.slice(0, 3).toUpperCase()}-${i}`,
        qty: item.qty,
        total: item.price * item.qty,
        shipmentStatus:
          o.status === "delivered"
            ? "delivered"
            : o.status === "shipped" || o.status === "out-for-delivery"
              ? "shipped"
              : "unfulfilled",
        date: o.date,
      });
    }
  }
  // Ensure Maison Vérane has sample lines
  if (!lines.some((l) => l.brandId === "maison-verane")) {
    lines.push({
      id: "vo-seed-1",
      brandId: "maison-verane",
      orderId: "BSN-48213",
      productName: "Sculpted Wool Blazer",
      sku: "SKU-SWB-1",
      qty: 1,
      total: 1290,
      shipmentStatus: "shipped",
      date: "2026-07-21",
    });
  }
  return lines;
}

export function defaultVendorReturns(): VendorReturn[] {
  return [
    {
      id: "VR-1001",
      brandId: "maison-verane",
      orderId: "BSN-47788",
      productName: "Fluid Silk Slip Dress",
      reason: "Fit — too small",
      status: "open",
      createdAt: "2026-07-20",
    },
    {
      id: "VR-1002",
      brandId: "sanso",
      orderId: "BSN-46520",
      productName: "Minimalist Leather Sneaker",
      reason: "Changed mind",
      status: "refunded",
      createdAt: "2026-07-05",
    },
  ];
}

export function defaultVendorCampaigns(): VendorCampaignSubmission[] {
  return [
    {
      id: "vcs-1",
      brandId: "maison-verane",
      title: "FW26 Soft Tailoring lookbook",
      channel: "Lookbook + email",
      assetsNote: "12 hero stills + 1 short film",
      status: "in-review",
      submittedAt: "2026-07-18",
    },
  ];
}

export function defaultVendorPayments(): VendorPayment[] {
  return brands.slice(0, 4).flatMap((b, i) => [
    {
      id: `pay-${b.id}-1`,
      brandId: b.id,
      period: "Jun 2026",
      gross: 4200 + i * 1100,
      fees: 420 + i * 90,
      net: 3780 + i * 1010,
      status: "paid" as const,
      paidAt: "2026-07-05",
    },
    {
      id: `pay-${b.id}-2`,
      brandId: b.id,
      period: "Jul 2026",
      gross: 3100 + i * 800,
      fees: 310 + i * 70,
      net: 2790 + i * 730,
      status: i === 0 ? ("pending" as const) : ("paid" as const),
      paidAt: i === 0 ? undefined : "2026-07-28",
    },
  ]);
}

export function brandCatalog(brandId: string) {
  return products.filter((p) => p.brandId === brandId);
}

export function brandInventory(brandId: string) {
  return brandCatalog(brandId).map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.barcode,
    stock: totalStock(p),
  }));
}

export function salesReportCsv(brandId: string, orderLines: VendorOrderLine[]) {
  const rows = orderLines.filter((o) => o.brandId === brandId);
  const header = "orderId,date,product,sku,qty,total,shipmentStatus";
  const body = rows
    .map((r) => `${r.orderId},${r.date},"${r.productName}",${r.sku},${r.qty},${r.total},${r.shipmentStatus}`)
    .join("\n");
  return `${header}\n${body}`;
}
