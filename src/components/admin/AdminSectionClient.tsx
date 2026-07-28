"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { products, totalStock } from "@/lib/products";
import { brands } from "@/lib/brands";
import { journal } from "@/lib/journal";
import { boutiques } from "@/lib/stores";
import { stylists } from "@/lib/stylists";
import { getReviews } from "@/lib/reviews";
import { MERCH_BADGE_OPTIONS, defaultCustomers } from "@/lib/admin";
import { CLUB_TIERS } from "@/lib/club";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import type { MerchBadgeId, Order } from "@/lib/types";

export function AdminSectionClient({ section }: { section: string }) {
  const hydrated = useHydrated();
  if (!hydrated) {
    return <p className="text-sm text-ink-muted">Loading admin…</p>;
  }

  switch (section) {
    case "products":
      return <ProductsAdmin />;
    case "categories":
      return <CategoriesAdmin />;
    case "designers":
      return <DesignersAdmin />;
    case "inventory":
      return <InventoryAdmin />;
    case "orders":
      return <OrdersAdmin />;
    case "customers":
      return <CustomersAdmin />;
    case "returns":
      return <ReturnsAdmin />;
    case "promotions":
      return <PromotionsAdmin />;
    case "loyalty":
      return <LoyaltyAdmin />;
    case "gift-cards":
      return <GiftCardsAdmin />;
    case "editorial":
      return <EditorialAdmin />;
    case "lookbooks":
      return <LookbooksAdmin />;
    case "campaigns":
      return <CampaignsAdmin />;
    case "reviews":
      return <ReviewsAdmin />;
    case "notifications":
      return <NotificationsAdmin />;
    case "stores":
      return <StoresAdmin />;
    case "appointments":
      return <AppointmentsAdmin />;
    case "stylists":
      return <StylistsAdmin />;
    case "support":
      return <SupportAdmin />;
    default:
      return (
        <div>
          <h1 className="font-serif text-3xl">Unknown section</h1>
          <Link href="/admin" className="mt-4 inline-block text-sm text-gold">
            Back to dashboard
          </Link>
        </div>
      );
  }
}

function SectionShell({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm text-ink-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">
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

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-luxe ${
        on ? "bg-ink text-canvas" : "border border-line text-ink-muted"
      }`}
    >
      {label}
    </button>
  );
}

function ProductsAdmin() {
  const [q, setQ] = useState("");
  const pinned = useStore((s) => s.pinnedProductIds);
  const badges = useStore((s) => s.productBadges);
  const togglePin = useStore((s) => s.togglePinProduct);
  const setProductBadges = useStore((s) => s.setProductBadges);

  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return products
      .filter((p) => !qq || p.name.toLowerCase().includes(qq) || p.id.includes(qq))
      .slice(0, 40);
  }, [q]);

  return (
    <SectionShell
      title="Products"
      description="Pin for shop priority, assign merchandising badges, jump to inventory & merchandising."
      action={
        <Link href="/admin/merchandising" className="btn-outline !py-2 !px-4 text-[0.65rem]">
          Merchandising tools
        </Link>
      }
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products…"
        className="w-full max-w-md rounded-lg border border-line bg-transparent px-3 py-2 text-sm"
      />
      <Table headers={["Product", "Price", "Stock", "Pinned", "Badges"]}>
        {list.map((p) => {
          const stock = totalStock(p);
          const custom = badges[p.id] ?? [];
          return (
            <tr key={p.id} className="align-top">
              <td className="px-3 py-3">
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-ink-muted">{p.id}</p>
              </td>
              <td className="px-3 py-3">{formatPrice(p.price)}</td>
              <td className="px-3 py-3">{stock}</td>
              <td className="px-3 py-3">
                <Toggle on={pinned.includes(p.id)} onClick={() => togglePin(p.id)} label={pinned.includes(p.id) ? "Pinned" : "Pin"} />
              </td>
              <td className="px-3 py-3">
                <div className="flex max-w-xs flex-wrap gap-1">
                  {MERCH_BADGE_OPTIONS.map((b) => {
                    const on = custom.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        className={`rounded px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wider ${
                          on ? "bg-gold/20 text-ink" : "text-ink-muted hover:bg-canvas-raised"
                        }`}
                        onClick={() => {
                          const next = on ? custom.filter((x) => x !== b.id) : [...custom, b.id].slice(0, 3);
                          setProductBadges(p.id, next as MerchBadgeId[]);
                        }}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </td>
            </tr>
          );
        })}
      </Table>
    </SectionShell>
  );
}

function CategoriesAdmin() {
  const cats = useStore((s) => s.adminCategories);
  const toggle = useStore((s) => s.toggleCategoryVisible);
  return (
    <SectionShell title="Categories" description="Show or hide category facets across shop navigation.">
      <Table headers={["Category", "Parent", "Products", "Visible"]}>
        {cats.map((c) => (
          <tr key={c.id}>
            <td className="px-3 py-3">{c.name}</td>
            <td className="px-3 py-3 capitalize text-ink-muted">{c.parent}</td>
            <td className="px-3 py-3">{c.productCount}</td>
            <td className="px-3 py-3">
              <Toggle on={c.visible} onClick={() => toggle(c.id)} label={c.visible ? "Visible" : "Hidden"} />
            </td>
          </tr>
        ))}
      </Table>
    </SectionShell>
  );
}

function DesignersAdmin() {
  const published = useStore((s) => s.designerPublished);
  const setPublished = useStore((s) => s.setDesignerPublished);
  return (
    <SectionShell title="Designers" description="Publish designer storefronts and feature status.">
      <Table headers={["Designer", "Origin", "Collections", "Storefront"]}>
        {brands.map((b) => {
          const on = published[b.id] !== false;
          return (
            <tr key={b.id}>
              <td className="px-3 py-3">
                <p className="font-medium">{b.name}</p>
                <p className="text-xs text-ink-muted">{b.tagline}</p>
              </td>
              <td className="px-3 py-3 text-ink-muted">{b.origin}</td>
              <td className="px-3 py-3">{b.collections?.length ?? 0}</td>
              <td className="px-3 py-3">
                <Toggle on={on} onClick={() => setPublished(b.id, !on)} label={on ? "Published" : "Draft"} />
              </td>
            </tr>
          );
        })}
      </Table>
    </SectionShell>
  );
}

function InventoryAdmin() {
  const thresholds = useStore((s) => s.lowStockThresholds);
  const restocks = useStore((s) => s.restockDates);
  const setThreshold = useStore((s) => s.setLowStockThreshold);
  const setRestock = useStore((s) => s.setRestockDate);
  const global = thresholds.__global ?? 5;

  const rows = useMemo(() => {
    return products
      .map((p) => {
        const stock = totalStock(p);
        const th = thresholds[p.id] ?? global;
        return { p, stock, th, status: stock === 0 ? "out" : stock <= th ? "low" : "ok" };
      })
      .filter((r) => r.status !== "ok")
      .concat(
        products
          .map((p) => {
            const stock = totalStock(p);
            const th = thresholds[p.id] ?? global;
            return { p, stock, th, status: stock === 0 ? "out" : stock <= th ? "low" : "ok" };
          })
          .filter((r) => r.status === "ok")
          .slice(0, 15)
      );
  }, [thresholds, global]);

  return (
    <SectionShell
      title="Inventory"
      description="Low-stock thresholds and restock dates power storefront sold-out messaging."
      action={
        <label className="flex items-center gap-2 text-xs text-ink-muted">
          Global threshold
          <input
            type="number"
            min={1}
            max={50}
            value={global}
            onChange={(e) => setThreshold("__global", Number(e.target.value) || 5)}
            className="w-16 rounded border border-line bg-transparent px-2 py-1"
          />
        </label>
      }
    >
      <Table headers={["SKU", "Stock", "Threshold", "Status", "Restock date"]}>
        {rows.map(({ p, stock, th, status }) => (
          <tr key={p.id}>
            <td className="px-3 py-3">
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-ink-muted">{p.barcode}</p>
            </td>
            <td className="px-3 py-3">{stock}</td>
            <td className="px-3 py-3">
              <input
                type="number"
                min={1}
                className="w-16 rounded border border-line bg-transparent px-2 py-1"
                value={th}
                onChange={(e) => setThreshold(p.id, Number(e.target.value) || global)}
              />
            </td>
            <td className="px-3 py-3">
              <span
                className={`rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-luxe ${
                  status === "out"
                    ? "bg-ink text-canvas"
                    : status === "low"
                      ? "bg-gold/25 text-ink"
                      : "text-ink-muted"
                }`}
              >
                {status}
              </span>
            </td>
            <td className="px-3 py-3">
              <input
                type="text"
                placeholder="e.g. Aug 18"
                value={restocks[p.id] ?? ""}
                onChange={(e) => setRestock(p.id, e.target.value)}
                className="w-28 rounded border border-line bg-transparent px-2 py-1 text-sm"
              />
            </td>
          </tr>
        ))}
      </Table>
    </SectionShell>
  );
}

function OrdersAdmin() {
  const orders = useStore((s) => s.adminOrders);
  const setStatus = useStore((s) => s.setOrderStatus);
  const statuses: Order["status"][] = ["processing", "shipped", "out-for-delivery", "delivered"];

  return (
    <SectionShell title="Orders" description="Update fulfillment status for demo orders.">
      <Table headers={["Order", "Date", "Total", "Items", "Status"]}>
        {orders.map((o) => (
          <tr key={o.id}>
            <td className="px-3 py-3 font-medium">{o.id}</td>
            <td className="px-3 py-3 text-ink-muted">{o.date}</td>
            <td className="px-3 py-3">{formatPrice(o.total)}</td>
            <td className="px-3 py-3 text-ink-muted">{o.items.length}</td>
            <td className="px-3 py-3">
              <select
                value={o.status}
                onChange={(e) => setStatus(o.id, e.target.value as Order["status"])}
                className="rounded border border-line bg-transparent px-2 py-1 text-sm"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </Table>
    </SectionShell>
  );
}

function CustomersAdmin() {
  const customers = defaultCustomers();
  return (
    <SectionShell title="Customers" description="CRM snapshot of club members and spend.">
      <Table headers={["Client", "Tier", "Orders", "Spend", "Location", "Joined"]}>
        {customers.map((c) => (
          <tr key={c.id}>
            <td className="px-3 py-3">
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-ink-muted">{c.email}</p>
            </td>
            <td className="px-3 py-3">{c.tier}</td>
            <td className="px-3 py-3">{c.orders}</td>
            <td className="px-3 py-3">{formatPrice(c.spend)}</td>
            <td className="px-3 py-3 text-ink-muted">{c.location}</td>
            <td className="px-3 py-3 text-ink-muted">{c.joined}</td>
          </tr>
        ))}
      </Table>
    </SectionShell>
  );
}

function ReturnsAdmin() {
  const returns = useStore((s) => s.returns);
  return (
    <SectionShell title="Returns" description="Client return requests from the account portal.">
      {returns.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm text-ink-muted">
          No returns yet. Submit one from Account → Returns to see it here.
        </p>
      ) : (
        <Table headers={["Return", "Order", "Resolution", "Status", "Created"]}>
          {returns.map((r) => (
            <tr key={r.id}>
              <td className="px-3 py-3 font-medium">{r.id}</td>
              <td className="px-3 py-3">{r.orderId}</td>
              <td className="px-3 py-3 capitalize">{r.resolution}</td>
              <td className="px-3 py-3">{r.status}</td>
              <td className="px-3 py-3 text-ink-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </Table>
      )}
    </SectionShell>
  );
}

function PromotionsAdmin() {
  const promos = useStore((s) => s.promotions);
  const toggle = useStore((s) => s.togglePromotion);
  const upsert = useStore((s) => s.upsertPromotion);
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [regions, setRegions] = useState("");
  const [value, setValue] = useState(10);

  return (
    <SectionShell
      title="Promotions"
      description="Sitewide and geographic promotions (region-scoped codes)."
    >
      <form
        className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-2 lg:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!code.trim() || !label.trim()) return;
          upsert({
            code: code.trim().toUpperCase(),
            label: label.trim(),
            type: "percent",
            value,
            active: true,
            regions: regions
              .split(",")
              .map((r) => r.trim())
              .filter(Boolean),
          });
          setCode("");
          setLabel("");
          setRegions("");
        }}
      >
        <input
          className="rounded border border-line bg-transparent px-3 py-2 text-sm"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          className="rounded border border-line bg-transparent px-3 py-2 text-sm"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className="rounded border border-line bg-transparent px-3 py-2 text-sm"
          placeholder="Regions (NYC, London…)"
          value={regions}
          onChange={(e) => setRegions(e.target.value)}
        />
        <input
          type="number"
          className="rounded border border-line bg-transparent px-3 py-2 text-sm"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <button type="submit" className="btn-primary !py-2">
          Create geo promo
        </button>
      </form>
      <Table headers={["Code", "Label", "Value", "Regions", "Active"]}>
        {promos.map((p) => (
          <tr key={p.id}>
            <td className="px-3 py-3 font-medium">{p.code}</td>
            <td className="px-3 py-3">{p.label}</td>
            <td className="px-3 py-3">
              {p.type === "percent" ? `${p.value}%` : p.type === "fixed" ? formatPrice(p.value) : "Free ship"}
            </td>
            <td className="px-3 py-3 text-ink-muted">{p.regions.length ? p.regions.join(", ") : "Global"}</td>
            <td className="px-3 py-3">
              <Toggle on={p.active} onClick={() => toggle(p.id)} label={p.active ? "Active" : "Off"} />
            </td>
          </tr>
        ))}
      </Table>
    </SectionShell>
  );
}

function LoyaltyAdmin() {
  const mult = useStore((s) => s.loyaltyMultiplierOverride);
  const setMult = useStore((s) => s.setLoyaltyMultiplier);
  return (
    <SectionShell title="Loyalty" description="Bosiano Club tiers and global points multiplier.">
      <div className="rounded-xl border border-line p-4">
        <label className="flex flex-wrap items-center gap-3 text-sm">
          Global points multiplier
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={mult}
            onChange={(e) => setMult(Number(e.target.value))}
            className="w-40"
          />
          <span className="font-medium">{mult.toFixed(1)}×</span>
        </label>
      </div>
      <Table headers={["Tier", "Min points", "Multiplier", "Perks"]}>
        {CLUB_TIERS.map((t) => (
          <tr key={t.id}>
            <td className="px-3 py-3 font-medium">{t.name}</td>
            <td className="px-3 py-3">{t.minPoints}</td>
            <td className="px-3 py-3">{(t.multiplier * mult).toFixed(1)}×</td>
            <td className="px-3 py-3 text-xs text-ink-muted">{t.perks.slice(0, 2).join(" · ")}</td>
          </tr>
        ))}
      </Table>
    </SectionShell>
  );
}

function GiftCardsAdmin() {
  const cards = useStore((s) => s.giftCardsAdmin);
  const issue = useStore((s) => s.issueGiftCard);
  const [to, setTo] = useState("");
  const [bal, setBal] = useState(100);

  return (
    <SectionShell title="Gift cards" description="Issue and track digital gift card balances.">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!to.trim()) return;
          issue(to.trim(), bal);
          setTo("");
        }}
      >
        <input
          className="min-w-[200px] flex-1 rounded border border-line bg-transparent px-3 py-2 text-sm"
          placeholder="Issued to…"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          type="number"
          className="w-28 rounded border border-line bg-transparent px-3 py-2 text-sm"
          value={bal}
          onChange={(e) => setBal(Number(e.target.value))}
        />
        <button type="submit" className="btn-primary !py-2 !px-4">
          Issue card
        </button>
      </form>
      <Table headers={["Code", "Balance", "Status", "Issued to", "Date"]}>
        {cards.map((c) => (
          <tr key={c.id}>
            <td className="px-3 py-3 font-medium">{c.code}</td>
            <td className="px-3 py-3">{formatPrice(c.balance)}</td>
            <td className="px-3 py-3 capitalize">{c.status}</td>
            <td className="px-3 py-3 text-ink-muted">{c.issuedTo}</td>
            <td className="px-3 py-3 text-ink-muted">{c.createdAt}</td>
          </tr>
        ))}
      </Table>
    </SectionShell>
  );
}

function EditorialAdmin() {
  const published = useStore((s) => s.editorialPublished);
  const setPublished = useStore((s) => s.setEditorialPublished);
  return (
    <SectionShell title="Editorial content" description="Publish Journal stories and shoppable product tags.">
      <Table headers={["Story", "Category", "Products", "Status"]}>
        {journal.map((a) => {
          const on = published[a.slug] !== false;
          return (
            <tr key={a.slug}>
              <td className="px-3 py-3">
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-ink-muted">{a.date}</p>
              </td>
              <td className="px-3 py-3 text-ink-muted">{a.category}</td>
              <td className="px-3 py-3">{a.productIds.length}</td>
              <td className="px-3 py-3">
                <Toggle on={on} onClick={() => setPublished(a.slug, !on)} label={on ? "Live" : "Draft"} />
              </td>
            </tr>
          );
        })}
      </Table>
    </SectionShell>
  );
}

function LookbooksAdmin() {
  const looks = useStore((s) => s.adminLookbooks);
  const setShoppable = useStore((s) => s.setLookbookShoppable);
  const setPublished = useStore((s) => s.setLookbookPublished);
  return (
    <SectionShell title="Lookbooks" description="Manage shoppable lookbooks and hotspot coverage.">
      <Table headers={["Look", "Source", "Products", "Shoppable", "Published"]}>
        {looks.map((l) => (
          <tr key={l.id}>
            <td className="px-3 py-3 font-medium">{l.title}</td>
            <td className="px-3 py-3 text-ink-muted">{l.source}</td>
            <td className="px-3 py-3">{l.productCount}</td>
            <td className="px-3 py-3">
              <Toggle on={l.shoppable} onClick={() => setShoppable(l.id, !l.shoppable)} label={l.shoppable ? "Yes" : "No"} />
            </td>
            <td className="px-3 py-3">
              <Toggle on={l.published} onClick={() => setPublished(l.id, !l.published)} label={l.published ? "Live" : "Draft"} />
            </td>
          </tr>
        ))}
      </Table>
    </SectionShell>
  );
}

function CampaignsAdmin() {
  const campaigns = useStore((s) => s.campaigns);
  const setStatus = useStore((s) => s.setCampaignStatus);
  const schedule = useStore((s) => s.scheduleCampaign);
  const [name, setName] = useState("");
  const [starts, setStarts] = useState("2026-08-01");
  const [ends, setEnds] = useState("2026-08-15");

  return (
    <SectionShell title="Campaigns" description="Schedule email, site, push, and social campaigns.">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          schedule({
            name: name.trim(),
            channel: "email",
            startsAt: starts,
            endsAt: ends,
            productIds: [],
            status: "scheduled",
          });
          setName("");
        }}
      >
        <input
          className="min-w-[180px] flex-1 rounded border border-line bg-transparent px-3 py-2 text-sm"
          placeholder="Campaign name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input type="date" className="rounded border border-line bg-transparent px-3 py-2 text-sm" value={starts} onChange={(e) => setStarts(e.target.value)} />
        <input type="date" className="rounded border border-line bg-transparent px-3 py-2 text-sm" value={ends} onChange={(e) => setEnds(e.target.value)} />
        <button type="submit" className="btn-primary !py-2 !px-4">
          Schedule
        </button>
      </form>
      <Table headers={["Campaign", "Channel", "Window", "Status"]}>
        {campaigns.map((c) => (
          <tr key={c.id}>
            <td className="px-3 py-3">
              <p className="font-medium">{c.name}</p>
              {c.note && <p className="text-xs text-ink-muted">{c.note}</p>}
            </td>
            <td className="px-3 py-3 capitalize">{c.channel}</td>
            <td className="px-3 py-3 text-ink-muted">
              {c.startsAt} → {c.endsAt}
            </td>
            <td className="px-3 py-3">
              <select
                value={c.status}
                onChange={(e) => setStatus(c.id, e.target.value as typeof c.status)}
                className="rounded border border-line bg-transparent px-2 py-1 text-sm"
              >
                {(["draft", "scheduled", "live", "ended"] as const).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </Table>
    </SectionShell>
  );
}

function ReviewsAdmin() {
  const moderation = useStore((s) => s.reviewModeration);
  const setMod = useStore((s) => s.setReviewModeration);
  const sample = useMemo(() => {
    return products.slice(0, 6).flatMap((p) => getReviews(p).slice(0, 2));
  }, []);

  return (
    <SectionShell title="Reviews" description="Moderate product reviews before they surface on PDPs.">
      <Table headers={["Review", "Product", "Rating", "Moderation"]}>
        {sample.map((r) => {
          const status = moderation[r.id] ?? "approved";
          return (
            <tr key={r.id}>
              <td className="px-3 py-3">
                <p className="font-medium">{r.title}</p>
                <p className="line-clamp-1 text-xs text-ink-muted">{r.body}</p>
              </td>
              <td className="px-3 py-3 text-ink-muted">{r.productId}</td>
              <td className="px-3 py-3">{r.rating}</td>
              <td className="px-3 py-3">
                <select
                  value={status}
                  onChange={(e) => setMod(r.id, e.target.value as "approved" | "hidden" | "flagged")}
                  className="rounded border border-line bg-transparent px-2 py-1 text-sm"
                >
                  <option value="approved">Approved</option>
                  <option value="hidden">Hidden</option>
                  <option value="flagged">Flagged</option>
                </select>
              </td>
            </tr>
          );
        })}
      </Table>
    </SectionShell>
  );
}

function NotificationsAdmin() {
  const notes = useStore((s) => s.adminNotifications);
  const setStatus = useStore((s) => s.setAdminNotificationStatus);
  return (
    <SectionShell title="Notifications" description="Push, email, SMS, and in-app messaging.">
      <Table headers={["Message", "Channel", "Audience", "Status"]}>
        {notes.map((n) => (
          <tr key={n.id}>
            <td className="px-3 py-3">
              <p className="font-medium">{n.title}</p>
              {n.scheduledAt && <p className="text-xs text-ink-muted">{n.scheduledAt}</p>}
            </td>
            <td className="px-3 py-3 uppercase tracking-luxe text-[0.65rem]">{n.channel}</td>
            <td className="px-3 py-3 text-ink-muted">{n.audience}</td>
            <td className="px-3 py-3">
              <select
                value={n.status}
                onChange={(e) => setStatus(n.id, e.target.value as typeof n.status)}
                className="rounded border border-line bg-transparent px-2 py-1 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="sent">Sent</option>
              </select>
            </td>
          </tr>
        ))}
      </Table>
    </SectionShell>
  );
}

function StoresAdmin() {
  const published = useStore((s) => s.storePublished);
  const setPublished = useStore((s) => s.setStorePublished);
  return (
    <SectionShell title="Store locations" description="Boutique visibility and services inventory.">
      <Table headers={["Boutique", "City", "Services", "Status"]}>
        {boutiques.map((b) => {
          const on = published[b.id] !== false;
          return (
            <tr key={b.id}>
              <td className="px-3 py-3 font-medium">{b.name}</td>
              <td className="px-3 py-3 text-ink-muted">{b.city}</td>
              <td className="px-3 py-3 text-xs text-ink-muted">{b.services.slice(0, 3).join(" · ")}</td>
              <td className="px-3 py-3">
                <Toggle on={on} onClick={() => setPublished(b.id, !on)} label={on ? "Open" : "Hidden"} />
              </td>
            </tr>
          );
        })}
      </Table>
    </SectionShell>
  );
}

function AppointmentsAdmin() {
  const appts = useStore((s) => s.appointments);
  const cancel = useStore((s) => s.cancelAppointment);
  return (
    <SectionShell title="Appointments" description="Virtual and in-store styling bookings.">
      {appts.length === 0 ? (
        <p className="text-sm text-ink-muted">No appointments booked.</p>
      ) : (
        <Table headers={["Title", "When", "Status", "Actions"]}>
          {appts.map((a) => (
            <tr key={a.id}>
              <td className="px-3 py-3 font-medium">{a.title}</td>
              <td className="px-3 py-3 text-ink-muted">{a.when}</td>
              <td className="px-3 py-3 capitalize">{a.status}</td>
              <td className="px-3 py-3">
                {a.status === "upcoming" && (
                  <button type="button" className="text-xs uppercase tracking-luxe text-gold" onClick={() => cancel(a.id)}>
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </SectionShell>
  );
}

function StylistsAdmin() {
  const active = useStore((s) => s.stylistActive);
  const setActive = useStore((s) => s.setStylistActive);
  return (
    <SectionShell title="Stylists" description="Activate stylists and review specialty coverage.">
      <Table headers={["Stylist", "Title", "Specialties", "Active"]}>
        {stylists.map((s) => {
          const on = active[s.id] !== false;
          return (
            <tr key={s.id}>
              <td className="px-3 py-3 font-medium">{s.name}</td>
              <td className="px-3 py-3 text-ink-muted">{s.title}</td>
              <td className="px-3 py-3 text-xs text-ink-muted">{s.specialties.join(" · ")}</td>
              <td className="px-3 py-3">
                <Toggle on={on} onClick={() => setActive(s.id, !on)} label={on ? "Active" : "Off"} />
              </td>
            </tr>
          );
        })}
      </Table>
    </SectionShell>
  );
}

function SupportAdmin() {
  const tickets = useStore((s) => s.supportTickets);
  const resolve = useStore((s) => s.resolveSupportTicketAdmin);
  return (
    <SectionShell title="Support tickets" description="Concierge and client care queue.">
      {tickets.length === 0 ? (
        <p className="text-sm text-ink-muted">No tickets. Open one from Support / Concierge.</p>
      ) : (
        <Table headers={["Subject", "Channel", "Status", "Actions"]}>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td className="px-3 py-3 font-medium">{t.subject}</td>
              <td className="px-3 py-3 capitalize text-ink-muted">{t.channel}</td>
              <td className="px-3 py-3 capitalize">{t.status}</td>
              <td className="px-3 py-3">
                {t.status !== "resolved" && (
                  <button type="button" className="text-xs uppercase tracking-luxe text-gold" onClick={() => resolve(t.id)}>
                    Resolve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </SectionShell>
  );
}
