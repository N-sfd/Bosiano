"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Navigation, Calendar, MessageSquare } from "lucide-react";
import { boutiques } from "@/lib/stores";
import { Media } from "@/components/Media";
import { cn } from "@/lib/utils";

export default function StoresPage() {
  const [city, setCity] = useState("All");
  const [query, setQuery] = useState("");
  const cities = ["All", ...new Set(boutiques.map((b) => b.city))];

  const filtered = useMemo(() => {
    return boutiques.filter((b) => {
      if (city !== "All" && b.city !== city) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q)
      );
    });
  }, [city, query]);

  return (
    <div className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow inline-flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-gold" /> Boutiques
        </p>
        <h1 className="mt-3 font-serif text-5xl">Find a Bosiano store</h1>
        <p className="mt-4 text-ink-soft">
          Locator, inventory, reserve in store, fitting rooms, pickup, indoor maps, events, and associate chat.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="City, street, or boutique name"
          className="flex-1 rounded-lg border border-line bg-canvas px-4 py-3 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={cn(
                "rounded-full border px-3 py-2 text-xs uppercase tracking-luxe",
                city === c ? "border-ink bg-ink text-canvas" : "border-line"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {filtered.map((b) => (
          <Link
            key={b.id}
            href={`/stores/${b.slug}`}
            className="group overflow-hidden rounded-2xl border border-line transition-colors hover:border-ink"
          >
            <Media seed={b.hero} ratio="landscape" monogram={false} className="card-hover group-hover:scale-[1.02]" />
            <div className="p-5">
              <h2 className="font-serif text-3xl group-hover:text-gold">{b.name}</h2>
              <p className="mt-1 text-sm text-ink-muted">{b.address}</p>
              <p className="mt-2 text-xs uppercase tracking-luxe text-ink-soft">{b.hours}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-luxe text-ink-muted">
                <span className="inline-flex items-center gap-1">
                  <Navigation className="h-3 w-3" /> Indoor map
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {b.events.length} events
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Associate chat
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
