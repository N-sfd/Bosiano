"use client";

import { useState } from "react";
import { Copy, Check, Users } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { REFERRAL_FRIEND_REWARD, REFERRAL_REWARD, tierForPoints } from "@/lib/club";
import { cn } from "@/lib/utils";

export default function ReferralsPage() {
  const hydrated = useHydrated();
  const referralCode = useStore((s) => s.referralCode);
  const referrals = useStore((s) => s.referrals);
  const applyReferralPurchase = useStore((s) => s.applyReferralPurchase);
  const loyaltyPoints = useStore((s) => s.loyaltyPoints);
  const [copied, setCopied] = useState(false);
  const [friend, setFriend] = useState("");
  const tier = tierForPoints(hydrated ? loyaltyPoints : 2480);
  const rewarded = referrals.filter((r) => r.status === "rewarded").length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl">Referral program</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Share your code, earn ${REFERRAL_REWARD} when friends purchase, and unlock tier bonuses as {tier.name}.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-canvas-raised p-6">
        <p className="eyebrow inline-flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-gold" /> Your code
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="font-serif text-4xl tracking-wide">{hydrated ? referralCode : "AMELIA25"}</p>
          <button onClick={copy} className="btn-outline !py-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          Friends get ${REFERRAL_FRIEND_REWARD} off. Successful referrals: {rewarded}. Tier bonus:{" "}
          {tier.multiplier}× on referral points.
        </p>
      </div>

      <div className="rounded-2xl border border-line p-6">
        <h2 className="font-serif text-2xl">Simulate friend purchase</h2>
        <div className="mt-4 flex gap-2">
          <input
            value={friend}
            onChange={(e) => setFriend(e.target.value)}
            placeholder="Friend name"
            className="flex-1 rounded-lg border border-line bg-canvas px-4 py-3 text-sm"
          />
          <button
            onClick={() => {
              if (!friend.trim()) return;
              applyReferralPurchase(friend.trim());
              setFriend("");
            }}
            className="btn-primary"
          >
            Award referral
          </button>
        </div>
      </div>

      <section>
        <h2 className="mb-4 font-serif text-2xl">Referral tracking</h2>
        <div className="divide-y divide-line rounded-2xl border border-line">
          {(hydrated ? referrals : []).map((r) => (
            <div key={r.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="font-medium">{r.friendName}</p>
                <p className="text-xs text-ink-muted">{new Date(r.at).toLocaleDateString()}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-luxe",
                  r.status === "rewarded"
                    ? "bg-gold/15 text-gold-deep"
                    : r.status === "purchased"
                      ? "bg-canvas-sunk text-ink"
                      : "bg-canvas-sunk text-ink-muted"
                )}
              >
                {r.status} · ${r.reward}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
