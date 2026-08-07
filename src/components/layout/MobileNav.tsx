"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Search, Heart, ShoppingBag, User, X, ChevronRight } from "lucide-react";
import { useUI } from "@/store/useUI";
import { useStore, cartCount } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { megaNav, exploreNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { BosianosLogo } from "@/components/brand/BosianosLogo";

export function MobileNav() {
  const pathname = usePathname();
  const { setSearch, setCart, menuOpen, setMenu } = useUI();
  const cart = useStore((s) => s.cart);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(cart) : 0;

  const items = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Search", icon: Search, action: () => setSearch(true) },
    { label: "Wishlist", icon: Heart, href: "/wishlist" },
    { label: "Bag", icon: ShoppingBag, action: () => setCart(true), badge: count },
    { label: "Account", icon: User, href: "/account" },
  ];

  return (
    <>
      {/* bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[80] flex items-stretch border-t border-line bg-canvas-raised/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        aria-label="Mobile"
      >
        {items.map((item) => {
          const active = item.href && pathname === item.href;
          const inner = (
            <>
              <span className="relative">
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.55rem] font-semibold text-canvas">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.1em]">{item.label}</span>
            </>
          );
          const cls = cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2.5",
            active ? "text-gold" : "text-ink"
          );
          return item.href ? (
            <Link key={item.label} href={item.href} className={cls}>
              {inner}
            </Link>
          ) : (
            <button key={item.label} onClick={item.action} className={cls} aria-label={item.label}>
              {inner}
            </button>
          );
        })}
      </nav>

      {/* full-screen menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] lg:hidden"
          >
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setMenu(false)} aria-hidden />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
              className="absolute left-0 top-0 flex h-full w-[min(86vw,24rem)] max-w-sm flex-col bg-canvas-raised"
              role="dialog"
              aria-label="Menu"
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <BosianosLogo variant="horizontal" tone="ink" showTagline compact />
                <button className="btn-ghost" aria-label="Close menu" onClick={() => setMenu(false)}>
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-6 py-4" aria-label="Mobile primary">
                {megaNav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenu(false)}
                    className="flex items-center justify-between border-b border-line py-4 font-serif text-2xl"
                  >
                    {item.label}
                    <ChevronRight className="h-5 w-5 text-ink-muted" />
                  </Link>
                ))}
                <p className="eyebrow mb-2 mt-8">Explore</p>
                {exploreNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenu(false)}
                    className="flex items-center justify-between border-b border-line py-3.5 text-base text-ink-soft"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-ink-muted" />
                  </Link>
                ))}
              </nav>
              <div className="space-y-3 border-t border-line px-6 py-5">
                <Link href="/rewards" onClick={() => setMenu(false)} className="btn-primary w-full">
                  Join Bosianos Club
                </Link>
                <Link href="/account" onClick={() => setMenu(false)} className="btn-outline w-full">
                  My Account
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
