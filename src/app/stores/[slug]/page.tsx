"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Calendar,
  DoorOpen,
  Package,
  MessageSquare,
  Receipt,
  Navigation,
  Check,
} from "lucide-react";
import { getBoutique, fittingSlots } from "@/lib/stores";
import { products } from "@/lib/products";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { formatPrice, cn } from "@/lib/utils";

export default function StoreDetailPage({ params }: { params: { slug: string } }) {
  const store = getBoutique(params.slug);
  const hydrated = useHydrated();
  const reserve = useStore((s) => s.reserveInStore);
  const bookFitting = useStore((s) => s.bookFittingRoom);
  const reservations = useStore((s) => s.storeReservations);
  const fittings = useStore((s) => s.fittingBookings);
  const styleProfile = useStore((s) => s.styleProfile);

  const [fitSlot, setFitSlot] = useState(store ? fittingSlots(store.id)[0] : "");
  const [chat, setChat] = useState<{ who: string; text: string }[]>([
    { who: "Associate", text: "Welcome — how can I help in store today?" },
  ]);
  const [msg, setMsg] = useState("");
  const [receipt, setReceipt] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const inventory = useMemo(() => {
    if (!store) return [];
    return products
      .filter((p) => p.stores.some((s) => s.id === store.id && s.stock !== "out"))
      .slice(0, 8)
      .map((p) => {
        const stock = p.stores.find((s) => s.id === store.id)?.stock ?? "out";
        return { product: p, stock };
      });
  }, [store]);

  if (!store) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="font-serif text-3xl">Store not found</h1>
        <Link href="/stores" className="btn-primary mt-6">
          Store locator
        </Link>
      </div>
    );
  }

  const slots = fittingSlots(store.id);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-canvas">
        <Media seed={store.hero} ratio="auto" className="absolute inset-0 h-full w-full opacity-60" monogram={false} />
        <div className="shell relative py-20">
          <p className="eyebrow !text-canvas/70">{store.city}</p>
          <h1 className="mt-3 font-serif text-5xl sm:text-6xl">{store.name}</h1>
          <p className="mt-3 max-w-xl text-canvas/85">{store.address}</p>
          <p className="mt-2 text-sm text-canvas/70">{store.hours}</p>
          <a href={`tel:${store.phone}`} className="mt-4 inline-flex items-center gap-2 text-sm text-gold">
            <Phone className="h-4 w-4" /> {store.phone}
          </a>
        </div>
      </section>

      <div className="shell grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-3xl">
              <Package className="h-6 w-6 text-gold" /> Store inventory
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {inventory.map(({ product, stock }) => (
                <div key={product.id} className="rounded-xl border border-line p-3">
                  <Link href={`/product/${product.slug}`} className="flex gap-3">
                    <div className="w-16 shrink-0">
                      <Media seed={product.variants[0].images[0]} ratio="portrait" className="rounded-lg" />
                    </div>
                    <div>
                      <p className="font-serif text-lg leading-tight">{product.name}</p>
                      <p className="text-sm text-ink-muted">{formatPrice(product.price)}</p>
                      <p className="mt-1 text-[0.65rem] uppercase tracking-luxe text-ink-soft">
                        {stock === "low" ? "Low stock" : "In stock"}
                      </p>
                    </div>
                  </Link>
                  <button
                    className="btn-outline mt-3 w-full !py-2"
                    onClick={() => {
                      const size = product.sizes.includes(styleProfile.sizes.tops)
                        ? styleProfile.sizes.tops
                        : product.sizes[0];
                      reserve(store.id, product.id, size);
                      setNotice(`Reserved ${product.name} · size ${size} for pickup`);
                    }}
                  >
                    Reserve in store
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-3xl">
              <DoorOpen className="h-6 w-6 text-gold" /> Book fitting room
            </h2>
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setFitSlot(s)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs",
                    fitSlot === s ? "border-ink bg-ink text-canvas" : "border-line"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              className="btn-primary mt-4"
              onClick={() => {
                bookFitting(store.id, fitSlot);
                setNotice(`Fitting room booked · ${fitSlot}`);
              }}
            >
              Confirm fitting
            </button>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-3xl">
              <Navigation className="h-6 w-6 text-gold" /> Indoor navigation
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {store.floors.map((f) => (
                <div key={f.name} className="rounded-xl border border-line p-4">
                  <p className="font-serif text-xl">{f.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">{f.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-3xl">
              <Calendar className="h-6 w-6 text-gold" /> Event calendar
            </h2>
            <div className="space-y-3">
              {store.events.map((e) => (
                <div key={e.id} className="rounded-xl border border-line p-4">
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs uppercase tracking-luxe text-ink-muted">{e.when}</p>
                  <p className="mt-1 text-sm text-ink-soft">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-line p-5">
            <h3 className="font-serif text-2xl">Services</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {store.services.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-gold" /> {s}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-gold" /> Schedule pickup
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-gold" /> Digital receipts
              </li>
            </ul>
            <button onClick={() => setReceipt(true)} className="btn-outline mt-4 w-full">
              <Receipt className="h-4 w-4" /> Email digital receipt demo
            </button>
            {receipt && (
              <p className="mt-2 text-xs text-gold-deep">Receipt sent to amelia@email.com</p>
            )}
          </div>

          <div className="rounded-2xl border border-line p-5">
            <h3 className="mb-3 flex items-center gap-2 font-serif text-2xl">
              <MessageSquare className="h-5 w-5 text-gold" /> Associate chat
            </h3>
            <div className="max-h-48 space-y-2 overflow-y-auto text-sm">
              {chat.map((m, i) => (
                <div
                  key={i}
                  className={cn("rounded-lg px-3 py-2", m.who === "You" ? "bg-ink text-canvas" : "bg-canvas-sunk")}
                >
                  <span className="text-[0.65rem] uppercase tracking-luxe opacity-70">{m.who}</span>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Ask the floor team…"
                className="flex-1 rounded-lg border border-line px-3 py-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && msg.trim()) {
                    setChat((c) => [
                      ...c,
                      { who: "You", text: msg.trim() },
                      { who: "Associate", text: "I'll check the stockroom and hold a fitting room." },
                    ]);
                    setMsg("");
                  }
                }}
              />
            </div>
          </div>

          {notice && (
            <p className="rounded-xl bg-gold/15 px-4 py-3 text-sm text-gold-deep">{notice}</p>
          )}

          {hydrated && (reservations.filter((r) => r.storeId === store.id).length > 0 ||
            fittings.filter((f) => f.storeId === store.id).length > 0) && (
            <div className="rounded-2xl border border-line p-5 text-sm">
              <p className="font-serif text-xl">Your plans here</p>
              <ul className="mt-2 space-y-1 text-ink-muted">
                {reservations
                  .filter((r) => r.storeId === store.id)
                  .map((r) => (
                    <li key={r.id}>
                      Reserve {r.id} · size {r.size}
                    </li>
                  ))}
                {fittings
                  .filter((f) => f.storeId === store.id)
                  .map((f) => (
                    <li key={f.id}>
                      Fitting {f.slot}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <Link href="/stores" className="inline-flex items-center gap-2 text-xs uppercase tracking-luxe hover:text-gold">
            <MapPin className="h-3.5 w-3.5" /> All boutiques
          </Link>
        </aside>
      </div>
    </div>
  );
}
