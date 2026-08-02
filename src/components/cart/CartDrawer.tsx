"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Lock,
  BookmarkPlus,
  Gift,
  Clock,
  Truck,
  Sparkles,
  Package,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useUI } from "@/store/useUI";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { resolveCart, cartSubtotal, FREE_SHIP_THRESHOLD } from "@/lib/cart";
import { getBrand } from "@/lib/brands";
import { Media } from "@/components/Media";
import { relatedProducts, totalStock } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { ExpressPayButtons } from "@/components/checkout/ExpressPayButtons";
import { pointsEarned, tierForPoints } from "@/lib/club";

export function CartDrawer() {
  const { cartOpen, setCart } = useUI();
  const cart = useStore((s) => s.cart);
  const savedForLater = useStore((s) => s.savedForLater);
  const setQuantity = useStore((s) => s.setQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const saveCart = useStore((s) => s.saveCart);
  const saveForLater = useStore((s) => s.saveForLater);
  const moveSavedToCart = useStore((s) => s.moveSavedToCart);
  const removeSavedForLater = useStore((s) => s.removeSavedForLater);
  const loyaltyPoints = useStore((s) => s.loyaltyPoints);
  const giftWrap = useStore((s) => s.checkoutGiftWrap);
  const giftMessage = useStore((s) => s.checkoutGiftMessage);
  const setCheckoutGift = useStore((s) => s.setCheckoutGift);
  const hydrated = useHydrated();
  const [splitShip, setSplitShip] = useState(false);

  const lines = useMemo(() => (hydrated ? resolveCart(cart) : []), [hydrated, cart]);
  const later = useMemo(() => (hydrated ? resolveCart(savedForLater) : []), [hydrated, savedForLater]);
  const subtotal = hydrated ? cartSubtotal(cart) : 0;
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  const points = pointsEarned(subtotal, loyaltyPoints);
  const tier = tierForPoints(loyaltyPoints);
  const promoEligible = subtotal >= 400;

  const matching = useMemo(() => {
    const seed = lines[0]?.product;
    if (!seed) return [];
    return relatedProducts(seed, 3);
  }, [lines]);

  const etaLabel = splitShip ? "Split: express + standard" : "Estimated delivery · 1–3 days";

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[130]"
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setCart(false)} aria-hidden />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-canvas-raised"
            role="dialog"
            aria-label="Shopping bag"
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-serif text-2xl">Your Bag {lines.length > 0 && `(${lines.length})`}</h2>
              <button className="btn-ghost" aria-label="Close bag" onClick={() => setCart(false)}>
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </header>

            {lines.length === 0 && later.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="font-serif text-2xl">Your bag is empty</p>
                <p className="text-sm text-ink-muted">Discover pieces from our curated designers.</p>
                <button onClick={() => setCart(false)} className="btn-primary mt-2">
                  Start shopping
                </button>
              </div>
            ) : (
              <>
                <div className="border-b border-line px-6 py-4 space-y-3">
                  <p className="text-xs text-ink-soft">
                    {remaining > 0 ? (
                      <>
                        You&apos;re <span className="font-semibold text-ink">{formatPrice(remaining)}</span> away from
                        complimentary express shipping
                      </>
                    ) : (
                      <span className="font-semibold text-gold-deep">You&apos;ve unlocked free express shipping</span>
                    )}
                  </p>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-canvas-sunk">
                    <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-luxe text-ink-muted">
                    <span className="inline-flex items-center gap-1 rounded-full bg-canvas-sunk px-2.5 py-1">
                      <Truck className="h-3 w-3" /> {etaLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-canvas-sunk px-2.5 py-1">
                      <Sparkles className="h-3 w-3" /> +{points} {tier.name} pts
                    </span>
                    {promoEligible && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-gold-deep">
                        Promo eligible
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6">
                  {lines.map(({ line, product, variant }) => {
                    const stock = totalStock(product);
                    return (
                      <div key={`${line.variantId}-${line.size}`} className="flex gap-4 border-b border-line py-5">
                        <Link href={`/product/${product.slug}`} onClick={() => setCart(false)} className="w-20 shrink-0">
                          <Media seed={variant.images[0]} swatches={[variant.hex]} ratio="portrait" className="rounded-lg" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">
                            {getBrand(product.brandId)?.name}
                          </p>
                          <Link href={`/product/${product.slug}`} onClick={() => setCart(false)} className="font-serif text-lg leading-tight">
                            {product.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-ink-muted">
                            {variant.color} · Size {line.size}
                          </p>
                          {stock > 0 && stock <= 6 && (
                            <p className="mt-1 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-luxe text-[#8a4b2f]">
                              <Clock className="h-3 w-3" /> Only {stock} left
                            </p>
                          )}
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3 rounded-full border border-line px-2 py-1">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() => setQuantity(line.variantId, line.size, line.quantity - 1)}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-4 text-center text-sm">{line.quantity}</span>
                              <button
                                aria-label="Increase quantity"
                                onClick={() => setQuantity(line.variantId, line.size, line.quantity + 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="text-sm">{formatPrice(product.price * line.quantity)}</span>
                          </div>
                          <button
                            onClick={() => saveForLater(line.variantId, line.size)}
                            className="mt-2 self-start text-[0.65rem] uppercase tracking-luxe text-ink-muted hover:text-ink"
                          >
                            Save for later
                          </button>
                        </div>
                        <button
                          aria-label="Remove item"
                          onClick={() => removeFromCart(line.variantId, line.size)}
                          className="self-start text-ink-muted hover:text-ink"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    );
                  })}

                  {later.length > 0 && (
                    <div className="py-5">
                      <p className="mb-3 text-xs uppercase tracking-luxe text-ink-muted">Saved for later</p>
                      {later.map(({ line, product, variant }) => (
                        <div key={`later-${line.variantId}-${line.size}`} className="mb-4 flex gap-3">
                          <div className="w-14 shrink-0">
                            <Media seed={variant.images[0]} swatches={[variant.hex]} ratio="portrait" className="rounded-lg" />
                          </div>
                          <div className="flex-1">
                            <p className="font-serif text-base leading-tight">{product.name}</p>
                            <div className="mt-2 flex gap-3 text-[0.65rem] uppercase tracking-luxe">
                              <button onClick={() => moveSavedToCart(line.variantId, line.size)} className="hover:text-gold">
                                Move to bag
                              </button>
                              <button onClick={() => removeSavedForLater(line.variantId, line.size)} className="text-ink-muted hover:text-ink">
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {matching.length > 0 && (
                    <div className="border-t border-line py-5">
                      <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-luxe text-ink-muted">
                        <Package className="h-3.5 w-3.5" /> Recommended matching
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {matching.map((p) => (
                          <Link key={p.id} href={`/product/${p.slug}`} onClick={() => setCart(false)} className="group">
                            <Media seed={p.variants[0].images[0]} swatches={[p.variants[0].hex]} ratio="portrait" className="rounded-lg" />
                            <p className="mt-1 truncate font-serif text-sm group-hover:text-gold">{p.name}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <footer className="border-t border-line px-6 py-5">
                  <div className="mb-3 space-y-2">
                    <label className="flex items-center gap-2 text-xs text-ink-soft">
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => setCheckoutGift(e.target.checked, giftMessage)}
                        className="accent-gold"
                      />
                      <Gift className="h-3.5 w-3.5" /> Gift packaging
                    </label>
                    {giftWrap && (
                      <input
                        value={giftMessage}
                        onChange={(e) => setCheckoutGift(true, e.target.value)}
                        placeholder="Personalized gift message"
                        className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm focus:outline-none"
                      />
                    )}
                    <label className="flex items-center gap-2 text-xs text-ink-soft">
                      <input
                        type="checkbox"
                        checked={splitShip}
                        onChange={(e) => setSplitShip(e.target.checked)}
                        className="accent-gold"
                      />
                      Split shipment (ship ready items first)
                    </label>
                  </div>
                  <button
                    onClick={() => saveCart(`Saved ${new Date().toLocaleDateString()}`)}
                    className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-luxe text-ink-soft hover:text-ink"
                  >
                    <BookmarkPlus className="h-4 w-4" /> Save this bag
                  </button>
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-luxe text-ink-muted">Subtotal</span>
                    <span className="font-serif text-2xl">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">Shipping &amp; taxes calculated at checkout.</p>
                  <Link href="/checkout" onClick={() => setCart(false)} className="btn-primary mt-4 w-full">
                    <Lock className="h-4 w-4" /> Secure checkout
                  </Link>
                  <div className="mt-3">
                    <ExpressPayButtons compact />
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
