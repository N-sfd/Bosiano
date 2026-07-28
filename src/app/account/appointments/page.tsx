"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Video,
  MessageSquare,
  LayoutGrid,
  Star,
  Check,
  X,
} from "lucide-react";
import { stylists, appointmentTypes, getStylist } from "@/lib/stylists";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { getProduct } from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

export default function AppointmentsPage() {
  const hydrated = useHydrated();
  const appointments = useStore((s) => s.appointments);
  const bookAppointment = useStore((s) => s.bookAppointment);
  const cancelAppointment = useStore((s) => s.cancelAppointment);
  const sharedBoards = useStore((s) => s.sharedBoards);
  const addToSharedBoard = useStore((s) => s.addToSharedBoard);

  const [type, setType] = useState<Appointment["type"]>("virtual");
  const [stylistId, setStylistId] = useState(stylists[0].id);
  const [slot, setSlot] = useState(stylists[0].availableSlots[0]);
  const [notes, setNotes] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [boardProduct, setBoardProduct] = useState("sculpted-wool-blazer");

  const stylist = getStylist(stylistId)!;
  const filteredStylists = useMemo(
    () => stylists.filter((s) => s.specialties.includes(type)),
    [type]
  );

  const book = () => {
    const t = appointmentTypes.find((a) => a.id === type)!;
    bookAppointment({
      title: t.label,
      when: slot,
      location: type === "in-store" ? "Bond Street atelier" : "Virtual",
      type,
      stylistId,
      notes: notes || undefined,
    });
    setNotes("");
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-4xl">Personal styling</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Book virtual or in-store sessions — stylist profiles, live availability, video, chat, and shared boards.
        </p>
      </div>

      <section className="rounded-2xl border border-line p-6">
        <h2 className="font-serif text-2xl">Book an appointment</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {appointmentTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setType(t.id);
                const next = stylists.find((s) => s.specialties.includes(t.id)) ?? stylists[0];
                setStylistId(next.id);
                setSlot(next.availableSlots[0]);
              }}
              className={cn(
                "rounded-xl border px-4 py-3 text-left",
                type === t.id ? "border-ink bg-canvas-raised" : "border-line"
              )}
            >
              <p className="text-sm font-medium">{t.label}</p>
              <p className="text-xs text-ink-muted">
                {t.copy} · {t.duration}
              </p>
            </button>
          ))}
        </div>

        <h3 className="mt-6 font-serif text-xl">Stylist profiles</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {(filteredStylists.length ? filteredStylists : stylists).map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setStylistId(s.id);
                setSlot(s.availableSlots[0]);
              }}
              className={cn(
                "flex gap-3 rounded-xl border p-3 text-left",
                stylistId === s.id ? "border-ink bg-canvas-raised" : "border-line"
              )}
            >
              <div className="w-16 shrink-0 overflow-hidden rounded-lg">
                <Media seed={s.avatar} ratio="portrait" />
              </div>
              <div>
                <p className="font-serif text-lg">{s.name}</p>
                <p className="text-xs text-ink-muted">{s.title}</p>
                <p className="mt-1 text-xs text-ink-soft">{s.bio}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-gold-deep">
                  <Star className="h-3 w-3 fill-current" /> {s.rating} · {s.languages.join(", ")}
                </p>
              </div>
            </button>
          ))}
        </div>

        <h3 className="mt-6 font-serif text-xl">Real-time availability · {stylist.name}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {stylist.availableSlots.map((s) => (
            <button
              key={s}
              onClick={() => setSlot(s)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs",
                slot === s ? "border-ink bg-ink text-canvas" : "border-line"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Occasion, sizes, budget notes…"
          className="mt-4 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-sm"
          rows={3}
        />
        <button onClick={book} className="btn-primary mt-4">
          <Calendar className="h-4 w-4" /> Book {appointmentTypes.find((a) => a.id === type)?.label}
        </button>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line p-5">
          <h2 className="mb-3 flex items-center gap-2 font-serif text-2xl">
            <Video className="h-5 w-5 text-gold" /> Video consultation
          </h2>
          <button onClick={() => setVideoOpen((v) => !v)} className="btn-outline">
            {videoOpen ? "End demo call" : "Start demo video room"}
          </button>
          {videoOpen && (
            <div className="relative mt-4 overflow-hidden rounded-xl bg-ink">
              <Media seed={stylist.avatar} ratio="landscape" monogram={false} className="opacity-70" />
              <p className="absolute bottom-3 left-3 text-xs uppercase tracking-luxe text-canvas">
                Connected with {stylist.name}
              </p>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-line p-5">
          <h2 className="mb-3 flex items-center gap-2 font-serif text-2xl">
            <MessageSquare className="h-5 w-5 text-gold" /> Stylist chat
          </h2>
          <button onClick={() => setChatOpen((v) => !v)} className="btn-outline">
            {chatOpen ? "Close chat" : "Open chat"}
          </button>
          {chatOpen && (
            <div className="mt-4 space-y-2 text-sm">
              <div className="rounded-lg bg-canvas-sunk px-3 py-2">
                <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{stylist.name}</p>
                <p>I’ve pulled three coats for your budget — see the shared board.</p>
              </div>
              <div className="rounded-lg bg-ink px-3 py-2 text-canvas">
                <p className="text-[0.65rem] uppercase tracking-luxe opacity-70">You</p>
                <p>Love the camel — can we add a tote?</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-line p-5">
        <h2 className="mb-3 flex items-center gap-2 font-serif text-2xl">
          <LayoutGrid className="h-5 w-5 text-gold" /> Shared product boards
        </h2>
        <div className="mb-4 flex flex-wrap gap-2">
          <select
            value={boardProduct}
            onChange={(e) => setBoardProduct(e.target.value)}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          >
            {["sculpted-wool-blazer", "structured-leather-tote", "fluid-silk-slip-dress", "architectural-trench-coat"].map(
              (id) => (
                <option key={id} value={id}>
                  {getProduct(id)?.name ?? id}
                </option>
              )
            )}
          </select>
          <button
            onClick={() => addToSharedBoard("Autumn work edit", boardProduct, appointments[0]?.id)}
            className="btn-outline !py-2"
          >
            Add to board
          </button>
        </div>
        {(hydrated ? sharedBoards : []).map((b) => (
          <div key={b.id} className="mb-4">
            <p className="text-sm font-medium">{b.title}</p>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {b.productIds.map((id) => {
                const p = getProduct(id);
                if (!p) return null;
                return (
                  <Link key={id} href={`/product/${p.slug}`} className="group">
                    <Media seed={p.variants[0].images[0]} ratio="portrait" className="rounded-lg" />
                    <p className="mt-1 truncate text-xs group-hover:text-gold">{p.name}</p>
                    <p className="text-[0.65rem] text-ink-muted">{formatPrice(p.price)}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl">Appointment history</h2>
        <div className="space-y-3">
          {(hydrated ? appointments : []).map((a) => {
            const s = getStylist(a.stylistId);
            return (
              <div key={a.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-line p-4">
                <div className="flex-1">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-ink-muted">
                    {a.when} · {a.location} · {s?.name ?? "Stylist"} · {a.status}
                  </p>
                  {a.notes && <p className="mt-1 text-xs text-ink-soft">{a.notes}</p>}
                </div>
                {a.status === "upcoming" ? (
                  <button onClick={() => cancelAppointment(a.id)} className="btn-ghost text-ink-muted">
                    <X className="h-4 w-4" /> Cancel
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs uppercase tracking-luxe text-ink-muted">
                    <Check className="h-3.5 w-3.5" /> {a.status}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
