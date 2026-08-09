"use client";

import Link from "next/link";
import { analyticsSnapshot } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";

export function AdminOverview() {
  const snap = analyticsSnapshot();
  const hydrated = useHydrated();
  const returns = useStore((s) => s.returns);
  const tickets = useStore((s) => s.supportTickets);
  const pins = useStore((s) => s.pinnedProductIds);
  const campaigns = useStore((s) => s.campaigns);
  const promos = useStore((s) => s.promotions);

  const stats = [
    { label: "Revenue (demo orders)", value: formatPrice(snap.revenue) },
    { label: "Orders", value: String(snap.orders) },
    { label: "AOV", value: formatPrice(snap.aov) },
    { label: "Units sold", value: String(snap.units) },
    { label: "Conversion", value: `${snap.conversion}%` },
    { label: "Return rate", value: `${snap.returnRate}%` },
    { label: "NPS", value: String(snap.nps) },
    { label: "Catalog SKUs", value: String(snap.products) },
    { label: "Low stock", value: String(snap.lowStock) },
    { label: "Out of stock", value: String(snap.outOfStock) },
    { label: "Open returns", value: hydrated ? String(returns.length) : "—" },
    { label: "Support open", value: hydrated ? String(tickets.filter((t) => t.status !== "resolved").length) : "—" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Operations</p>
        <h1 className="mt-2 font-serif text-4xl">Admin dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Manage catalog, inventory, clients, merchandising, and service — demo state persists in this browser.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-canvas-raised/40 px-4 py-4">
            <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{s.label}</p>
            <p className="mt-2 font-serif text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <QuickCard
          title="Analytics"
          body="Revenue, conversion, search, wishlist, abandonment, LTV, and more"
          href="/admin/analytics"
        />
        <QuickCard
          title="Merchandising"
          body={`${hydrated ? pins.length : "—"} pinned · ${hydrated ? campaigns.filter((c) => c.status === "live" || c.status === "scheduled").length : "—"} campaigns · ${hydrated ? promos.filter((p) => p.active).length : "—"} live promos`}
          href="/admin/merchandising"
        />
        <QuickCard
          title="Inventory"
          body={`${snap.lowStock} low · ${snap.outOfStock} sold out — set thresholds & restock dates`}
          href="/admin/inventory"
        />
        <QuickCard
          title="Brand identity"
          body="Wordmark, crest hierarchy, colors, and asset paths"
          href="/admin/brand"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-line">
        <div className="border-b border-line px-4 py-3">
          <p className="text-xs uppercase tracking-luxe text-ink-muted">Catalog snapshot</p>
        </div>
        <div className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {[
            { label: "Designers", value: snap.designers, href: "/admin/designers" },
            { label: "Journal stories", value: snap.journal, href: "/admin/editorial" },
            { label: "Lookbooks", value: snap.lookbooks, href: "/admin/lookbooks" },
            { label: "Club tiers", value: snap.clubTiers, href: "/admin/loyalty" },
          ].map((row) => (
            <Link key={row.label} href={row.href} className="px-4 py-5 transition-colors hover:bg-canvas-raised/50">
              <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{row.label}</p>
              <p className="mt-1 font-serif text-3xl">{row.value}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickCard({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-line p-5 transition-colors hover:border-ink/30">
      <p className="font-serif text-xl">{title}</p>
      <p className="mt-2 text-sm text-ink-muted">{body}</p>
      <p className="mt-4 text-[0.65rem] uppercase tracking-luxe text-gold">Open →</p>
    </Link>
  );
}
