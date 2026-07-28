"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, MapPin, Truck, Check, RotateCcw, Copy } from "lucide-react";
import { orders } from "@/lib/orders";
import { Media } from "@/components/Media";
import { formatPrice, cn } from "@/lib/utils";
import { StatusPill } from "@/components/account/StatusPill";

export default function OrdersPage() {
  const [open, setOpen] = useState<string | null>(orders[0]?.id ?? null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl">Orders &amp; Tracking</h1>
        <p className="mt-1 text-sm text-ink-muted">Track deliveries and review your order history.</p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => {
          const expanded = open === o.id;
          const doneSteps = o.timeline.filter((t) => t.done).length;
          const progress = (doneSteps / o.timeline.length) * 100;
          return (
            <div key={o.id} className="overflow-hidden rounded-2xl border border-line">
              <button
                onClick={() => setOpen(expanded ? null : o.id)}
                className="flex w-full items-center gap-4 p-5 text-left"
                aria-expanded={expanded}
              >
                <div className="flex -space-x-3">
                  {o.items.slice(0, 3).map((it) => (
                    <div key={it.name} className="w-14 overflow-hidden rounded-lg border-2 border-canvas-raised">
                      <Media seed={it.image} ratio="portrait" />
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">#{o.id}</p>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">
                    Ordered {o.date} · {o.items.length} items · {formatPrice(o.total)}
                  </p>
                  <p className="mt-0.5 text-xs text-gold-deep">{o.eta}</p>
                </div>
                <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", expanded && "rotate-180")} />
              </button>

              {expanded && (
                <div className="border-t border-line bg-canvas-raised p-5 lg:p-7">
                  <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    {/* timeline */}
                    <div>
                      <div className="mb-5 flex items-center justify-between rounded-xl bg-canvas p-4">
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5 text-gold" />
                          <div>
                            <p className="text-sm font-medium">Tracking number</p>
                            <p className="text-xs text-ink-muted">{o.tracking}</p>
                          </div>
                        </div>
                        <button className="btn-ghost" aria-label="Copy tracking number">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-canvas-sunk">
                        <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
                      </div>

                      <ol className="relative space-y-6 pl-6">
                        <span className="absolute left-[7px] top-1 h-[calc(100%-1rem)] w-px bg-line" />
                        {o.timeline.map((t) => (
                          <li key={t.label} className="relative">
                            <span
                              className={cn(
                                "absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2",
                                t.done ? "border-gold bg-gold text-canvas" : "border-line bg-canvas-raised"
                              )}
                            >
                              {t.done && <Check className="h-2.5 w-2.5" />}
                            </span>
                            <p className={cn("text-sm", t.done ? "font-medium text-ink" : "text-ink-muted")}>{t.label}</p>
                            <p className="text-xs text-ink-muted">{t.date}</p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* details */}
                    <div className="space-y-4">
                      <div className="rounded-xl border border-line p-4">
                        <p className="flex items-center gap-2 text-sm font-medium">
                          <MapPin className="h-4 w-4 text-ink-muted" /> Delivery address
                        </p>
                        <p className="mt-2 text-sm text-ink-soft">{o.address}</p>
                      </div>
                      <div className="space-y-3">
                        {o.items.map((it) => (
                          <div key={it.name} className="flex gap-3">
                            <div className="w-12 shrink-0 overflow-hidden rounded-lg">
                              <Media seed={it.image} ratio="portrait" />
                            </div>
                            <div className="flex-1 text-sm">
                              <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{it.brand}</p>
                              <p className="font-serif text-base leading-tight">{it.name}</p>
                              <p className="text-xs text-ink-muted">Size {it.size} · Qty {it.qty}</p>
                            </div>
                            <span className="text-sm">{formatPrice(it.price)}</span>
                          </div>
                        ))}
                      </div>
                      {o.status === "delivered" && (
                        <Link href="/account/returns" className="btn-outline w-full">
                          <RotateCcw className="h-4 w-4" /> Start a return
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
