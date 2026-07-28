"use client";

import Link from "next/link";
import { Mail, Bell, Sparkles, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { suggestedEmailSubjects, suggestedPushCopy, editorsPicks } from "@/lib/personalize";
import { Media } from "@/components/Media";
import { formatPrice } from "@/lib/utils";
import { getBrand } from "@/lib/brands";

export default function StyleProfilePage() {
  const hydrated = useHydrated();
  const profile = useStore((s) => s.styleProfile);
  const prefs = useStore((s) => s.notificationPrefs);
  const setNotificationPrefs = useStore((s) => s.setNotificationPrefs);
  const emails = suggestedEmailSubjects(profile);
  const pushes = suggestedPushCopy(profile);
  const picks = editorsPicks(profile, 4);

  if (!hydrated) return <div className="font-serif text-3xl">Style profile</div>;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Style profile</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Powers homepage, search rankings, Editor&apos;s Picks, emails, and push.
          </p>
        </div>
        <Link href="/onboarding" className="btn-primary">
          Retake quiz <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Style preference" value={profile.styleTags.join(", ") || "—"} />
        <Card
          title="Favorite designers"
          value={
            profile.preferredDesigners.map((id) => getBrand(id)?.name ?? id).join(", ") || "—"
          }
        />
        <Card
          title="Sizes"
          value={`Tops ${profile.sizes.tops} · Bottoms ${profile.sizes.bottoms} · Shoes ${profile.sizes.shoes}`}
        />
        <Card title="Colors" value={profile.favoriteColors.join(", ") || "—"} />
        <Card title="Budget" value={`Up to ${formatPrice(profile.budget)}`} />
        <Card title="Preferred fits" value={profile.preferredFits.join(", ") || "—"} />
        <Card title="Shopping categories" value={profile.preferredCategories.join(", ") || "—"} />
        <Card title="Sustainability" value={profile.sustainabilityPreference} />
        <Card title="Occasions" value={profile.occasions.join(", ") || "—"} />
      </div>

      <section className="rounded-2xl border border-line p-6">
        <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl">
          <Sparkles className="h-5 w-5 text-gold" /> Personalization channels
        </h2>
        <div className="space-y-3">
          {(
            [
              ["personalizeHomepage", "Personalized homepage & Editor's Picks"],
              ["emailEditorsPicks", "Editor's Picks emails"],
              ["emailNewArrivals", "New arrivals emails"],
              ["pushStyleSuggestions", "Style suggestion push notifications"],
              ["pushLowStock", "Low-stock push alerts"],
              ["pushBackInStock", "Back-in-stock push alerts"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-lg border border-line px-4 py-3 text-sm">
              {label}
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={(e) => setNotificationPrefs({ [key]: e.target.checked })}
                className="h-4 w-4 accent-gold"
              />
            </label>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-serif text-2xl">
            <Mail className="h-5 w-5 text-gold" /> Suggested emails
          </h2>
          <ul className="space-y-2">
            {emails.map((e) => (
              <li key={e} className="rounded-lg border border-line px-4 py-3 text-sm">
                {e}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-serif text-2xl">
            <Bell className="h-5 w-5 text-gold" /> Suggested push
          </h2>
          <ul className="space-y-2">
            {pushes.map((e) => (
              <li key={e} className="rounded-lg border border-line px-4 py-3 text-sm">
                {e}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h2 className="mb-4 font-serif text-2xl">Editor&apos;s Picks for you</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group">
              <Media seed={p.variants[0].images[0]} swatches={[p.variants[0].hex]} ratio="portrait" className="rounded-xl" />
              <p className="mt-2 font-serif text-lg group-hover:text-gold">{p.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-line p-4">
      <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{title}</p>
      <p className="mt-2 text-sm capitalize">{value}</p>
    </div>
  );
}
