"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { ProductRail } from "@/components/product/ProductRail";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { editorsPicks, personalizedProducts } from "@/lib/personalize";
import { relatedProducts, getProduct, products } from "@/lib/products";
import { defaultStyleProfile } from "@/lib/stylist";

export function PersonalizedRail() {
  const hydrated = useHydrated();
  const recentlyViewed = useStore((s) => s.recentlyViewed);
  const wishlist = useStore((s) => s.wishlist);
  const styleProfile = useStore((s) => s.styleProfile);
  const prefs = useStore((s) => s.notificationPrefs);

  const profile = hydrated ? styleProfile : defaultStyleProfile;
  const personalize = !hydrated || prefs.personalizeHomepage;

  const { items, mode } = useMemo(() => {
    if (!personalize) {
      return {
        items: [...products].sort((a, b) => b.rating - a.rating).slice(0, 8),
        mode: "editors" as const,
      };
    }

    if (profile.onboardingComplete) {
      return { items: personalizedProducts(profile, 8), mode: "profile" as const };
    }

    const seeds = [...recentlyViewed, ...wishlist];
    if (seeds.length === 0) {
      return { items: editorsPicks(profile, 8), mode: "editors" as const };
    }

    const scored = new Map<string, number>();
    seeds.forEach((id) => {
      const base = getProduct(id);
      if (!base) return;
      relatedProducts(base, 6).forEach((p) => {
        if (seeds.includes(p.id)) return;
        scored.set(p.id, (scored.get(p.id) ?? 0) + 1);
      });
    });
    const ranked = [...scored.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => getProduct(id)!)
      .filter(Boolean);
    const fill = personalizedProducts(profile, 8).filter((p) => !ranked.includes(p));
    return { items: [...ranked, ...fill].slice(0, 8), mode: "browse" as const };
  }, [personalize, profile, recentlyViewed, wishlist]);

  const eyebrow =
    mode === "profile"
      ? "Your style profile"
      : mode === "browse"
        ? "Curated from your browsing"
        : "Editor's picks";

  return (
    <section className="shell py-16 lg:py-24">
      <SectionHeader
        eyebrow={eyebrow}
        title={mode === "editors" ? "You May Love" : "Selected for You"}
        description={
          mode === "profile"
            ? "Ranked from your onboarding quiz — designers, colors, budget, fits, and occasions."
            : mode === "browse"
              ? "Built from wishlist and recently viewed, with a light style bias."
              : "Our editors' selection — take the quiz to make this truly yours."
        }
        href="/shop"
      />

      {!hydrated || !profile.onboardingComplete ? (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-canvas-raised p-4">
          <Sparkles className="h-4 w-4 text-gold" />
          <p className="flex-1 text-sm text-ink-soft">
            A 2-minute quiz personalizes homepage, search rankings, suggestions, emails, and push alerts.
          </p>
          <Link href="/onboarding" className="btn-primary !py-2.5">
            Take the style quiz <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}

      <div className="mt-8">
        <ProductRail products={items} />
      </div>
    </section>
  );
}
