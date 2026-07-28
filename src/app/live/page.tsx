"use client";

import Link from "next/link";
import { Radio, Play, Bookmark, Users } from "lucide-react";
import { liveEvents } from "@/lib/live";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function LiveShoppingPage() {
  const hydrated = useHydrated();
  const saved = useStore((s) => s.savedLiveEvents);
  const toggleSave = useStore((s) => s.toggleSaveLiveEvent);
  const live = liveEvents.filter((e) => e.status === "live");
  const upcoming = liveEvents.filter((e) => e.status === "upcoming");
  const replays = liveEvents.filter((e) => e.status === "replay");

  return (
    <div className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow inline-flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-gold" /> Live shopping
        </p>
        <h1 className="mt-3 font-serif text-5xl">Watch. Ask. Shop.</h1>
        <p className="mt-4 text-ink-soft">
          Designers and stylists go live — ask questions, add featured products to your bag, save events, and replay later.
        </p>
      </div>

      {live.map((event) => (
        <Link
          key={event.id}
          href={`/live/${event.slug}`}
          className="group relative mt-12 block overflow-hidden rounded-2xl"
        >
          <Media seed={event.hero} ratio="wide" className="min-h-[320px]" monogram={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-canvas">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#b33] px-3 py-1 text-[0.65rem] uppercase tracking-luxe">
              <span className="h-2 w-2 animate-pulse rounded-full bg-canvas" /> Live now · {event.viewers?.toLocaleString()} watching
            </span>
            <h2 className="mt-3 font-serif text-4xl group-hover:text-gold">{event.title}</h2>
            <p className="mt-2 text-canvas/85">
              {event.host} · {event.hostRole}
            </p>
          </div>
        </Link>
      ))}

      <section className="mt-14">
        <h2 className="font-serif text-3xl">Upcoming</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {upcoming.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              saved={hydrated && saved.includes(event.id)}
              onSave={() => toggleSave(event.id)}
            />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-3xl">Replay previous sessions</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {replays.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              saved={hydrated && saved.includes(event.id)}
              onSave={() => toggleSave(event.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function EventCard({
  event,
  saved,
  onSave,
}: {
  event: (typeof liveEvents)[0];
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <Link href={`/live/${event.slug}`} className="group block">
        <div className="relative">
          <Media seed={event.hero} ratio="landscape" monogram={false} />
          <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.6rem] uppercase tracking-luxe text-canvas">
            {event.status === "upcoming" ? "Upcoming" : "Replay"}
          </span>
          {event.status === "replay" && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas/90">
                <Play className="h-5 w-5 fill-current" />
              </span>
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-serif text-2xl leading-tight group-hover:text-gold">{event.title}</h3>
          <p className="mt-2 text-sm text-ink-muted">
            {event.host} · {new Date(event.startsAt).toLocaleString()} · {event.durationMin} min
          </p>
          {event.viewers && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-muted">
              <Users className="h-3 w-3" /> {event.viewers.toLocaleString()} viewers
            </p>
          )}
        </div>
      </Link>
      <div className="border-t border-line px-5 py-3">
        <button
          onClick={onSave}
          className={cn(
            "inline-flex items-center gap-2 text-xs uppercase tracking-luxe",
            saved ? "text-gold-deep" : "text-ink-muted hover:text-ink"
          )}
        >
          <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />
          {saved ? "Saved" : "Save event"}
        </button>
      </div>
    </div>
  );
}
