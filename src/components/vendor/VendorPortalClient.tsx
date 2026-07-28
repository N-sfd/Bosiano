"use client";

import { useMemo, useState } from "react";
import { brands, getBrand } from "@/lib/brands";
import { brandCatalog, brandInventory, salesReportCsv } from "@/lib/vendor";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import type { VendorOrderLine, VendorProductDraft, VendorReturn } from "@/lib/types";

export function VendorPortalClient({ section }: { section: string }) {
  const hydrated = useHydrated();
  const brandId = useStore((s) => s.vendorBrandId);
  const setBrand = useStore((s) => s.setVendorBrand);

  if (!hydrated) return <p className="text-sm text-ink-muted">Loading vendor portal…</p>;

  const brand = getBrand(brandId) ?? brands[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Designer & vendor</p>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl">{titleFor(section)}</h1>
          <p className="mt-2 text-sm text-ink-muted">Signed in as {brand?.name}</p>
        </div>
        <label className="text-xs text-ink-muted">
          Active brand
          <select
            className="ml-2 rounded border border-line bg-transparent px-2 py-1.5 text-sm text-ink"
            value={brandId}
            onChange={(e) => setBrand(e.target.value)}
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {section === "overview" && <Overview brandId={brandId} />}
      {section === "products" && <Products brandId={brandId} />}
      {section === "inventory" && <Inventory brandId={brandId} />}
      {section === "orders" && <Orders brandId={brandId} />}
      {section === "shipments" && <Shipments brandId={brandId} />}
      {section === "reports" && <Reports brandId={brandId} />}
      {section === "returns" && <Returns brandId={brandId} />}
      {section === "campaigns" && <Campaigns brandId={brandId} />}
      {section === "payments" && <Payments brandId={brandId} />}
      {section === "support" && <Support />}
    </div>
  );
}

function titleFor(section: string) {
  const map: Record<string, string> = {
    overview: "Vendor overview",
    products: "Products",
    inventory: "Inventory",
    orders: "Orders",
    shipments: "Shipments",
    reports: "Sales reports",
    returns: "Returns",
    campaigns: "Campaign content",
    payments: "Payments",
    support: "Marketplace support",
  };
  return map[section] ?? "Vendor portal";
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b border-line bg-canvas-raised/50 text-[0.65rem] uppercase tracking-luxe text-ink-muted">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

function Overview({ brandId }: { brandId: string }) {
  const orders = useStore((s) => s.vendorOrders.filter((o) => o.brandId === brandId));
  const products = useStore((s) => s.vendorProducts.filter((p) => p.brandId === brandId));
  const payments = useStore((s) => s.vendorPayments.filter((p) => p.brandId === brandId));
  const returns = useStore((s) => s.vendorReturns.filter((r) => r.brandId === brandId));
  const catalog = brandCatalog(brandId);
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingPay = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.net, 0);

  const cards = [
    { label: "Catalog SKUs", value: String(catalog.length + products.length) },
    { label: "Order lines", value: String(orders.length) },
    { label: "Gross (demo)", value: formatPrice(revenue) },
    { label: "Pending payout", value: formatPrice(pendingPay) },
    { label: "Open returns", value: String(returns.filter((r) => r.status === "open").length) },
    { label: "Draft / pending products", value: String(products.filter((p) => p.status !== "live").length) },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-line px-4 py-4">
          <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{c.label}</p>
          <p className="mt-2 font-serif text-2xl">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

function Products({ brandId }: { brandId: string }) {
  const drafts = useStore((s) => s.vendorProducts.filter((p) => p.brandId === brandId));
  const add = useStore((s) => s.addVendorProduct);
  const setStatus = useStore((s) => s.setVendorProductStatus);
  const catalog = brandCatalog(brandId);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tailoring");
  const [price, setPrice] = useState(890);
  const [stock, setStock] = useState(10);

  return (
    <div className="space-y-6">
      <form
        className="grid gap-2 rounded-xl border border-line p-4 sm:grid-cols-2 lg:grid-cols-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          add({ name: name.trim(), category, price, stock });
          setName("");
        }}
      >
        <input
          className="rounded border border-line bg-transparent px-3 py-2 text-sm lg:col-span-2"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded border border-line bg-transparent px-3 py-2 text-sm"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          className="rounded border border-line bg-transparent px-3 py-2 text-sm"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          aria-label="Price"
        />
        <input
          type="number"
          className="rounded border border-line bg-transparent px-3 py-2 text-sm"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          aria-label="Stock"
        />
        <button type="submit" className="btn-primary !py-2">
          Add product
        </button>
      </form>

      <Table headers={["Submitted products", "Category", "Price", "Stock", "Status"]}>
        {drafts.map((p) => (
          <tr key={p.id}>
            <td className="px-3 py-3 font-medium">{p.name}</td>
            <td className="px-3 py-3 text-ink-muted">{p.category}</td>
            <td className="px-3 py-3">{formatPrice(p.price)}</td>
            <td className="px-3 py-3">{p.stock}</td>
            <td className="px-3 py-3">
              <StatusSelect
                value={p.status}
                options={["draft", "pending", "live"] as const}
                onChange={(v) => setStatus(p.id, v as VendorProductDraft["status"])}
              />
            </td>
          </tr>
        ))}
      </Table>

      <div>
        <p className="mb-2 text-xs uppercase tracking-luxe text-ink-muted">Live catalog on Bosiano</p>
        <Table headers={["Product", "Price", "Rating"]}>
          {catalog.slice(0, 12).map((p) => (
            <tr key={p.id}>
              <td className="px-3 py-3">{p.name}</td>
              <td className="px-3 py-3">{formatPrice(p.price)}</td>
              <td className="px-3 py-3 text-ink-muted">{p.rating}</td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}

function Inventory({ brandId }: { brandId: string }) {
  const overrides = useStore((s) => s.vendorInventory);
  const setInv = useStore((s) => s.setVendorInventory);
  const drafts = useStore((s) => s.vendorProducts.filter((p) => p.brandId === brandId));
  const rows = useMemo(() => {
    const cat = brandInventory(brandId).map((r) => ({
      ...r,
      stock: overrides[r.id] ?? r.stock,
    }));
    const extra = drafts.map((d) => ({
      id: d.id,
      name: d.name,
      sku: d.id.toUpperCase(),
      stock: overrides[d.id] ?? d.stock,
    }));
    return [...extra, ...cat];
  }, [brandId, overrides, drafts]);

  return (
    <Table headers={["SKU", "Product", "On hand", "Update"]}>
      {rows.map((r) => (
        <tr key={r.id}>
          <td className="px-3 py-3 text-xs text-ink-muted">{r.sku}</td>
          <td className="px-3 py-3 font-medium">{r.name}</td>
          <td className="px-3 py-3">{r.stock}</td>
          <td className="px-3 py-3">
            <input
              type="number"
              min={0}
              className="w-20 rounded border border-line bg-transparent px-2 py-1"
              value={r.stock}
              onChange={(e) => setInv(r.id, Number(e.target.value) || 0)}
            />
          </td>
        </tr>
      ))}
    </Table>
  );
}

function Orders({ brandId }: { brandId: string }) {
  const orders = useStore((s) => s.vendorOrders.filter((o) => o.brandId === brandId));
  return (
    <Table headers={["Order", "Product", "Qty", "Total", "Date", "Shipment"]}>
      {orders.map((o) => (
        <tr key={o.id}>
          <td className="px-3 py-3 font-medium">{o.orderId}</td>
          <td className="px-3 py-3">{o.productName}</td>
          <td className="px-3 py-3">{o.qty}</td>
          <td className="px-3 py-3">{formatPrice(o.total)}</td>
          <td className="px-3 py-3 text-ink-muted">{o.date}</td>
          <td className="px-3 py-3 capitalize text-ink-muted">{o.shipmentStatus}</td>
        </tr>
      ))}
    </Table>
  );
}

function Shipments({ brandId }: { brandId: string }) {
  const orders = useStore((s) => s.vendorOrders.filter((o) => o.brandId === brandId));
  const setStatus = useStore((s) => s.setVendorShipmentStatus);
  return (
    <Table headers={["Order", "Product", "Status"]}>
      {orders.map((o) => (
        <tr key={o.id}>
          <td className="px-3 py-3 font-medium">{o.orderId}</td>
          <td className="px-3 py-3">{o.productName}</td>
          <td className="px-3 py-3">
            <StatusSelect
              value={o.shipmentStatus}
              options={["unfulfilled", "packed", "shipped", "delivered"] as const}
              onChange={(v) => setStatus(o.id, v as VendorOrderLine["shipmentStatus"])}
            />
          </td>
        </tr>
      ))}
    </Table>
  );
}

function Reports({ brandId }: { brandId: string }) {
  const orders = useStore((s) => s.vendorOrders);
  const csv = salesReportCsv(brandId, orders);
  const brandOrders = orders.filter((o) => o.brandId === brandId);
  const total = brandOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line p-4">
        <p className="text-sm text-ink-muted">Period revenue (demo orders)</p>
        <p className="mt-1 font-serif text-3xl">{formatPrice(total)}</p>
        <p className="mt-1 text-xs text-ink-muted">{brandOrders.length} line items</p>
      </div>
      <button
        type="button"
        className="btn-outline !py-2 !px-4"
        onClick={() => {
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `bosiano-sales-${brandId}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Download sales report (CSV)
      </button>
      <pre className="max-h-48 overflow-auto rounded-xl border border-line bg-canvas-raised/40 p-3 text-[0.7rem] text-ink-muted">
        {csv}
      </pre>
    </div>
  );
}

function Returns({ brandId }: { brandId: string }) {
  const returns = useStore((s) => s.vendorReturns.filter((r) => r.brandId === brandId));
  const setStatus = useStore((s) => s.setVendorReturnStatus);
  return (
    <Table headers={["Return", "Order", "Product", "Reason", "Status"]}>
      {returns.map((r) => (
        <tr key={r.id}>
          <td className="px-3 py-3 font-medium">{r.id}</td>
          <td className="px-3 py-3">{r.orderId}</td>
          <td className="px-3 py-3">{r.productName}</td>
          <td className="px-3 py-3 text-ink-muted">{r.reason}</td>
          <td className="px-3 py-3">
            <StatusSelect
              value={r.status}
              options={["open", "approved", "refunded", "denied"] as const}
              onChange={(v) => setStatus(r.id, v as VendorReturn["status"])}
            />
          </td>
        </tr>
      ))}
    </Table>
  );
}

function Campaigns({ brandId }: { brandId: string }) {
  const items = useStore((s) => s.vendorCampaigns.filter((c) => c.brandId === brandId));
  const submit = useStore((s) => s.submitVendorCampaign);
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState("Lookbook");
  const [note, setNote] = useState("");

  return (
    <div className="space-y-4">
      <form
        className="grid gap-2 rounded-xl border border-line p-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          submit(title.trim(), channel, note.trim() || "Asset pack pending");
          setTitle("");
          setNote("");
        }}
      >
        <input
          className="rounded border border-line bg-transparent px-3 py-2 text-sm"
          placeholder="Campaign title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="rounded border border-line bg-transparent px-3 py-2 text-sm"
          placeholder="Channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        />
        <input
          className="rounded border border-line bg-transparent px-3 py-2 text-sm sm:col-span-2"
          placeholder="Assets note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit" className="btn-primary !py-2 sm:col-span-2 sm:w-fit">
          Submit campaign content
        </button>
      </form>
      <Table headers={["Title", "Channel", "Assets", "Status", "Submitted"]}>
        {items.map((c) => (
          <tr key={c.id}>
            <td className="px-3 py-3 font-medium">{c.title}</td>
            <td className="px-3 py-3">{c.channel}</td>
            <td className="px-3 py-3 text-ink-muted">{c.assetsNote}</td>
            <td className="px-3 py-3 capitalize">{c.status}</td>
            <td className="px-3 py-3 text-ink-muted">{c.submittedAt}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function Payments({ brandId }: { brandId: string }) {
  const payments = useStore((s) => s.vendorPayments.filter((p) => p.brandId === brandId));
  return (
    <Table headers={["Period", "Gross", "Fees", "Net", "Status"]}>
      {payments.map((p) => (
        <tr key={p.id}>
          <td className="px-3 py-3 font-medium">{p.period}</td>
          <td className="px-3 py-3">{formatPrice(p.gross)}</td>
          <td className="px-3 py-3 text-ink-muted">{formatPrice(p.fees)}</td>
          <td className="px-3 py-3">{formatPrice(p.net)}</td>
          <td className="px-3 py-3 capitalize">
            {p.status}
            {p.paidAt ? ` · ${p.paidAt}` : ""}
          </td>
        </tr>
      ))}
    </Table>
  );
}

function Support() {
  const messages = useStore((s) => s.vendorSupport);
  const brandId = useStore((s) => s.vendorBrandId);
  const contact = useStore((s) => s.contactVendorSupport);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const mine = messages.filter((m) => m.brandId === brandId);

  return (
    <div className="space-y-4">
      <form
        className="space-y-2 rounded-xl border border-line p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!subject.trim() || !body.trim()) return;
          contact(subject.trim(), body.trim());
          setSubject("");
          setBody("");
        }}
      >
        <input
          className="w-full rounded border border-line bg-transparent px-3 py-2 text-sm"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="min-h-[100px] w-full rounded border border-line bg-transparent px-3 py-2 text-sm"
          placeholder="How can marketplace support help?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" className="btn-primary !py-2 !px-4">
          Contact support
        </button>
      </form>
      {mine.length === 0 ? (
        <p className="text-sm text-ink-muted">No messages yet.</p>
      ) : (
        <ul className="space-y-2">
          {mine.map((m) => (
            <li key={m.id} className="rounded-xl border border-line px-4 py-3">
              <p className="font-medium">{m.subject}</p>
              <p className="mt-1 text-sm text-ink-muted">{m.body}</p>
              <p className="mt-2 text-[0.65rem] uppercase tracking-luxe text-ink-muted">{m.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-line bg-transparent px-2 py-1 text-sm capitalize"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
