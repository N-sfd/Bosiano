"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import {
  aiReply,
  selectConciergeProduct,
  type ConciergeContext,
  type ConciergeProductCard,
} from "@/lib/concierge";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { tierForPoints } from "@/lib/club";
import { cn } from "@/lib/utils";

type Msg = {
  role: "user" | "ai";
  text: string;
  products?: ConciergeProductCard[];
  shopHref?: string;
};

function ProductCards({
  products,
  onSelect,
}: {
  products: ConciergeProductCard[];
  onSelect: (slug: string) => void;
}) {
  return (
    <ul className="mt-2 space-y-2">
      {products.map((p) => (
        <li key={p.id}>
          <div className="flex gap-2 rounded-lg border border-line/60 bg-canvas-raised p-2 transition-colors hover:border-gold/50">
            <button
              type="button"
              onClick={() => onSelect(p.slug)}
              className="flex min-w-0 flex-1 gap-2 text-left"
              aria-label={`Select ${p.name}`}
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-canvas-sunk">
                {p.thumbnail ? (
                  <Image src={p.thumbnail} alt="" fill className="object-cover" sizes="48px" />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-ink">{p.name}</span>
                <span className="block text-[0.65rem] text-ink-muted">
                  {p.brand} · {p.priceLabel}
                </span>
                <span className="block text-[0.65rem] text-ink-soft">
                  {p.availability}
                  {p.colors.length ? ` · ${p.colors.slice(0, 3).join(", ")}` : ""}
                </span>
              </span>
            </button>
            <Link
              href={p.href}
              className="self-center shrink-0 text-[0.6rem] uppercase tracking-luxe text-gold hover:underline"
            >
              View
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ConciergeWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Concierge AI here — or tap Support for every channel." },
  ]);
  const ctxRef = useRef<ConciergeContext>({});
  const hydrated = useHydrated();
  const points = useStore((s) => s.loyaltyPoints);
  const isPC = hydrated && tierForPoints(points).id === "private-client";

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    const reply = aiReply(q, !!isPC, ctxRef.current);
    ctxRef.current = reply.context;
    setMsgs((m) => [
      ...m,
      { role: "user", text: q },
      {
        role: "ai",
        text: reply.text,
        products: reply.products,
        shopHref: reply.shopHref,
      },
    ]);
    setInput("");
  };

  const onSelectProduct = (slug: string) => {
    const reply = selectConciergeProduct(ctxRef.current, slug);
    ctxRef.current = reply.context;
    setMsgs((m) => [
      ...m,
      {
        role: "ai",
        text: reply.text,
        products: reply.products,
      },
    ]);
  };

  return (
    <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-[85] lg:bottom-6 lg:right-6">
      {open && (
        <div className="mb-3 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-line bg-canvas-raised shadow-xl">
          <div className="flex items-center justify-between border-b border-line bg-void px-4 py-3 text-ink">
            <span className="inline-flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4 text-gold" /> Concierge
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-56 space-y-2 overflow-y-auto p-3 text-sm">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg px-3 py-2",
                  m.role === "user" ? "ml-6 bg-void text-canvas" : "mr-6 bg-canvas-sunk"
                )}
              >
                {m.text}
                {m.products && m.products.length > 0 ? (
                  <ProductCards products={m.products} onSelect={onSelectProduct} />
                ) : null}
                {m.shopHref ? (
                  <Link
                    href={m.shopHref}
                    className="mt-2 inline-block text-[0.65rem] uppercase tracking-luxe text-gold hover:underline"
                  >
                    Browse collection →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-line p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask…"
              className="flex-1 rounded-lg border border-line px-3 py-2 text-sm"
            />
            <button onClick={send} className="btn-primary !px-3" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <Link
            href="/support"
            className="block border-t border-line px-4 py-2 text-center text-xs uppercase tracking-luxe hover:text-gold"
          >
            Full support hub
          </Link>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-void text-canvas shadow-lg hover:bg-gold"
        aria-label="Open concierge"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
