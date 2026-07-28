"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Lock,
  Truck,
  Zap,
  Check,
  Tag,
  ShoppingBag,
  PartyPopper,
  Gift,
  MapPin,
  CreditCard,
  Store,
  Calendar,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { resolveCart, cartSubtotal, FREE_SHIP_THRESHOLD } from "@/lib/cart";
import { getBrand } from "@/lib/brands";
import { Media } from "@/components/Media";
import { ExpressPayButtons } from "@/components/checkout/ExpressPayButtons";
import { formatPrice, cn } from "@/lib/utils";
import { pointsEarned, tierForPoints } from "@/lib/club";

const shippingOptions = [
  { id: "express", label: "Express", copy: "1–2 business days", price: 0, icon: Zap },
  { id: "standard", label: "Standard", copy: "2–4 business days", price: 0, icon: Truck },
  { id: "nextday", label: "Next Day", copy: "Order before 2pm", price: 25, icon: Zap },
  { id: "pickup", label: "Store pickup", copy: "Bond Street · ready in 2 hrs", price: 0, icon: Store },
];

const deliveryDates = ["Thu 30 Jul", "Fri 31 Jul", "Sat 1 Aug", "Mon 3 Aug"];

export default function CheckoutPage() {
  const cart = useStore((s) => s.cart);
  const clearCart = useStore((s) => s.clearCart);
  const addPoints = useStore((s) => s.addPoints);
  const loyaltyPoints = useStore((s) => s.loyaltyPoints);
  const giftCardBalance = useStore((s) => s.giftCardBalance);
  const storeCredit = useStore((s) => s.storeCredit);
  const applyGiftCard = useStore((s) => s.applyGiftCard);
  const applyStoreCredit = useStore((s) => s.applyStoreCredit);
  const redeemPoints = useStore((s) => s.redeemPoints);
  const savedAddresses = useStore((s) => s.savedAddresses);
  const savedPayments = useStore((s) => s.savedPayments);
  const giftWrap = useStore((s) => s.checkoutGiftWrap);
  const giftMessage = useStore((s) => s.checkoutGiftMessage);
  const setCheckoutGift = useStore((s) => s.setCheckoutGift);
  const hydrated = useHydrated();

  const [guest, setGuest] = useState(true);
  const [shipping, setShipping] = useState("express");
  const [deliveryDate, setDeliveryDate] = useState(deliveryDates[0]);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [useGiftCard, setUseGiftCard] = useState(false);
  const [useCredit, setUseCredit] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [digitalReceipt, setDigitalReceipt] = useState(true);
  const [placed, setPlaced] = useState(false);
  const [earned, setEarned] = useState(0);

  const lines = hydrated ? resolveCart(cart) : [];
  const subtotal = hydrated ? cartSubtotal(cart) : 0;
  const shipCost = shippingOptions.find((s) => s.id === shipping)?.price ?? 0;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const giftWrapFee = giftWrap ? 12 : 0;
  const tax = Math.round((subtotal - discount + giftWrapFee) * 0.08);
  const pointsRedeemValue = usePoints ? Math.min(Math.floor(loyaltyPoints / 100), Math.round(subtotal * 0.2)) : 0;
  const giftApplied = useGiftCard ? Math.min(giftCardBalance, subtotal) : 0;
  const creditApplied = useCredit ? Math.min(storeCredit, subtotal) : 0;
  const total = Math.max(0, subtotal - discount - pointsRedeemValue - giftApplied - creditApplied + shipCost + tax + giftWrapFee);
  const points = pointsEarned(Math.max(subtotal - discount, 0), loyaltyPoints);
  const tier = tierForPoints(loyaltyPoints);
  const defaultAddress = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0];
  const defaultPayment = savedPayments.find((p) => p.isDefault) ?? savedPayments[0];

  const placeOrder = () => {
    if (useGiftCard && giftApplied > 0) applyGiftCard(giftApplied);
    if (useCredit && creditApplied > 0) applyStoreCredit(creditApplied);
    if (usePoints && pointsRedeemValue > 0) redeemPoints(pointsRedeemValue * 100, "Checkout redemption");
    addPoints(points, "Order reward");
    setEarned(points);
    clearCart();
    setPlaced(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) {
    return (
      <div className="shell flex flex-col items-center justify-center py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3a4a3b] text-canvas">
          <PartyPopper className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-serif text-4xl">Thank you for your order</h1>
        <p className="mt-2 max-w-md text-ink-soft">
          Order <span className="font-medium text-ink">#BSN-{Math.floor(48000 + Math.random() * 999)}</span> is
          confirmed{digitalReceipt ? " with a digital gift receipt" : ""}. You earned{" "}
          <span className="font-medium text-gold-deep">{earned} {tier.name} points</span>.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/account/orders" className="btn-primary">
            Track your order
          </Link>
          <Link href="/shop" className="btn-outline">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (hydrated && lines.length === 0) {
    return (
      <div className="shell flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="h-10 w-10 text-line" strokeWidth={1} />
        <h1 className="mt-4 font-serif text-3xl">Your bag is empty</h1>
        <Link href="/shop" className="btn-primary mt-6">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Premium Checkout</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
            <Lock className="h-4 w-4" /> One-page · guest or member
          </p>
        </div>
        <div className="flex rounded-full border border-line p-1 text-xs uppercase tracking-luxe">
          <button
            onClick={() => setGuest(true)}
            className={cn("rounded-full px-4 py-2", guest ? "bg-ink text-canvas" : "text-ink-muted")}
          >
            Guest
          </button>
          <button
            onClick={() => setGuest(false)}
            className={cn("rounded-full px-4 py-2", !guest ? "bg-ink text-canvas" : "text-ink-muted")}
          >
            Member
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <section>
            <ExpressPayButtons />
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">or pay by card</span>
              <span className="h-px flex-1 bg-line" />
            </div>
          </section>

          <Section step={1} title="Contact">
            <Field label="Email address" placeholder="you@email.com" type="email" />
            <label className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" defaultChecked className="accent-gold" /> Email me with news and offers
            </label>
          </Section>

          <Section step={2} title="Shipping / pickup">
            {!guest && defaultAddress && (
              <button className="mb-3 flex w-full items-start gap-3 rounded-xl border border-ink bg-canvas-raised p-4 text-left">
                <MapPin className="mt-0.5 h-4 w-4 text-gold" />
                <div>
                  <p className="text-sm font-medium">{defaultAddress.label} · saved address</p>
                  <p className="text-xs text-ink-muted">
                    {defaultAddress.line1}, {defaultAddress.city} {defaultAddress.postcode}
                  </p>
                </div>
              </button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" defaultValue={guest ? "" : "Amelia"} />
              <Field label="Last name" defaultValue={guest ? "" : "Rousseau"} />
            </div>
            <Field label="Address" className="mt-3" defaultValue={guest ? "" : defaultAddress?.line1} />
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Field label="City" defaultValue={guest ? "" : defaultAddress?.city} />
              <Field label="Postcode" defaultValue={guest ? "" : defaultAddress?.postcode} />
              <Field label="Country" defaultValue={defaultAddress?.country ?? "United Kingdom"} />
            </div>
          </Section>

          <Section step={3} title="Delivery">
            <div className="space-y-2">
              {shippingOptions.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setShipping(o.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors",
                    shipping === o.id ? "border-ink bg-canvas-raised" : "border-line hover:border-ink"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border",
                        shipping === o.id ? "border-ink bg-ink text-canvas" : "border-line"
                      )}
                    >
                      {shipping === o.id && <Check className="h-3 w-3" />}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{o.label}</p>
                      <p className="text-xs text-ink-muted">{o.copy}</p>
                    </div>
                  </div>
                  <span className="text-sm">{o.price === 0 ? "Free" : formatPrice(o.price)}</span>
                </button>
              ))}
            </div>
            {shipping !== "pickup" && (
              <div className="mt-4">
                <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-luxe text-ink-muted">
                  <Calendar className="h-3.5 w-3.5" /> Delivery date
                </p>
                <div className="flex flex-wrap gap-2">
                  {deliveryDates.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDeliveryDate(d)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs",
                        deliveryDate === d ? "border-ink bg-ink text-canvas" : "border-line text-ink-soft"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Section>

          <Section step={4} title="Payment">
            {!guest && defaultPayment && (
              <button className="mb-3 flex w-full items-center gap-3 rounded-xl border border-ink bg-canvas-raised p-4 text-left">
                <CreditCard className="h-4 w-4 text-gold" />
                <div>
                  <p className="text-sm font-medium">
                    {defaultPayment.brand} ···· {defaultPayment.last4}
                  </p>
                  <p className="text-xs text-ink-muted">Expires {defaultPayment.exp}</p>
                </div>
              </button>
            )}
            <Field label="Card number" placeholder="1234 5678 9012 3456" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Expiry" placeholder="MM / YY" />
              <Field label="CVC" placeholder="123" />
            </div>
            <div className="mt-4 space-y-2 text-sm text-ink-soft">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={useGiftCard} onChange={(e) => setUseGiftCard(e.target.checked)} className="accent-gold" />
                Apply gift card ({formatPrice(giftCardBalance)})
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={useCredit} onChange={(e) => setUseCredit(e.target.checked)} className="accent-gold" />
                Apply store credit ({formatPrice(storeCredit)})
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} className="accent-gold" />
                Redeem loyalty rewards (up to {formatPrice(Math.floor(loyaltyPoints / 100))})
              </label>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
              <Lock className="h-3.5 w-3.5" /> Cards, Affirm, Klarna, PayPal, Apple Pay &amp; Google Pay supported.
            </p>
          </Section>

          <Section step={5} title="Gifting">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setCheckoutGift(e.target.checked, giftMessage)}
                className="accent-gold"
              />
              <Gift className="h-4 w-4" /> Gift wrapping (+$12)
            </label>
            {giftWrap && (
              <textarea
                value={giftMessage}
                onChange={(e) => setCheckoutGift(true, e.target.value)}
                placeholder="Personalized message"
                className="mt-3 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-sm focus:outline-none"
                rows={3}
              />
            )}
            <label className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={digitalReceipt}
                onChange={(e) => setDigitalReceipt(e.target.checked)}
                className="accent-gold"
              />
              Digital gift receipt (hide prices)
            </label>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-line bg-canvas-raised p-6">
            <h2 className="font-serif text-2xl">Order summary</h2>
            <div className="mt-4 max-h-72 space-y-4 overflow-y-auto">
              {lines.map(({ line, product, variant }) => (
                <div key={`${line.variantId}-${line.size}`} className="flex gap-3">
                  <div className="relative w-16 shrink-0">
                    <Media seed={variant.images[0]} swatches={[variant.hex]} ratio="portrait" className="rounded-lg" />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[0.65rem] text-canvas">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{getBrand(product.brandId)?.name}</p>
                    <p className="font-serif text-base leading-tight">{product.name}</p>
                    <p className="text-xs text-ink-muted">{variant.color} · {line.size}</p>
                  </div>
                  <span className="text-sm">{formatPrice(product.price * line.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Promo / gift / referral"
                  className="w-full rounded-lg border border-line bg-canvas py-2.5 pl-9 pr-3 text-sm focus:outline-none"
                  aria-label="Promo code"
                />
              </div>
              <button onClick={() => setPromoApplied(promo.trim().length > 0)} className="btn-outline !py-2.5">
                Apply
              </button>
            </div>
            {promoApplied && <p className="mt-2 text-xs text-[#3a4a3b]">Promo applied — 10% off</p>}

            <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
              <Line label="Subtotal" value={formatPrice(subtotal)} />
              {discount > 0 && <Line label="Discount" value={`− ${formatPrice(discount)}`} accent />}
              {pointsRedeemValue > 0 && <Line label="Loyalty rewards" value={`− ${formatPrice(pointsRedeemValue)}`} accent />}
              {giftApplied > 0 && <Line label="Gift card" value={`− ${formatPrice(giftApplied)}`} accent />}
              {creditApplied > 0 && <Line label="Store credit" value={`− ${formatPrice(creditApplied)}`} accent />}
              {giftWrapFee > 0 && <Line label="Gift wrap" value={formatPrice(giftWrapFee)} />}
              <Line label="Shipping" value={shipCost === 0 ? "Free" : formatPrice(shipCost)} />
              <Line label="Estimated tax" value={formatPrice(tax)} />
              {subtotal >= FREE_SHIP_THRESHOLD && (
                <p className="text-xs text-gold-deep">Complimentary shipping unlocked.</p>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm uppercase tracking-luxe">Total</span>
              <span className="font-serif text-2xl">{formatPrice(total)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              You&apos;ll earn {points} Bosiano Club points ({tier.name} · {tier.multiplier}×).
            </p>

            <button onClick={placeOrder} className="btn-primary mt-5 w-full">
              <Lock className="h-4 w-4" /> Place order
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-3 font-serif text-2xl">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-canvas">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  className,
  defaultValue,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  defaultValue?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[0.7rem] uppercase tracking-luxe text-ink-muted">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-line bg-canvas px-4 py-3 text-sm focus:border-ink focus:outline-none"
      />
    </label>
  );
}

function Line({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className={accent ? "text-[#3a4a3b]" : ""}>{value}</span>
    </div>
  );
}
