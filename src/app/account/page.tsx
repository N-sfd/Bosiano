"use client";

import Link from "next/link";
import {
  ArrowRight,
  Package,
  Award,
  RotateCcw,
  Bookmark,
  Trash2,
  Heart,
  Shirt,
  Sparkles,
  Bell,
  CreditCard,
  MapPin,
  MessageSquare,
  Calendar,
  Gift,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { getProduct } from "@/lib/products";
import { orders as seedOrders } from "@/lib/orders";
import { resolveCart } from "@/lib/cart";
import { Media } from "@/components/Media";
import { StatusPill } from "@/components/account/StatusPill";
import { formatPrice } from "@/lib/utils";
import { tierProgress } from "@/lib/club";
import { personalizedProducts } from "@/lib/personalize";
import { getLook } from "@/lib/looks";

export default function AccountDashboard() {
  const loyaltyPoints = useStore((s) => s.loyaltyPoints);
  const savedCarts = useStore((s) => s.savedCarts);
  const recentlyViewed = useStore((s) => s.recentlyViewed);
  const restoreCart = useStore((s) => s.restoreCart);
  const deleteSavedCart = useStore((s) => s.deleteSavedCart);
  const wishlist = useStore((s) => s.wishlist);
  const wardrobe = useStore((s) => s.wardrobe);
  const styleProfile = useStore((s) => s.styleProfile);
  const savedLooks = useStore((s) => s.savedLooks);
  const notifyList = useStore((s) => s.notifyList);
  const giftCardBalance = useStore((s) => s.giftCardBalance);
  const storeCredit = useStore((s) => s.storeCredit);
  const pointsHistory = useStore((s) => s.pointsHistory);
  const savedAddresses = useStore((s) => s.savedAddresses);
  const savedPayments = useStore((s) => s.savedPayments);
  const storeOrders = useStore((s) => s.adminOrders);
  const hydrated = useHydrated();

  const orders = hydrated ? storeOrders : seedOrders;
  const points = hydrated ? loyaltyPoints : 2480;
  const progress = tierProgress(points);
  const recent = hydrated ? recentlyViewed.map((id) => getProduct(id)).filter(Boolean).slice(0, 6) : [];
  const picks = personalizedProducts(styleProfile, 4);
  const expiring = (hydrated ? pointsHistory : []).find((p) => p.expiresAt && p.delta > 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-4xl">Welcome back, Amelia</h1>
        <p className="mt-1 text-sm text-ink-muted">Orders, wardrobe, loyalty, and style — in one place.</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-ink text-canvas">
        <div className="grid gap-6 p-7 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="eyebrow !text-canvas/70 inline-flex items-center gap-2">
              <Award className="h-3.5 w-3.5 text-gold" /> Bosiano Club · {progress.current.name}
            </p>
            <p className="mt-3 font-serif text-5xl">
              {points.toLocaleString()}
              <span className="ml-2 text-lg text-canvas/60">points</span>
            </p>
            {progress.upcoming ? (
              <p className="mt-2 text-sm text-canvas/70">
                {progress.remaining.toLocaleString()} points until {progress.upcoming.name}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gold">Highest tier unlocked.</p>
            )}
            <div className="mt-3 h-1.5 max-w-sm overflow-hidden rounded-full bg-canvas/20">
              <div className="h-full rounded-full bg-gold" style={{ width: `${progress.percent}%` }} />
            </div>
            {expiring?.expiresAt && (
              <p className="mt-2 text-xs text-canvas/60">
                {expiring.delta} pts expire {new Date(expiring.expiresAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <Link href="/rewards" className="btn bg-canvas px-6 py-3 text-ink hover:bg-gold hover:text-canvas">
            Club & rewards <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Orders" value={orders.length.toString()} href="/account/orders" />
        <StatCard icon={RotateCcw} label="Returns / exchanges" value="0" href="/account/returns" />
        <StatCard icon={Heart} label="Wishlist" value={(hydrated ? wishlist.length : 0).toString()} href="/wishlist" />
        <StatCard icon={Shirt} label="Digital wardrobe" value={(hydrated ? wardrobe.length : 0).toString()} href="/account/wardrobe" />
        <StatCard icon={Bookmark} label="Saved looks" value={(hydrated ? savedLooks.length : 0).toString()} href="/lookbook" />
        <StatCard icon={Bell} label="Back-in-stock alerts" value={(hydrated ? notifyList.length : 0).toString()} href="/wishlist" />
        <StatCard icon={Gift} label="Gift cards" value={formatPrice(hydrated ? giftCardBalance : 75)} href="/account/settings" />
        <StatCard icon={CreditCard} label="Store credit" value={formatPrice(hydrated ? storeCredit : 40)} href="/rewards" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Style profile</h2>
          <Link href="/account/style" className="text-xs uppercase tracking-luxe hover:text-gold">
            Edit / retake quiz
          </Link>
        </div>
        <div className="grid gap-3 rounded-2xl border border-line p-5 sm:grid-cols-3">
          <Meta label="Sizes" value={`${styleProfile.sizes.tops} / ${styleProfile.sizes.bottoms} / ${styleProfile.sizes.shoes}`} />
          <Meta label="Budget" value={`Up to ${formatPrice(styleProfile.budget)}`} />
          <Meta label="Sustainability" value={styleProfile.sustainabilityPreference} />
          <Meta label="Fits" value={styleProfile.preferredFits.join(", ") || "—"} />
          <Meta label="Categories" value={styleProfile.preferredCategories.join(", ") || "—"} />
          <Meta label="Occasions" value={styleProfile.occasions.slice(0, 3).join(", ") || "—"} />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Recommendations</h2>
          <Link href="/onboarding" className="inline-flex items-center gap-1 text-xs uppercase tracking-luxe hover:text-gold">
            <Sparkles className="h-3.5 w-3.5" /> Refresh quiz
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group">
              <Media seed={p.variants[0].images[0]} swatches={[p.variants[0].hex]} ratio="portrait" className="rounded-xl" />
              <p className="mt-2 font-serif text-lg leading-tight group-hover:text-gold">{p.name}</p>
              <p className="text-sm text-ink-muted">{formatPrice(p.price)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Recent orders</h2>
          <Link href="/account/orders" className="text-xs uppercase tracking-luxe hover:text-gold">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 2).map((o) => (
            <Link
              key={o.id}
              href="/account/orders"
              className="flex items-center gap-4 rounded-xl border border-line p-4 transition-colors hover:border-ink"
            >
              <div className="flex -space-x-3">
                {o.items.slice(0, 2).map((it) => (
                  <div key={it.name} className="w-12 overflow-hidden rounded-lg border-2 border-canvas-raised">
                    <Media seed={it.image} ratio="portrait" />
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">#{o.id}</p>
                <p className="text-xs text-ink-muted">
                  {o.items.length} items · {formatPrice(o.total)}
                </p>
              </div>
              <StatusPill status={o.status} />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-serif text-2xl">Saved addresses</h2>
          <div className="space-y-3">
            {(hydrated ? savedAddresses : []).map((a) => (
              <div key={a.id} className="flex gap-3 rounded-xl border border-line p-4 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 text-gold" />
                <div>
                  <p className="font-medium">{a.label}{a.isDefault ? " · Default" : ""}</p>
                  <p className="text-ink-muted">
                    {a.line1}, {a.city} {a.postcode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-4 font-serif text-2xl">Payment methods</h2>
          <div className="space-y-3">
            {(hydrated ? savedPayments : []).map((p) => (
              <div key={p.id} className="flex gap-3 rounded-xl border border-line p-4 text-sm">
                <CreditCard className="mt-0.5 h-4 w-4 text-gold" />
                <div>
                  <p className="font-medium">
                    {p.brand} ···· {p.last4}
                  </p>
                  <p className="text-ink-muted">Expires {p.exp}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl">
            <Calendar className="h-5 w-5 text-gold" /> Appointments
          </h2>
          <Link href="/account/appointments" className="block rounded-xl border border-line p-4 text-sm hover:border-ink">
            <p className="font-medium">Seasonal wardrobe consult</p>
            <p className="text-ink-muted">Book virtual, in-store, occasion & gift styling →</p>
          </Link>
        </section>
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl">
            <MessageSquare className="h-5 w-5 text-gold" /> Messages & support
          </h2>
          <Link href="/support" className="block rounded-xl border border-line p-4 text-sm hover:border-ink">
            <p className="font-medium">Concierge · chat, WhatsApp, AI handoff</p>
            <p className="text-ink-muted">Open the support hub →</p>
          </Link>
        </section>
      </div>

      {hydrated && savedCarts.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-2xl">Saved bags</h2>
          <div className="space-y-3">
            {savedCarts.map((sc) => {
              const lines = resolveCart(sc.lines);
              const total = lines.reduce((s, l) => s + l.lineTotal, 0);
              return (
                <div key={sc.id} className="flex items-center gap-4 rounded-xl border border-line p-4">
                  <Bookmark className="h-5 w-5 text-gold" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{sc.name}</p>
                    <p className="text-xs text-ink-muted">
                      {lines.length} items · {formatPrice(total)}
                    </p>
                  </div>
                  <button onClick={() => restoreCart(sc.id)} className="btn-outline !py-2">
                    Restore
                  </button>
                  <button onClick={() => deleteSavedCart(sc.id)} aria-label="Delete saved bag" className="btn-ghost">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {hydrated && savedLooks.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-2xl">Saved looks</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {savedLooks.slice(0, 3).map((sl) => {
              const look = getLook(sl.lookId);
              if (!look) return null;
              return (
                <Link key={sl.lookId} href={`/lookbook/${look.slug}`} className="group">
                  <Media seed={look.hero} swatches={look.swatches} ratio="portrait" className="rounded-xl" />
                  <p className="mt-2 font-serif text-lg group-hover:text-gold">{look.title}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-2xl">Recently viewed</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {recent.map((p) =>
              p ? (
                <Link key={p.id} href={`/product/${p.slug}`}>
                  <Media seed={p.variants[0].images[0]} swatches={[p.variants[0].hex]} ratio="portrait" className="rounded-lg" />
                </Link>
              ) : null
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: string | number }>;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-xl border border-line p-4 transition-colors hover:border-ink">
      <Icon className="h-4 w-4 text-gold" strokeWidth={1.5} />
      <p className="mt-3 font-serif text-2xl">{value}</p>
      <p className="text-xs uppercase tracking-luxe text-ink-muted">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{label}</p>
      <p className="mt-1 text-sm capitalize">{value}</p>
    </div>
  );
}
