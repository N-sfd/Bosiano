"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Play, Plus } from "lucide-react";
import { looks, lookSourceLabels, lookTotal } from "@/lib/looks";
import type { ShopLook } from "@/lib/types";
import { Media } from "@/components/Media";
import { formatPrice, cn } from "@/lib/utils";

const filters: { id: "all" | ShopLook["source"]; label: string }[] = [
  { id: "all", label: "All sources" },
  { id: "campaign", label: "Campaigns" },
  { id: "editorial", label: "Editorials" },
  { id: "influencer", label: "Influencers" },
  { id: "runway", label: "Runway" },
  { id: "customer", label: "Customer uploads" },
];

export function LookbookGrid() {
  const [source, setSource] = useState<(typeof filters)[number]["id"]>("all");
  const list = useMemo(
    () => (source === "all" ? looks : looks.filter((l) => l.source === source)),
    [source]
  );

  return (
    <div className="shell py-10 lg:py-14">
      <div className="max-w-2xl">
        <p className="eyebrow">Shop complete outfits</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">The Lookbook</h1>
        <p className="mt-3 text-sm text-ink-soft sm:text-base">
          Shop full looks from campaigns, editorials, influencer photos, runway films, and customer uploads —
          with clickable hotspots on every piece.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setSource(f.id)}
            className={cn(
              "rounded-full px-4 py-2 text-xs uppercase tracking-luxe transition-colors",
              source === f.id ? "bg-void text-canvas" : "border border-line text-ink-soft hover:border-ink"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((look) => (
          <Link key={look.id} href={`/lookbook/${look.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-2xl">
              <Media
                seed={look.hero}
                swatches={look.swatches}
                ratio="portrait"
                label={look.title}
                className="[&_img]:duration-700 group-hover:[&_img]:scale-105"
                monogram={false}
              >
                {look.hotspots.slice(0, 3).map((h, i) => (
                  <span
                    key={h.id}
                    className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-canvas-raised/95 text-ink shadow"
                    style={{ left: `${h.x}%`, top: `${20 + i * 22}%` }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                ))}
                {look.video && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-void/70 px-2.5 py-1 text-[0.6rem] uppercase tracking-luxe text-canvas">
                    <Play className="h-3 w-3 fill-current" /> Video
                  </span>
                )}
              </Media>
            </div>
            <p className="eyebrow mt-4">{lookSourceLabels[look.source]} · {look.hotspots.length} pieces</p>
            <h2 className="mt-1 font-serif text-2xl group-hover:text-gold">{look.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{look.dek}</p>
            <p className="mt-2 text-sm">{formatPrice(lookTotal(look))} complete look</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
