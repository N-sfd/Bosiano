"use client";

import { useMemo } from "react";
import { buildAnalyticsReport } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { cartCount } from "@/store/useStore";

export function AnalyticsDashboard() {
  const hydrated = useHydrated();
  const events = useStore((s) => s.analyticsEvents);
  const recentlyViewed = useStore((s) => s.recentlyViewed);
  const wishlist = useStore((s) => s.wishlist);
  const cart = useStore((s) => s.cart);
  const loyaltyPoints = useStore((s) => s.loyaltyPoints);
  const campaigns = useStore((s) => s.campaigns);
  const returns = useStore((s) => s.returns);

  const report = useMemo(() => {
    if (!hydrated) return null;
    return buildAnalyticsReport({
      events,
      recentlyViewed,
      wishlistCount: wishlist.length,
      cartCount: cartCount(cart),
      loyaltyPoints,
      campaigns,
      returnReasonsLive: returns.map((r) => r.reason),
    });
  }, [hydrated, events, recentlyViewed, wishlist, cart, loyaltyPoints, campaigns, returns]);

  if (!report) return <p className="text-sm text-ink-muted">Loading analytics…</p>;

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Insights</p>
        <h1 className="mt-2 font-serif text-4xl">Analytics</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Live demo metrics merge seeded baselines with in-session events (search, views, wishlist, cart).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Revenue" value={formatPrice(report.revenue)} />
        <Stat label="Conversion rate" value={`${report.conversionRate}%`} />
        <Stat label="Average order value" value={formatPrice(report.aov)} />
        <Stat label="Customer LTV (avg)" value={formatPrice(report.customerLifetimeValue.avg)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Search terms">
          <BarList rows={report.searchTerms.map((r) => ({ label: r.term, value: r.count }))} />
        </Panel>
        <Panel title="Zero-result searches">
          <BarList rows={report.zeroResultSearches.map((r) => ({ label: r.term, value: r.count }))} />
        </Panel>
        <Panel title="Filter use">
          <BarList rows={report.filterUse.map((r) => ({ label: r.filter, value: r.count }))} />
        </Panel>
        <Panel title="Wishlist activity">
          <dl className="grid grid-cols-3 gap-3 text-center">
            <div>
              <dt className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">Adds</dt>
              <dd className="mt-1 font-serif text-2xl">{report.wishlistActivity.adds}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">Removes</dt>
              <dd className="mt-1 font-serif text-2xl">{report.wishlistActivity.removes}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">Net list</dt>
              <dd className="mt-1 font-serif text-2xl">{report.wishlistActivity.net}</dd>
            </div>
          </dl>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Cart abandonment">
          <p className="font-serif text-3xl">{report.cartAbandonment.rate}%</p>
          <p className="mt-2 text-sm text-ink-muted">
            {report.cartAbandonment.abandoned} abandoned · {report.cartAbandonment.recovered} recovered
          </p>
        </Panel>
        <Panel title="Repeat purchases">
          <p className="font-serif text-3xl">{report.repeatPurchases.rate}%</p>
          <p className="mt-2 text-sm text-ink-muted">
            {report.repeatPurchases.repeatCustomers} repeat customers in demo orders
          </p>
        </Panel>
        <Panel title="Loyalty enrollment">
          <p className="font-serif text-3xl">{report.loyaltyEnrollment.members.toLocaleString()}</p>
          <p className="mt-2 text-sm text-ink-muted">
            {report.loyaltyEnrollment.rate}% of visitors · +{report.loyaltyEnrollment.newThisPeriod} this period
          </p>
        </Panel>
      </div>

      <Panel title="Product views">
        <BarList
          rows={report.productViews.map((r) => ({ label: r.name, value: r.views }))}
          formatValue={(n) => n.toLocaleString()}
        />
      </Panel>

      <Panel title="Designer performance">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">
              <tr>
                <th className="pb-2 font-medium">Designer</th>
                <th className="pb-2 font-medium">Revenue</th>
                <th className="pb-2 font-medium">Units</th>
                <th className="pb-2 font-medium">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {report.designerPerformance.map((d) => (
                <tr key={d.brandId}>
                  <td className="py-2.5 font-medium">{d.name}</td>
                  <td className="py-2.5">{formatPrice(d.revenue)}</td>
                  <td className="py-2.5 text-ink-muted">{d.units}</td>
                  <td className="py-2.5 text-ink-muted">{d.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Return reasons">
          <BarList rows={report.returnReasons.map((r) => ({ label: r.reason, value: r.count }))} />
        </Panel>
        <Panel title="Campaign performance">
          {report.campaignPerformance.length === 0 ? (
            <p className="text-sm text-ink-muted">No campaigns yet.</p>
          ) : (
            <ul className="space-y-3">
              {report.campaignPerformance.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-ink-muted">
                      {c.channel} · {c.status} · eng {c.engagement}%
                    </p>
                  </div>
                  <p className="text-sm">{formatPrice(c.attributedRevenue)}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Customer lifetime value">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">Average</p>
            <p className="mt-1 font-serif text-2xl">{formatPrice(report.customerLifetimeValue.avg)}</p>
          </div>
          <div>
            <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">Median</p>
            <p className="mt-1 font-serif text-2xl">{formatPrice(report.customerLifetimeValue.median)}</p>
          </div>
          <div>
            <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">Top tier</p>
            <p className="mt-1 font-serif text-2xl">{formatPrice(report.customerLifetimeValue.topTier)}</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-canvas-raised/40 px-4 py-4">
      <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{label}</p>
      <p className="mt-2 font-serif text-2xl">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line p-4 sm:p-5">
      <h2 className="font-serif text-xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BarList({
  rows,
  formatValue = (n) => String(n),
}: {
  rows: { label: string; value: number }[];
  formatValue?: (n: number) => string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="mb-1 flex justify-between gap-2 text-xs">
            <span className="truncate text-ink">{r.label}</span>
            <span className="shrink-0 text-ink-muted">{formatValue(r.value)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-gold/70" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
