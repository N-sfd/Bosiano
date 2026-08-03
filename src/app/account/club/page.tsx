"use client";

import Link from "next/link";
import { Award, Gift, Sparkles, Crown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import {
  CLUB_TIERS,
  availableRewardsFor,
  tierProgress,
} from "@/lib/club";
import { cn, formatPrice } from "@/lib/utils";

export default function AccountClubPage() {
  const hydrated = useHydrated();
  const loyaltyPoints = useStore((s) => s.loyaltyPoints);
  const pointsHistory = useStore((s) => s.pointsHistory);
  const redeemPoints = useStore((s) => s.redeemPoints);
  const storeCredit = useStore((s) => s.storeCredit);

  const points = hydrated ? loyaltyPoints : 2480;
  const progress = tierProgress(points);
  const rewards = availableRewardsFor(points);
  const history = hydrated ? pointsHistory : [];
  const expiring = history.filter((p) => p.expiresAt && p.expiresAt > Date.now() && p.delta > 0);

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow inline-flex items-center gap-2">
          <Award className="h-3.5 w-3.5 text-gold" /> Bosiano Club
        </p>
        <h1 className="mt-2 font-serif text-4xl">Your membership</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Points, tier, rewards, and progress — Member · Gold · Private Client.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-ink p-7 text-canvas">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-luxe text-canvas/60">{progress.current.name} tier</p>
            <p className="mt-2 font-serif text-5xl">{points.toLocaleString()}</p>
            <p className="mt-1 text-sm text-canvas/70">points · {progress.current.multiplier}× earn rate</p>
            {progress.upcoming ? (
              <p className="mt-3 text-sm text-canvas/80">
                {progress.remaining.toLocaleString()} points until {progress.upcoming.name}
              </p>
            ) : (
              <p className="mt-3 text-sm text-gold">Highest tier unlocked</p>
            )}
            <div className="mt-3 h-1.5 max-w-md overflow-hidden rounded-full bg-canvas/20">
              <div className="h-full rounded-full bg-gold" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
          <div className="text-right text-sm text-canvas/80">
            <p>Store credit · {formatPrice(hydrated ? storeCredit : 40)}</p>
            {expiring[0]?.expiresAt && (
              <p className="mt-1 text-xs text-gold">
                {expiring[0].delta} pts expire {new Date(expiring[0].expiresAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <section>
        <h2 className="font-serif text-2xl">Tiers</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {CLUB_TIERS.map((t) => {
            const active = t.id === progress.current.id;
            return (
              <div
                key={t.id}
                className={cn(
                  "rounded-2xl border p-5",
                  active ? "border-gold bg-gold/5" : "border-line"
                )}
              >
                <div className="flex items-center gap-2">
                  {t.id === "private-client" ? (
                    <Crown className="h-4 w-4 text-gold" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-gold" />
                  )}
                  <h3 className="font-serif text-xl">{t.name}</h3>
                  {active && (
                    <span className="ml-auto text-[0.6rem] uppercase tracking-luxe text-gold-deep">Current</span>
                  )}
                </div>
                <p className="mt-1 text-xs uppercase tracking-luxe text-ink-muted">
                  From {t.minPoints.toLocaleString()} pts · {t.multiplier}×
                </p>
                <ul className="mt-4 space-y-2">
                  {t.perks.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-ink-soft">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Available rewards</h2>
          <button
            className="btn-outline !py-2"
            disabled={!hydrated || points < 500}
            onClick={() => redeemPoints(500, "Redeemed 500 pts → credit")}
          >
            Redeem 500 pts
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {rewards.map((r) => (
            <div key={r.id} className="flex gap-3 rounded-xl border border-line p-4">
              <Gift className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="mt-0.5 text-sm text-ink-soft">{r.copy}</p>
                <p className="mt-2 text-[0.65rem] uppercase tracking-luxe text-ink-muted">
                  {r.pointsCost ? `${r.pointsCost} pts` : "Included"} · {r.tierMin.replace("-", " ")}+
                  {r.expiresInDays ? ` · ${r.expiresInDays}d` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl">Reward history</h2>
        <div className="divide-y divide-line rounded-2xl border border-line">
          {history.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-muted">No reward activity yet.</p>
          ) : (
            history.slice(0, 12).map((e) => (
              <div key={e.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p>{e.label}</p>
                  <p className="text-xs text-ink-muted">
                    {new Date(e.at).toLocaleDateString()}
                    {e.expiresAt ? ` · expires ${new Date(e.expiresAt).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <span className={e.delta >= 0 ? "text-gold-deep" : "text-ink-muted"}>
                  {e.delta >= 0 ? "+" : ""}
                  {e.delta}
                </span>
              </div>
            ))
          )}
        </div>
        <Link href="/rewards" className="mt-4 inline-block text-xs uppercase tracking-luxe hover:text-gold">
          Explore full Club benefits →
        </Link>
      </section>
    </div>
  );
}
