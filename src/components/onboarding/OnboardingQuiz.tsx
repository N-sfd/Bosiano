"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { brands } from "@/lib/brands";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import type { StyleProfile } from "@/lib/types";

const steps = [
  {
    key: "styleTags",
    title: "Style preference",
    options: [
      { id: "minimal", label: "Quiet luxury" },
      { id: "romantic", label: "Romantic" },
      { id: "tailored", label: "Tailored" },
      { id: "resort", label: "Resort ease" },
      { id: "statement", label: "Statement" },
      { id: "essential", label: "Everyday essentials" },
    ],
    multi: true,
  },
  {
    key: "preferredDesigners",
    title: "Favorite designers",
    options: brands.slice(0, 8).map((b) => ({ id: b.id, label: b.name })),
    multi: true,
  },
  {
    key: "sizes",
    title: "Your sizes",
    kind: "sizes" as const,
  },
  {
    key: "favoriteColors",
    title: "Favorite colors",
    options: [
      { id: "Black", label: "Black" },
      { id: "Ivory", label: "Ivory" },
      { id: "Camel", label: "Camel" },
      { id: "Charcoal", label: "Charcoal" },
      { id: "Navy", label: "Navy" },
      { id: "Blush", label: "Blush" },
      { id: "Olive", label: "Olive" },
      { id: "Gold", label: "Gold" },
    ],
    multi: true,
  },
  {
    key: "budget",
    title: "Typical budget",
    options: [
      { id: "400", label: "Under $400" },
      { id: "700", label: "$400 – $700" },
      { id: "1200", label: "$700 – $1,200" },
      { id: "2500", label: "$1,200+" },
    ],
    multi: false,
  },
  {
    key: "preferredFits",
    title: "Preferred fits",
    options: [
      { id: "snug", label: "Snug / close" },
      { id: "regular", label: "True to size" },
      { id: "relaxed", label: "Relaxed / easy" },
    ],
    multi: true,
  },
  {
    key: "preferredCategories",
    title: "Shopping categories",
    options: [
      { id: "women", label: "Womenswear" },
      { id: "men", label: "Menswear" },
      { id: "bags", label: "Bags" },
      { id: "shoes", label: "Shoes" },
      { id: "jewelry", label: "Jewelry" },
    ],
    multi: true,
  },
  {
    key: "sustainabilityPreference",
    title: "Sustainability preference",
    options: [
      { id: "any", label: "No preference" },
      { id: "prefer", label: "Prefer conscious" },
      { id: "require", label: "Conscious only" },
    ],
    multi: false,
  },
  {
    key: "occasions",
    title: "Typical occasions",
    options: [
      { id: "work", label: "Work" },
      { id: "evening", label: "Evening" },
      { id: "everyday", label: "Everyday" },
      { id: "vacation", label: "Vacation" },
      { id: "wedding", label: "Wedding / events" },
      { id: "formal", label: "Formal" },
    ],
    multi: true,
  },
];

export function OnboardingQuiz() {
  const router = useRouter();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const profile = useStore((s) => s.styleProfile);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Partial<StyleProfile>>({
    styleTags: profile.styleTags ?? [],
    preferredDesigners: profile.preferredDesigners ?? [],
    favoriteColors: profile.favoriteColors ?? [],
    preferredFits: profile.preferredFits ?? ["regular"],
    preferredCategories: profile.preferredCategories ?? [],
    occasions: profile.occasions ?? [],
    sustainabilityPreference: profile.sustainabilityPreference ?? "prefer",
    budget: profile.budget,
    sizes: { ...profile.sizes },
  });

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const selectedIds = (key: string): string[] => {
    if (key === "budget") return [String(draft.budget ?? 1200)];
    if (key === "sustainabilityPreference") return [draft.sustainabilityPreference ?? "prefer"];
    const val = draft[key as keyof StyleProfile];
    return Array.isArray(val) ? (val as string[]) : [];
  };

  const toggle = (key: string, id: string, multi: boolean) => {
    if (key === "budget") {
      setDraft((d) => ({ ...d, budget: Number(id) }));
      return;
    }
    if (key === "sustainabilityPreference") {
      setDraft((d) => ({
        ...d,
        sustainabilityPreference: id as StyleProfile["sustainabilityPreference"],
      }));
      return;
    }
    setDraft((d) => {
      const prev = (d[key as keyof StyleProfile] as string[]) ?? [];
      if (!multi) return { ...d, [key]: [id] };
      return {
        ...d,
        [key]: prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      };
    });
  };

  const finish = () => {
    completeOnboarding({
      ...draft,
      onboardingComplete: true,
    });
    router.push("/?personalized=1");
  };

  const next = () => {
    if (step >= steps.length - 1) finish();
    else setStep((s) => s + 1);
  };

  return (
    <div className="shell py-10 lg:py-16">
      <div className="mx-auto max-w-xl">
        <p className="eyebrow inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-gold" /> Style onboarding
        </p>
        <h1 className="mt-2 font-serif text-4xl">A short quiz. A sharper edit.</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Step {step + 1} of {steps.length} — we&apos;ll personalize your homepage, search, suggestions, and alerts.
        </p>

        <div className="mt-6 h-1 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
        </div>

        <h2 className="mt-8 font-serif text-2xl">{current.title}</h2>

        {"kind" in current && current.kind === "sizes" ? (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {(["tops", "bottoms", "shoes"] as const).map((key) => (
              <label key={key} className="text-xs uppercase tracking-luxe text-ink-muted">
                {key}
                <input
                  value={draft.sizes?.[key] ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      sizes: { tops: "S", bottoms: "S", shoes: "39", ...d.sizes, [key]: e.target.value },
                    }))
                  }
                  className="mt-1 w-full border border-line bg-canvas px-3 py-3 text-sm focus:border-ink focus:outline-none"
                />
              </label>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap gap-2">
            {current.options?.map((o) => {
              const active = selectedIds(current.key).includes(o.id);
              return (
                <button
                  key={o.id}
                  onClick={() => toggle(current.key, o.id, !!current.multi)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm transition-colors",
                    active ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"
                  )}
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                  {o.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            className="btn-ghost"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </button>
          <button className="btn-primary" onClick={next}>
            {step >= steps.length - 1 ? (
              <>
                Personalize my shop <Sparkles className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
