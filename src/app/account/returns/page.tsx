"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Printer,
  PackageCheck,
  Upload,
  Truck,
  CreditCard,
} from "lucide-react";
import { orders } from "@/lib/orders";
import { Media } from "@/components/Media";
import { formatPrice, cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import type { ReturnRequest } from "@/lib/types";

const reasons = ["Too small", "Too large", "Not as described", "Changed my mind", "Faulty / damaged", "Arrived late"];
const resolutions = [
  { id: "refund" as const, label: "Refund", copy: "Back to original payment in 3–5 days" },
  { id: "exchange" as const, label: "Exchange", copy: "Swap size or colour" },
  { id: "credit" as const, label: "Store credit", copy: "Instant credit + 10% bonus where eligible" },
];
const refundMethods = [
  { id: "original" as const, label: "Original payment" },
  { id: "credit" as const, label: "Store credit" },
  { id: "gift-card" as const, label: "Gift card" },
];
const pickupSlots = ["Tomorrow 09:00–12:00", "Tomorrow 13:00–17:00", "Thu 30 Jul 09:00–12:00", "Drop off myself"];
const sizes = ["XS", "S", "M", "L", "XL"];
const colors = ["Black", "Camel", "Ivory", "Navy", "Blush"];

const returnable = orders.filter((o) => o.status === "delivered");

export default function ReturnsPage() {
  const hydrated = useHydrated();
  const returns = useStore((s) => s.returns);
  const submitReturn = useStore((s) => s.submitReturn);
  const scheduleReturnPickup = useStore((s) => s.scheduleReturnPickup);
  const storeCredit = useStore((s) => s.storeCredit);

  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState<string | null>(null);
  const [resolution, setResolution] = useState<"refund" | "exchange" | "credit">("refund");
  const [exchangeSize, setExchangeSize] = useState("M");
  const [exchangeColor, setExchangeColor] = useState("Black");
  const [photos, setPhotos] = useState<string[]>([]);
  const [refundMethod, setRefundMethod] = useState<"original" | "credit" | "gift-card">("original");
  const [pickup, setPickup] = useState(pickupSlots[0]);
  const [confirmed, setConfirmed] = useState<ReturnRequest | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const order = returnable.find((o) => o.id === orderId);
  const steps = ["Order", "Items", "Details", "Label & pickup", "Done"];
  const activeReturn = useMemo(
    () => (hydrated ? returns.find((r) => r.id === trackingId) ?? confirmed : null),
    [hydrated, returns, trackingId, confirmed]
  );

  const toggleItem = (name: string) =>
    setSelectedItems((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));

  const addPhoto = () => {
    const label = `Photo ${photos.length + 1}`;
    setPhotos((p) => [...p, label].slice(0, 4));
  };

  const canNext =
    (step === 0 && orderId) ||
    (step === 1 && selectedItems.length > 0) ||
    (step === 2 && reason) ||
    step === 3;

  const submit = () => {
    if (!orderId || !reason) return;
    const ret = submitReturn({
      orderId,
      itemNames: selectedItems,
      reason,
      resolution,
      exchangeSize: resolution === "exchange" ? exchangeSize : undefined,
      exchangeColor: resolution === "exchange" ? exchangeColor : undefined,
      photos,
      refundMethod: resolution === "refund" ? refundMethod : "credit",
      pickupScheduled: pickup === "Drop off myself" ? undefined : pickup,
      creditAmount: undefined,
    });
    setConfirmed(ret);
    setTrackingId(ret.id);
    setStep(4);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl">Returns &amp; Exchanges</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Start a return, exchange size/colour, upload photos, schedule pickup, and track status.
          {hydrated && <> Store credit balance: {formatPrice(storeCredit)}.</>}
        </p>
      </div>

      {hydrated && returns.length > 0 && step === 0 && (
        <section className="rounded-2xl border border-line p-5">
          <h2 className="font-serif text-2xl">Track a return</h2>
          <div className="mt-3 space-y-2">
            {returns.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setTrackingId(r.id);
                  setConfirmed(r);
                  setStep(4);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 text-left text-sm hover:border-ink"
              >
                <span>
                  #{r.id} · Order {r.orderId}
                </span>
                <span className="uppercase tracking-luxe text-ink-muted">{r.status}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
                i < step ? "bg-gold text-void" : i === step ? "bg-void text-canvas" : "bg-canvas-sunk text-ink-muted"
              )}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={cn("hidden text-xs lg:block", i === step ? "text-ink" : "text-ink-muted")}>{s}</span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-line" />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-line p-6 lg:p-8">
        {step === 0 && (
          <div className="space-y-3">
            <p className="eyebrow">Which order would you like to return?</p>
            {returnable.map((o) => (
              <button
                key={o.id}
                onClick={() => setOrderId(o.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                  orderId === o.id ? "border-ink bg-canvas-raised" : "border-line hover:border-ink"
                )}
              >
                <div className="flex -space-x-3">
                  {o.items.map((it) => (
                    <div key={it.name} className="w-12 overflow-hidden rounded-lg border-2 border-canvas-raised">
                      <Media seed={it.image} ratio="portrait" />
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">#{o.id}</p>
                  <p className="text-xs text-ink-muted">Delivered · {o.items.length} items</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && order && (
          <div className="space-y-3">
            <p className="eyebrow">Select items</p>
            {order.items.map((it) => (
              <button
                key={it.name}
                onClick={() => toggleItem(it.name)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl border p-4 text-left",
                  selectedItems.includes(it.name) ? "border-ink bg-canvas-raised" : "border-line"
                )}
              >
                <div className="w-14 overflow-hidden rounded-lg">
                  <Media seed={it.image} ratio="portrait" />
                </div>
                <div className="flex-1">
                  <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{it.brand}</p>
                  <p className="font-serif text-lg leading-tight">{it.name}</p>
                  <p className="text-xs text-ink-muted">
                    Size {it.size} · {formatPrice(it.price)}
                  </p>
                </div>
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md border",
                    selectedItems.includes(it.name) ? "border-ink bg-void text-canvas" : "border-line"
                  )}
                >
                  {selectedItems.includes(it.name) && <Check className="h-3 w-3" />}
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="eyebrow mb-3">Reason</p>
              <div className="flex flex-wrap gap-2">
                {reasons.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm",
                      reason === r ? "border-ink bg-void text-canvas" : "border-line"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3">Resolution</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {resolutions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setResolution(r.id)}
                    className={cn(
                      "rounded-xl border p-4 text-left",
                      resolution === r.id ? "border-ink bg-canvas-raised" : "border-line"
                    )}
                  >
                    <p className="text-sm font-medium">{r.label}</p>
                    <p className="mt-1 text-xs text-ink-muted">{r.copy}</p>
                  </button>
                ))}
              </div>
            </div>
            {resolution === "exchange" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1.5 block text-[0.7rem] uppercase tracking-luxe text-ink-muted">New size</span>
                  <select value={exchangeSize} onChange={(e) => setExchangeSize(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2">
                    {sizes.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-[0.7rem] uppercase tracking-luxe text-ink-muted">New colour</span>
                  <select value={exchangeColor} onChange={(e) => setExchangeColor(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2">
                    {colors.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {resolution === "refund" && (
              <div>
                <p className="eyebrow mb-3">Refund method</p>
                <div className="flex flex-wrap gap-2">
                  {refundMethods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setRefundMethod(m.id)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm",
                        refundMethod === m.id ? "border-ink bg-void text-canvas" : "border-line"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="eyebrow mb-3">Upload photos</p>
              <div className="flex flex-wrap gap-2">
                {photos.map((p) => (
                  <span key={p} className="rounded-lg border border-line bg-canvas-sunk px-3 py-2 text-xs">
                    {p}
                  </span>
                ))}
                <button onClick={addPhoto} className="btn-outline !py-2">
                  <Upload className="h-4 w-4" /> Add photo
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <p className="eyebrow">Generate label &amp; schedule pickup</p>
            <div className="rounded-xl border border-line p-4 text-sm">
              <p className="font-medium">Prepaid return label ready on confirm</p>
              <p className="mt-1 text-ink-muted">Partner drop-off or scheduled courier pickup within 14 days.</p>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-luxe text-ink-muted">
                <Truck className="h-3.5 w-3.5" /> Pickup
              </p>
              <div className="flex flex-wrap gap-2">
                {pickupSlots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setPickup(s)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs",
                      pickup === s ? "border-ink bg-void text-canvas" : "border-line"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {resolution === "credit" && (
              <p className="inline-flex items-center gap-2 rounded-lg bg-gold/15 px-3 py-2 text-sm text-gold-deep">
                <CreditCard className="h-4 w-4" /> Instant store credit issued on confirmation (eligible).
              </p>
            )}
          </div>
        )}

        {step === 4 && activeReturn && (
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#3a4a3b] text-ink">
              <PackageCheck className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-serif text-3xl">Return #{activeReturn.id}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Label {activeReturn.labelId} generated.
              {activeReturn.creditAmount
                ? ` Instant store credit of ${formatPrice(activeReturn.creditAmount)} applied.`
                : ""}
            </p>
            <div className="mx-auto mt-6 max-w-md space-y-3 text-left">
              {activeReturn.timeline.map((t) => (
                <div key={t.label} className="flex items-start gap-3 text-sm">
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full",
                      t.done ? "bg-gold text-void" : "bg-canvas-sunk text-ink-muted"
                    )}
                  >
                    {t.done ? <Check className="h-3 w-3" /> : null}
                  </span>
                  <div>
                    <p className="font-medium">{t.label}</p>
                    {t.at && <p className="text-xs text-ink-muted">{t.at}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button className="btn-primary">
                <Printer className="h-4 w-4" /> Print return label
              </button>
              {!activeReturn.pickupScheduled && (
                <button
                  className="btn-outline"
                  onClick={() => scheduleReturnPickup(activeReturn.id, "Tomorrow 09:00–12:00")}
                >
                  Schedule pickup
                </button>
              )}
              <button
                className="btn-ghost"
                onClick={() => {
                  setStep(0);
                  setConfirmed(null);
                  setTrackingId(null);
                  setSelectedItems([]);
                  setPhotos([]);
                }}
              >
                Start another
              </button>
            </div>
          </div>
        )}

        {step < 4 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-ghost disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => {
                if (step === 3) submit();
                else if (canNext) setStep((s) => s + 1);
              }}
              disabled={!canNext}
              className="btn-primary"
            >
              {step === 3 ? (
                <>
                  <RotateCcw className="h-4 w-4" /> Confirm return
                </>
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
