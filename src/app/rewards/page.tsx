"use client";

import Link from "next/link";
import { Award, Gift, Truck, Sparkles, Calendar, Star, ArrowRight, Users, Crown } from "lucide-react";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/ui/Reveal";
import { CLUB_TIERS, MEMBERSHIP_PLANS, REFERRAL_REWARD, REFERRAL_FRIEND_REWARD, tierProgress } from "@/lib/club";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { cn, formatPrice } from "@/lib/utils";

const benefits = [
  { icon: Gift, title: "Earn on everything", copy: "Collect points on every purchase and redeem for credit." },
  { icon: Truck, title: "Complimentary shipping", copy: "Free express delivery from Gold and above." },
  { icon: Calendar, title: "Early access", copy: "Shop new arrivals and sales before anyone else." },
  { icon: Sparkles, title: "Private previews", copy: "Invitation-only designer collections." },
  { icon: Star, title: "Personal styling", copy: "Private Client stylists and concierge." },
  { icon: Users, title: "Referral rewards", copy: `Share your code — earn $${REFERRAL_REWARD} when friends purchase.` },
];

export default function RewardsPage() {
  const hydrated = useHydrated();
  const loyaltyPoints = useStore((s) => s.loyaltyPoints);
  const pointsHistory = useStore((s) => s.pointsHistory);
  const redeemPoints = useStore((s) => s.redeemPoints);
  const referralCode = useStore((s) => s.referralCode);
  const referrals = useStore((s) => s.referrals);
  const memberships = useStore((s) => s.memberships);
  const subscribeMembership = useStore((s) => s.subscribeMembership);
  const progress = tierProgress(hydrated ? loyaltyPoints : 2480);
  const expiring = (hydrated ? pointsHistory : []).filter((p) => p.expiresAt && p.expiresAt > Date.now() && p.delta > 0);

  return (
    <>
      <section className="relative overflow-hidden bg-void text-canvas">
        <Media seed="rewards-hero" swatches={["#141414", "#8a6a2c", "#c2a367"]} ratio="auto" className="absolute inset-0 h-full w-full opacity-60" monogram={false} />
        <div className="shell relative py-24 text-center lg:py-32">
          <p className="eyebrow !text-canvas/70 inline-flex items-center gap-2">
            <Award className="h-4 w-4 text-gold" /> Bosiano Club
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-5xl leading-[1] sm:text-6xl lg:text-7xl">
            Member. Gold. Private Client.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-canvas/85">
            Configurable tiers with welcome rewards, multipliers, early access, and concierge services.
          </p>
          <Link href="/account" className="mt-8 inline-flex bg-canvas px-8 py-4 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold hover:text-void">
            View my Club
          </Link>
        </div>
      </section>

      <section className="shell py-12">
        <div className="rounded-2xl border border-line bg-canvas-raised p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{progress.current.name} member</p>
              <p className="mt-2 font-serif text-4xl">{(hydrated ? loyaltyPoints : 2480).toLocaleString()} points</p>
              {progress.upcoming ? (
                <p className="mt-1 text-sm text-ink-muted">
                  {progress.remaining.toLocaleString()} until {progress.upcoming.name}
                </p>
              ) : (
                <p className="mt-1 text-sm text-gold-deep">Highest tier unlocked</p>
              )}
            </div>
            <button
              onClick={() => redeemPoints(500, "Redeemed 500 pts")}
              className="btn-outline"
              disabled={!hydrated || loyaltyPoints < 500}
            >
              Redeem 500 pts → $5 credit
            </button>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-canvas-sunk">
            <div className="h-full rounded-full bg-gold" style={{ width: `${progress.percent}%` }} />
          </div>
          {expiring.length > 0 && (
            <p className="mt-3 text-xs text-ink-muted">
              {expiring[0].delta} points expire {new Date(expiring[0].expiresAt!).toLocaleDateString()}
            </p>
          )}
        </div>
      </section>

      <section className="shell py-10 lg:py-16">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div>
                <b.icon className="h-7 w-7 text-gold" strokeWidth={1.3} />
                <h3 className="mt-4 font-serif text-2xl">{b.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{b.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-canvas-sunk py-16 lg:py-24">
        <div className="shell">
          <div className="text-center">
            <p className="eyebrow">Membership tiers</p>
            <h2 className="mt-3 font-serif text-4xl">Three configurable levels</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {CLUB_TIERS.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "relative rounded-2xl border bg-canvas-raised p-7",
                  t.id === "gold" ? "border-gold shadow-sm" : "border-line"
                )}
              >
                {t.id === "gold" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[0.6rem] font-semibold uppercase tracking-luxe text-ink">
                    Most popular
                  </span>
                )}
                <div className="h-1.5 w-12 rounded-full" style={{ background: t.accent }} />
                <h3 className="mt-4 font-serif text-3xl">{t.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-luxe text-ink-muted">
                  From {t.minPoints.toLocaleString()} pts · {t.multiplier}× earn
                </p>
                {t.welcomeReward && <p className="mt-3 text-sm text-gold-deep">{t.welcomeReward}</p>}
                <ul className="mt-6 space-y-3">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-ink-soft">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow inline-flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-gold" /> Referral program
            </p>
            <h2 className="mt-3 font-serif text-4xl">Share Bosiano</h2>
            <p className="mt-3 text-ink-soft">
              Your code earns ${REFERRAL_REWARD} when friends purchase. They receive ${REFERRAL_FRIEND_REWARD} off.
            </p>
            <div className="mt-6 rounded-xl border border-line bg-canvas-raised px-5 py-4">
              <p className="text-xs uppercase tracking-luxe text-ink-muted">Your referral code</p>
              <p className="mt-1 font-serif text-3xl tracking-wide">{hydrated ? referralCode : "AMELIA25"}</p>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-ink-soft">
              {(hydrated ? referrals : []).slice(0, 4).map((r) => (
                <li key={r.id} className="flex justify-between border-b border-line py-2">
                  <span>{r.friendName}</span>
                  <span className="uppercase tracking-luxe text-ink-muted">{r.status} · ${r.reward}</span>
                </li>
              ))}
            </ul>
            <Link href="/account/referrals" className="mt-4 inline-flex items-center gap-2 text-sm hover:text-gold">
              Track referrals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <p className="eyebrow inline-flex items-center gap-2">
              <Crown className="h-3.5 w-3.5 text-gold" /> Memberships
            </p>
            <h2 className="mt-3 font-serif text-4xl">Optional subscriptions</h2>
            <div className="mt-6 space-y-3">
              {MEMBERSHIP_PLANS.map((plan) => {
                const active = memberships.some((m) => m.planId === plan.id && m.active);
                return (
                  <div key={plan.id} className="rounded-xl border border-line p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-xl">{plan.name}</p>
                        <p className="mt-1 text-sm text-ink-muted">{plan.description}</p>
                        <p className="mt-2 text-xs uppercase tracking-luxe text-ink-soft">
                          {formatPrice(plan.price)} / {plan.cadence}
                        </p>
                      </div>
                      <button
                        onClick={() => subscribeMembership(plan.id)}
                        className={cn("btn-outline shrink-0 !py-2", active && "!border-gold !text-gold-deep")}
                      >
                        {active ? "Active" : "Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="shell pb-20">
        <h2 className="font-serif text-3xl">Reward history</h2>
        <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
          {(hydrated ? pointsHistory : []).slice(0, 8).map((e) => (
            <div key={e.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p>{e.label}</p>
                <p className="text-xs text-ink-muted">{new Date(e.at).toLocaleDateString()}</p>
              </div>
              <span className={e.delta >= 0 ? "text-gold-deep" : "text-ink-muted"}>
                {e.delta >= 0 ? "+" : ""}
                {e.delta}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
