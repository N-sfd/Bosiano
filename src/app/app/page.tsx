"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Fingerprint,
  Bell,
  Camera,
  QrCode,
  MapPin,
  Wallet,
  WifiOff,
  Sparkles,
  Package,
  MessageSquare,
  Tag,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "nav",
    icon: Smartphone,
    title: "Bottom navigation",
    copy: "Home, search, wishlist, bag, and account — always one tap away.",
  },
  {
    id: "bio",
    icon: Fingerprint,
    title: "Face ID / fingerprint",
    copy: "Biometric unlock for account, wallet pass, and express checkout.",
    pref: "biometricLogin" as const,
  },
  {
    id: "push",
    icon: Bell,
    title: "Push notifications",
    copy: "Price drops, back-in-stock, live events, and delivery updates.",
    pref: "pushEnabled" as const,
  },
  {
    id: "camera",
    icon: Camera,
    title: "Camera visual search",
    copy: "Snap a look — Shop the Look matches silhouette, colour, and vibe.",
    href: "/#shop-the-look",
  },
  {
    id: "qr",
    icon: QrCode,
    title: "QR scanning",
    copy: "Scan product tags in-store or on packaging for instant PDP access.",
  },
  {
    id: "location",
    icon: MapPin,
    title: "Location-aware delivery",
    copy: "Suggests nearby boutiques, same-day windows, and pickup slots.",
    pref: "locationDelivery" as const,
  },
  {
    id: "wallet",
    icon: Wallet,
    title: "Apple / Google Wallet card",
    copy: "Bosiano Club membership pass with points and tier on your lock screen.",
    pref: "walletPass" as const,
  },
  {
    id: "offline",
    icon: WifiOff,
    title: "Offline wishlist",
    copy: "Saved lists remain browsable without signal; sync when you're back online.",
    pref: "offlineWishlist" as const,
  },
  {
    id: "drops",
    icon: Sparkles,
    title: "Mobile-exclusive drops",
    copy: "App-only capsules with early access for Club members.",
  },
  {
    id: "track",
    icon: Package,
    title: "Live order tracking",
    copy: "Courier map and milestone pushes from warehouse to doorstep.",
    href: "/account/orders",
  },
  {
    id: "msg",
    icon: MessageSquare,
    title: "In-app messaging",
    copy: "Concierge, stylists, and store associates in one thread.",
    href: "/support",
  },
  {
    id: "offers",
    icon: Tag,
    title: "App-only offers",
    copy: "Hidden codes and early sale windows unlocked inside the app.",
  },
];

const appOffers = [
  { id: "app-early", label: "Early access · Autumn capsule", detail: "48 hours before web" },
  { id: "app-ship", label: "App-only free next-day", detail: "Orders over $200 this week" },
  { id: "app-care", label: "Complimentary leather care", detail: "First booking via app" },
];

export default function MobileAppPage() {
  const hydrated = useHydrated();
  const prefs = useStore((s) => s.mobilePrefs);
  const setPrefs = useStore((s) => s.setMobilePrefs);
  const claimed = useStore((s) => s.appOffersSeen);
  const claim = useStore((s) => s.claimAppOffer);
  const [qrDemo, setQrDemo] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  return (
    <div className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Native mobile experience</p>
        <h1 className="mt-3 font-serif text-5xl">Bosiano in your pocket</h1>
        <p className="mt-4 text-ink-soft">
          Bottom nav, biometrics, visual search, wallet pass, offline wishlist, and app-only drops —
          designed for the phone-first client.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-sm rounded-[2rem] border-4 border-ink bg-canvas-raised p-4 shadow-lg">
        <div className="rounded-[1.5rem] border border-line bg-canvas p-4">
          <p className="text-center text-[0.65rem] uppercase tracking-luxe text-ink-muted">Preview · bottom nav</p>
          <div className="mt-4 flex justify-around border-t border-line pt-3 text-[0.55rem] uppercase tracking-luxe">
            {["Home", "Search", "Heart", "Bag", "You"].map((l) => (
              <span key={l} className={cn(l === "You" ? "text-gold" : "text-ink-muted")}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.id} className="rounded-2xl border border-line p-5">
            <f.icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
            <h3 className="mt-3 font-serif text-2xl">{f.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{f.copy}</p>
            {"pref" in f && f.pref && hydrated && (
              <label className="mt-4 flex items-center justify-between text-xs uppercase tracking-luxe">
                Enabled
                <input
                  type="checkbox"
                  checked={prefs[f.pref]}
                  onChange={(e) => setPrefs({ [f.pref!]: e.target.checked })}
                  className="accent-gold"
                />
              </label>
            )}
            {"href" in f && f.href && (
              <Link href={f.href} className="mt-3 inline-block text-xs uppercase tracking-luxe hover:text-gold">
                Open →
              </Link>
            )}
            {f.id === "qr" && (
              <button
                onClick={() => {
                  setQrDemo(true);
                  setScanResult("/product/structured-leather-tote");
                }}
                className="btn-outline mt-3 !py-2"
              >
                Simulate QR scan
              </button>
            )}
          </div>
        ))}
      </div>

      {qrDemo && scanResult && (
        <div className="mt-6 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm">
          QR detected →{" "}
          <Link href={scanResult} className="font-medium underline">
            Structured Leather Tote
          </Link>
        </div>
      )}

      <section className="mt-14 rounded-2xl border border-line p-6">
        <h2 className="font-serif text-3xl">App-only offers</h2>
        <div className="mt-4 space-y-3">
          {appOffers.map((o) => {
            const taken = hydrated && claimed.includes(o.id);
            return (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line px-4 py-3">
                <div>
                  <p className="font-medium">{o.label}</p>
                  <p className="text-xs text-ink-muted">{o.detail}</p>
                </div>
                <button
                  disabled={!!taken}
                  onClick={() => claim(o.id)}
                  className={cn("btn-outline !py-2", taken && "opacity-50")}
                >
                  {taken ? "Claimed" : "Claim in app"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
