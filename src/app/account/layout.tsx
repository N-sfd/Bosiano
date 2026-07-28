"use client";

import { AccountNav } from "@/components/account/AccountNav";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { tierForPoints } from "@/lib/club";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const points = useStore((s) => s.loyaltyPoints);
  const tier = tierForPoints(hydrated ? points : 2480);

  return (
    <div className="shell py-10 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-6 hidden lg:block">
            <p className="font-serif text-2xl">Amelia Rousseau</p>
            <p className="text-xs text-ink-muted">{tier.name} · Bosiano Club</p>
          </div>
          <AccountNav />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
