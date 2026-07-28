"use client";

import { useState } from "react";
import Link from "next/link";
import { products } from "@/lib/products";
import { MERCH_BADGE_OPTIONS } from "@/lib/admin";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import type { MerchBadgeId } from "@/lib/types";

export function MerchandisingClient() {
  const hydrated = useHydrated();
  const pinned = useStore((s) => s.pinnedProductIds);
  const badges = useStore((s) => s.productBadges);
  const collections = useStore((s) => s.curatedCollections);
  const campaigns = useStore((s) => s.campaigns);
  const landings = useStore((s) => s.landingPages);
  const reco = useStore((s) => s.recommendationConfig);
  const promos = useStore((s) => s.promotions);
  const restocks = useStore((s) => s.restockDates);
  const thresholds = useStore((s) => s.lowStockThresholds);
  const lookbooks = useStore((s) => s.adminLookbooks);

  const togglePin = useStore((s) => s.togglePinProduct);
  const setProductBadges = useStore((s) => s.setProductBadges);
  const createCollection = useStore((s) => s.createCollection);
  const updateCollection = useStore((s) => s.updateCollection);
  const toggleCollectionProduct = useStore((s) => s.toggleCollectionProduct);
  const scheduleCampaign = useStore((s) => s.scheduleCampaign);
  const setCampaignStatus = useStore((s) => s.setCampaignStatus);
  const createLandingPage = useStore((s) => s.createLandingPage);
  const setLandingPublished = useStore((s) => s.setLandingPublished);
  const setRecommendationConfig = useStore((s) => s.setRecommendationConfig);
  const setRestockDate = useStore((s) => s.setRestockDate);
  const setLowStockThreshold = useStore((s) => s.setLowStockThreshold);
  const upsertPromotion = useStore((s) => s.upsertPromotion);
  const setLookbookShoppable = useStore((s) => s.setLookbookShoppable);

  const [colTitle, setColTitle] = useState("");
  const [lpTitle, setLpTitle] = useState("");
  const [campName, setCampName] = useState("");
  const [geoCode, setGeoCode] = useState("");
  const [geoRegion, setGeoRegion] = useState("New York");

  if (!hydrated) return <p className="text-sm text-ink-muted">Loading merchandising…</p>;

  const pinCandidates = products.slice(0, 12);

  return (
    <div className="space-y-12">
      <div>
        <p className="eyebrow">Merchandising</p>
        <h1 className="mt-2 font-serif text-4xl">Merchandising tools</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Pin products, curate collections, schedule campaigns, manage badges, build landing pages, tune
          recommendations, shoppable lookbooks, restock dates, low-stock thresholds, and geographic promotions.
        </p>
      </div>

      {/* Pin products */}
      <section className="space-y-4">
        <Header title="Pin products" note="Pinned SKUs surface first on /shop." />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {pinCandidates.map((p) => {
            const on = pinned.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePin(p.id)}
                className={`rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
                  on ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink/40"
                }`}
              >
                <p className="font-medium">{p.name}</p>
                <p className={`mt-1 text-[0.65rem] uppercase tracking-luxe ${on ? "text-canvas/70" : "text-ink-muted"}`}>
                  {on ? "Pinned" : "Pin"}
                </p>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-ink-muted">{pinned.length} pinned · manage all on Products</p>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <Header title="Manage badges" note="Up to three custom badges per product on cards." />
        <div className="space-y-3">
          {products.slice(0, 5).map((p) => {
            const custom = badges[p.id] ?? [];
            return (
              <div key={p.id} className="rounded-xl border border-line p-3">
                <p className="text-sm font-medium">{p.name}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {MERCH_BADGE_OPTIONS.map((b) => {
                    const on = custom.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        className={`rounded-full px-2.5 py-1 text-[0.6rem] uppercase tracking-luxe ${
                          on ? "bg-gold/30 text-ink" : "border border-line text-ink-muted"
                        }`}
                        onClick={() => {
                          const next = on
                            ? custom.filter((x) => x !== b.id)
                            : [...custom, b.id].slice(0, 3);
                          setProductBadges(p.id, next as MerchBadgeId[]);
                        }}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Collections */}
      <section className="space-y-4">
        <Header title="Curated collections" />
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!colTitle.trim()) return;
            createCollection(colTitle.trim());
            setColTitle("");
          }}
        >
          <input
            className="min-w-[200px] flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm"
            placeholder="New collection title"
            value={colTitle}
            onChange={(e) => setColTitle(e.target.value)}
          />
          <button type="submit" className="btn-primary !py-2 !px-4">
            Create
          </button>
        </form>
        <div className="space-y-4">
          {collections.map((c) => (
            <div key={c.id} className="rounded-xl border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-xl">{c.title}</p>
                  <p className="text-xs text-ink-muted">/{c.slug} · {c.productIds.length} products</p>
                </div>
                <button
                  type="button"
                  className={`rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-luxe ${
                    c.published ? "bg-ink text-canvas" : "border border-line"
                  }`}
                  onClick={() => updateCollection(c.id, { published: !c.published })}
                >
                  {c.published ? "Published" : "Draft"}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {products.slice(0, 8).map((p) => {
                  const on = c.productIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleCollectionProduct(c.id, p.id)}
                      className={`rounded px-2 py-1 text-[0.65rem] ${
                        on ? "bg-gold/25" : "text-ink-muted hover:bg-canvas-raised"
                      }`}
                    >
                      {p.name.split(" ").slice(0, 3).join(" ")}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Campaigns */}
      <section className="space-y-4">
        <Header title="Schedule campaigns" />
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!campName.trim()) return;
            scheduleCampaign({
              name: campName.trim(),
              channel: "site",
              startsAt: "2026-08-01",
              endsAt: "2026-08-20",
              productIds: pinned.slice(0, 3),
              status: "scheduled",
            });
            setCampName("");
          }}
        >
          <input
            className="min-w-[200px] flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm"
            placeholder="Campaign name"
            value={campName}
            onChange={(e) => setCampName(e.target.value)}
          />
          <button type="submit" className="btn-primary !py-2 !px-4">
            Schedule
          </button>
        </form>
        <ul className="divide-y divide-line rounded-xl border border-line">
          {campaigns.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-ink-muted">
                  {c.channel} · {c.startsAt} → {c.endsAt}
                </p>
              </div>
              <select
                value={c.status}
                onChange={(e) => setCampaignStatus(c.id, e.target.value as typeof c.status)}
                className="rounded border border-line bg-transparent px-2 py-1 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
              </select>
            </li>
          ))}
        </ul>
      </section>

      {/* Landing pages */}
      <section className="space-y-4">
        <Header title="Build landing pages" />
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!lpTitle.trim()) return;
            createLandingPage(lpTitle.trim());
            setLpTitle("");
          }}
        >
          <input
            className="min-w-[200px] flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm"
            placeholder="Landing page title"
            value={lpTitle}
            onChange={(e) => setLpTitle(e.target.value)}
          />
          <button type="submit" className="btn-primary !py-2 !px-4">
            Create page
          </button>
        </form>
        <ul className="space-y-2">
          {landings.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-4 py-3">
              <div>
                <p className="font-medium">{l.title}</p>
                <p className="text-xs text-ink-muted">
                  /{l.slug} · {l.headline}
                </p>
              </div>
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-luxe ${
                  l.published ? "bg-ink text-canvas" : "border border-line"
                }`}
                onClick={() => setLandingPublished(l.id, !l.published)}
              >
                {l.published ? "Published" : "Draft"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Recommendations */}
      <section className="space-y-4">
        <Header title="Configure recommendations" note="Weights for similar / trending / personalized rails." />
        <div className="grid gap-4 rounded-xl border border-line p-4 sm:grid-cols-3">
          {(
            [
              ["similarWeight", "Similar"],
              ["trendingWeight", "Trending"],
              ["personalizedWeight", "Personalized"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="text-ink-muted">{label}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={reco[key]}
                onChange={(e) => setRecommendationConfig({ [key]: Number(e.target.value) })}
                className="mt-2 w-full"
              />
              <span className="text-xs">{reco[key]}</span>
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={reco.excludeOutOfStock}
            onChange={(e) => setRecommendationConfig({ excludeOutOfStock: e.target.checked })}
          />
          Exclude out-of-stock from recommendations
        </label>
      </section>

      {/* Shoppable lookbooks */}
      <section className="space-y-4">
        <Header title="Shoppable lookbooks" />
        <ul className="divide-y divide-line rounded-xl border border-line">
          {lookbooks.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{l.title}</p>
                <p className="text-xs text-ink-muted">
                  {l.productCount} hotspots · {l.source}
                </p>
              </div>
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-luxe ${
                  l.shoppable ? "bg-ink text-canvas" : "border border-line"
                }`}
                onClick={() => setLookbookShoppable(l.id, !l.shoppable)}
              >
                {l.shoppable ? "Shoppable" : "Static"}
              </button>
            </li>
          ))}
        </ul>
        <Link href="/admin/lookbooks" className="text-xs uppercase tracking-luxe text-gold">
          Full lookbook admin →
        </Link>
      </section>

      {/* Restock + low stock */}
      <section className="space-y-4">
        <Header title="Restock dates & low-stock thresholds" />
        <label className="flex items-center gap-2 text-sm">
          Global low-stock threshold
          <input
            type="number"
            min={1}
            className="w-16 rounded border border-line bg-transparent px-2 py-1"
            value={thresholds.__global ?? 5}
            onChange={(e) => setLowStockThreshold("__global", Number(e.target.value) || 5)}
          />
        </label>
        <div className="space-y-2">
          {products
            .filter((p) => Object.keys(restocks).includes(p.id) || p.isNew)
            .slice(0, 6)
            .map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-line px-3 py-2 text-sm">
                <span className="min-w-[140px] flex-1 font-medium">{p.name}</span>
                <input
                  className="w-32 rounded border border-line bg-transparent px-2 py-1"
                  placeholder="Restock date"
                  value={restocks[p.id] ?? ""}
                  onChange={(e) => setRestockDate(p.id, e.target.value)}
                />
                <input
                  type="number"
                  className="w-16 rounded border border-line bg-transparent px-2 py-1"
                  title="Threshold"
                  value={thresholds[p.id] ?? thresholds.__global ?? 5}
                  onChange={(e) => setLowStockThreshold(p.id, Number(e.target.value) || 5)}
                />
              </div>
            ))}
        </div>
        <Link href="/admin/inventory" className="text-xs uppercase tracking-luxe text-gold">
          Full inventory →
        </Link>
      </section>

      {/* Geo promotions */}
      <section className="space-y-4">
        <Header title="Geographic promotions" />
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!geoCode.trim()) return;
            upsertPromotion({
              code: geoCode.trim().toUpperCase(),
              label: `${geoRegion} regional offer`,
              type: "percent",
              value: 15,
              active: true,
              regions: [geoRegion],
            });
            setGeoCode("");
          }}
        >
          <input
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm"
            placeholder="Code"
            value={geoCode}
            onChange={(e) => setGeoCode(e.target.value)}
          />
          <input
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm"
            placeholder="Region / city"
            value={geoRegion}
            onChange={(e) => setGeoRegion(e.target.value)}
          />
          <button type="submit" className="btn-primary !py-2 !px-4">
            Add geo promo
          </button>
        </form>
        <ul className="space-y-2 text-sm">
          {promos
            .filter((p) => p.regions.length > 0)
            .map((p) => (
              <li key={p.id} className="rounded-lg border border-line px-3 py-2">
                <span className="font-medium">{p.code}</span>
                <span className="text-ink-muted"> · {p.regions.join(", ")} · {p.value}%</span>
              </li>
            ))}
        </ul>
        <Link href="/admin/promotions" className="text-xs uppercase tracking-luxe text-gold">
          All promotions →
        </Link>
      </section>
    </div>
  );
}

function Header({ title, note }: { title: string; note?: string }) {
  return (
    <div>
      <h2 className="font-serif text-2xl">{title}</h2>
      {note && <p className="mt-1 text-sm text-ink-muted">{note}</p>}
    </div>
  );
}
