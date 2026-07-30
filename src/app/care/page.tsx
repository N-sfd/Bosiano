"use client";

import { useState } from "react";
import { Scissors, Truck, ShieldCheck, Check } from "lucide-react";
import { careServices, carePickupSlots } from "@/lib/care";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { formatPrice, cn } from "@/lib/utils";

export default function CarePage() {
  const hydrated = useHydrated();
  const book = useStore((s) => s.bookCareService);
  const bookings = useStore((s) => s.careBookings);
  const [serviceId, setServiceId] = useState(careServices[0].id);
  const [pickup, setPickup] = useState(carePickupSlots[0]);
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState<string | null>(null);

  const service = careServices.find((s) => s.id === serviceId)!;

  return (
    <div className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow inline-flex items-center gap-2">
          <Scissors className="h-3.5 w-3.5 text-gold" /> Alterations & care
        </p>
        <h1 className="mt-3 font-serif text-5xl">Keep every piece immaculate</h1>
        <p className="mt-4 text-ink-soft">
          Tailoring, shoe repair, bag restoration, leather care, garment cleaning, and authentication —
          with optional pickup and delivery.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {careServices.map((s) => (
          <button
            key={s.id}
            onClick={() => setServiceId(s.id)}
            className={cn(
              "rounded-2xl border p-5 text-left",
              serviceId === s.id ? "border-ink bg-canvas-raised" : "border-line hover:border-ink"
            )}
          >
            <p className="font-serif text-2xl">{s.name}</p>
            <p className="mt-2 text-sm text-ink-soft">{s.description}</p>
            <p className="mt-3 text-xs uppercase tracking-luxe text-ink-muted">
              From {formatPrice(s.fromPrice)} · {s.turnaround}
              {s.pickup ? " · Pickup" : ""}
            </p>
          </button>
        ))}
      </div>

      <section className="mt-12 rounded-2xl border border-line p-6 lg:p-8">
        <h2 className="font-serif text-3xl">Book {service.name}</h2>
        <p className="mt-2 text-sm text-ink-muted">{service.description}</p>

        <p className="mt-6 eyebrow inline-flex items-center gap-2">
          <Truck className="h-3.5 w-3.5" /> Pickup & delivery
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {carePickupSlots.map((s) => (
            <button
              key={s}
              onClick={() => setPickup(s)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs",
                pickup === s ? "border-ink bg-ink text-canvas" : "border-line"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Item details, measurements, preferred finish…"
          className="mt-4 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-sm"
          rows={3}
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              book(serviceId, pickup, notes || undefined);
              setDone(service.name);
              setNotes("");
            }}
            className="btn-primary"
          >
            Schedule service
          </button>
          {service.id === "authentication" && (
            <p className="inline-flex items-center gap-2 text-sm text-ink-muted">
              <ShieldCheck className="h-4 w-4 text-gold" /> Certificate issued on completion
            </p>
          )}
        </div>
        {done && (
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-gold-deep">
            <Check className="h-4 w-4" /> {done} booked — we&apos;ll confirm pickup shortly.
          </p>
        )}
      </section>

      {hydrated && bookings.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">Your care bookings</h2>
          <div className="mt-4 space-y-3">
            {bookings.map((b) => {
              const s = careServices.find((x) => x.id === b.serviceId);
              return (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">
                      #{b.id} · {s?.name}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {b.pickupSlot} · {b.status}
                      {b.notes ? ` · ${b.notes}` : ""}
                    </p>
                  </div>
                  <span className="uppercase tracking-luxe text-ink-muted">{b.status}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
