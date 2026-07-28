"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Radio, Send, ShoppingBag, Bookmark, Play, MessageCircle } from "lucide-react";
import { getLiveEvent } from "@/lib/live";
import { getProduct } from "@/lib/products";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { formatPrice, cn } from "@/lib/utils";
import { getBrand } from "@/lib/brands";

export default function LiveEventPage({ params }: { params: { slug: string } }) {
  const event = getLiveEvent(params.slug);
  const hydrated = useHydrated();
  const addToCart = useStore((s) => s.addToCart);
  const saved = useStore((s) => s.savedLiveEvents);
  const toggleSave = useStore((s) => s.toggleSaveLiveEvent);
  const styleProfile = useStore((s) => s.styleProfile);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([
    { who: "Host", text: `Welcome — ask anything about today's edit.` },
    { who: "Guest", text: "Does the blazer run true to size?" },
    { who: "Host", text: "Yes — stay true for regular, size up for layering." },
  ]);
  const [added, setAdded] = useState<string | null>(null);

  const products = useMemo(
    () => (event ? event.productIds.map((id) => getProduct(id)).filter(Boolean) : []),
    [event]
  );

  if (!event) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="font-serif text-3xl">Event not found</h1>
        <Link href="/live" className="btn-primary mt-6">
          Back to live shopping
        </Link>
      </div>
    );
  }

  const isSaved = hydrated && saved.includes(event.id);
  const brand = event.designerId ? getBrand(event.designerId) : null;

  const ask = () => {
    if (!question.trim()) return;
    setChat((c) => [...c, { who: "You", text: question.trim() }]);
    setQuestion("");
    setTimeout(() => {
      setChat((c) => [
        ...c,
        { who: "Host", text: "Great question — we'll style that next and pin the product." },
      ]);
    }, 800);
  };

  const bagIt = (productId: string) => {
    const p = getProduct(productId);
    if (!p) return;
    const size =
      p.sizes.find((s) => s === styleProfile.sizes.tops || s === styleProfile.sizes.bottoms) ||
      p.sizes[0];
    addToCart({
      productId: p.id,
      variantId: p.variants[0].id,
      size,
      quantity: 1,
    });
    setAdded(p.name);
    setTimeout(() => setAdded(null), 2000);
  };

  return (
    <div className="shell py-8 lg:py-12">
      <Link href="/live" className="text-xs uppercase tracking-luxe text-ink-muted hover:text-ink">
        ← All live events
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="relative overflow-hidden rounded-2xl bg-ink">
            <Media seed={event.hero} ratio="wide" monogram={false} className="opacity-85" />
            <div className="absolute inset-0 flex items-center justify-center">
              {event.status === "live" ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#b33] px-4 py-2 text-xs uppercase tracking-luxe text-canvas">
                  <Radio className="h-3.5 w-3.5" /> Live
                </span>
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-canvas/90">
                  <Play className="h-6 w-6 fill-current" />
                </span>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-canvas">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl">{event.title}</h1>
                <p className="mt-1 text-sm text-canvas/80">
                  {event.host} · {event.hostRole}
                  {brand ? ` · ${brand.name}` : ""}
                </p>
              </div>
              <button
                onClick={() => toggleSave(event.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full bg-canvas/15 px-3 py-2 text-xs uppercase tracking-luxe backdrop-blur",
                  isSaved && "text-gold"
                )}
              >
                <Bookmark className={cn("h-3.5 w-3.5", isSaved && "fill-current")} />
                {isSaved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
          <p className="mt-4 text-ink-soft">{event.description}</p>
          {added && (
            <p className="mt-3 text-sm text-gold-deep">
              <ShoppingBag className="mr-1 inline h-4 w-4" /> {added} added to bag
            </p>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-line p-5">
            <h2 className="mb-3 flex items-center gap-2 font-serif text-2xl">
              <MessageCircle className="h-5 w-5 text-gold" /> Live Q&A
            </h2>
            <div className="max-h-56 space-y-2 overflow-y-auto text-sm">
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
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                placeholder="Ask the host…"
                className="flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-sm"
              />
              <button onClick={ask} className="btn-primary !px-3" aria-label="Send">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-line p-5">
            <h2 className="mb-3 font-serif text-2xl">Featured products</h2>
            <div className="space-y-3">
              {products.map((p) =>
                p ? (
                  <div key={p.id} className="flex gap-3">
                    <Link href={`/product/${p.slug}`} className="w-16 shrink-0">
                      <Media
                        seed={p.variants[0].images[0]}
                        swatches={[p.variants[0].hex]}
                        ratio="portrait"
                        className="rounded-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/product/${p.slug}`} className="font-serif text-lg leading-tight hover:text-gold">
                        {p.name}
                      </Link>
                      <p className="text-sm text-ink-muted">{formatPrice(p.price)}</p>
                      <button
                        onClick={() => bagIt(p.id)}
                        className="mt-1 text-xs uppercase tracking-luxe text-gold-deep"
                      >
                        Add to bag
                      </button>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
