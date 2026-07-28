"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Sparkles, Send, User, Bot } from "lucide-react";
import { runStylist, stylistPrompts, defaultStyleProfile } from "@/lib/stylist";
import type { StylistReply } from "@/lib/stylist";
import { brands } from "@/lib/brands";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { formatPrice, cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  reply?: StylistReply;
}

export function StylistChat({ initialLookSlug }: { initialLookSlug?: string }) {
  const hydrated = useHydrated();
  const wishlist = useStore((s) => s.wishlist);
  const recentlyViewed = useStore((s) => s.recentlyViewed);
  const styleProfile = useStore((s) => s.styleProfile);
  const updateStyleProfile = useStore((s) => s.updateStyleProfile);
  const addToCart = useStore((s) => s.addToCart);

  const profile = hydrated ? styleProfile : defaultStyleProfile;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: initialLookSlug
        ? `I've loaded context from your look. Ask me to restyle it, find cheaper swaps, or build something new for ${defaultStyleProfile.location}.`
        : "I'm your Bosianos stylist. Ask me to build outfits from your sizes, designers, colors, wishlist, browsing, and purchases.",
    },
  ]);

  const contextNote = useMemo(() => {
    const designers = profile.preferredDesigners
      .map((id) => brands.find((b) => b.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
    return `${profile.location} · ${profile.climate} · budget $${profile.budget} · sizes ${profile.sizes.tops}/${profile.sizes.bottoms} · ${designers}`;
  }, [profile]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: q };
    const reply = runStylist(q, profile, { wishlist, recentlyViewed });
    const assistantMsg: Message = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: reply.message,
      reply,
    };
    setMessages((m) => [...m, userMsg, assistantMsg]);
    setInput("");
  };

  const addOutfit = (reply: StylistReply) => {
    reply.outfit.forEach(({ product }) => {
      const size =
        product.sizes.find((s) => s === profile.sizes.tops || s === profile.sizes.bottoms) || product.sizes[0];
      if (!size) return;
      addToCart({
        productId: product.id,
        variantId: product.variants[0].id,
        size,
        quantity: 1,
      });
    });
  };

  return (
    <div className="shell py-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div>
            <p className="eyebrow inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> AI Personal Stylist
            </p>
            <h1 className="mt-2 font-serif text-3xl">Your style profile</h1>
            <p className="mt-2 text-xs text-ink-muted">{contextNote}</p>
          </div>

          <div className="rounded-xl border border-line p-4 space-y-3">
            <label className="block text-xs uppercase tracking-luxe text-ink-muted">
              Budget
              <input
                type="number"
                value={profile.budget}
                onChange={(e) => updateStyleProfile({ budget: Number(e.target.value) || 0 })}
                className="mt-1 w-full border border-line bg-canvas px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
            </label>
            <label className="block text-xs uppercase tracking-luxe text-ink-muted">
              Location
              <input
                value={profile.location}
                onChange={(e) => updateStyleProfile({ location: e.target.value })}
                className="mt-1 w-full border border-line bg-canvas px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
            </label>
            <label className="block text-xs uppercase tracking-luxe text-ink-muted">
              Climate
              <select
                value={profile.climate}
                onChange={(e) => updateStyleProfile({ climate: e.target.value })}
                className="mt-1 w-full border border-line bg-canvas px-3 py-2 text-sm focus:border-ink focus:outline-none"
              >
                {["cool", "mild", "warm", "humid"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["tops", "bottoms", "shoes"] as const).map((key) => (
                <label key={key} className="block text-xs uppercase tracking-luxe text-ink-muted">
                  {key}
                  <input
                    value={profile.sizes[key]}
                    onChange={(e) => updateStyleProfile({ sizes: { ...profile.sizes, [key]: e.target.value } })}
                    className="mt-1 w-full border border-line bg-canvas px-2 py-2 text-sm focus:border-ink focus:outline-none"
                  />
                </label>
              ))}
            </div>
            <p className="text-[0.7rem] text-ink-muted">
              Also using wishlist ({wishlist.length}), browsing history ({recentlyViewed.length}), and purchase history.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-2">Try asking</p>
            <div className="flex flex-col gap-2">
              {stylistPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-lg border border-line px-3 py-2 text-left text-xs text-ink-soft hover:border-ink hover:text-ink"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <Link href="/lookbook" className="link-underline text-xs uppercase tracking-luxe">
            Browse shoppable looks
          </Link>
        </aside>

        <div className="flex min-h-[70vh] flex-col rounded-2xl border border-line bg-canvas-raised">
          <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    m.role === "assistant" ? "bg-gold/20 text-gold-deep" : "bg-ink text-canvas"
                  )}
                >
                  {m.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </span>
                <div className={cn("max-w-[90%] space-y-3", m.role === "user" && "text-right")}>
                  <p
                    className={cn(
                      "inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.role === "assistant" ? "bg-canvas-sunk text-left" : "bg-ink text-canvas"
                    )}
                  >
                    {m.text}
                  </p>
                  {m.reply && m.reply.outfit.length > 0 && (
                    <div className="rounded-xl border border-line bg-canvas p-4 text-left">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-luxe text-ink-muted">
                          Suggested outfit · {formatPrice(m.reply.total)}
                        </p>
                        <button onClick={() => addOutfit(m.reply!)} className="btn-outline !py-2 !text-[0.65rem]">
                          Add look to bag
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {m.reply.outfit.map(({ role, product }) => (
                          <Link key={product.id} href={`/product/${product.slug}`} className="group">
                            <Media
                              seed={product.variants[0].images[0]}
                              swatches={[product.variants[0].hex]}
                              ratio="portrait"
                              className="rounded-lg"
                              sizes="140px"
                            />
                            <p className="mt-1 text-[0.6rem] uppercase tracking-luxe text-ink-muted">{role}</p>
                            <p className="font-serif text-sm leading-tight group-hover:text-gold">{product.name}</p>
                            <p className="text-xs">{formatPrice(product.price)}</p>
                          </Link>
                        ))}
                      </div>
                      {m.reply.tips.length > 0 && (
                        <ul className="mt-3 space-y-1 text-xs text-ink-soft">
                          {m.reply.tips.map((t) => (
                            <li key={t}>— {t}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-line p-4">
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={2}
                placeholder="Ask your stylist…"
                className="w-full resize-none border border-line bg-canvas px-4 py-3 text-sm focus:border-ink focus:outline-none"
              />
              <button className="btn-primary !px-4" onClick={() => send(input)} disabled={!input.trim()} aria-label="Send">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
