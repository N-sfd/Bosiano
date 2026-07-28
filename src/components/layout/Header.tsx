"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, User, Heart, ShoppingBag, Menu, GitCompareArrows } from "lucide-react";
import { megaNav } from "@/lib/nav";
import { useUI } from "@/store/useUI";
import { useStore, cartCount } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { Media } from "@/components/Media";
import { BosianosLogo } from "@/components/brand/BosianosLogo";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const { setSearch, setCart, setMenu } = useUI();
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const compare = useStore((s) => s.compare);
  const hydrated = useHydrated();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = hydrated ? cartCount(cart) : 0;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[90] w-full border-b bg-canvas/85 backdrop-blur-md transition-all duration-500 ease-silk",
          scrolled ? "border-line" : "border-transparent"
        )}
        onMouseLeave={() => setActive(null)}
      >
        <div className={cn("shell flex items-center justify-between gap-4 transition-all duration-500", scrolled ? "py-2.5" : "py-3.5")}>
          {/* Left: mobile menu + primary nav */}
          <div className="flex flex-1 items-center gap-6">
            <button
              className="btn-ghost -ml-3 lg:hidden"
              aria-label="Open menu"
              onClick={() => setMenu(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
              {megaNav.map((item, i) => (
                <div key={item.label} onMouseEnter={() => setActive(i)}>
                  <Link
                    href={item.href}
                    className={cn(
                      "link-underline py-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-colors",
                      item.label === "Sale" && "text-gold-deep",
                      active === i ? "text-gold" : "text-ink"
                    )}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Center: italic wordmark logo */}
          <Link
            href="/"
            className="mx-4 shrink-0 px-3 transition-transform duration-500 ease-silk sm:mx-6 sm:px-5 lg:mx-8 lg:px-6"
            aria-label="Bosianos home"
            onMouseEnter={() => setActive(null)}
          >
            <BosianosLogo
              variant="wordmark"
              tone="ink"
              compact={scrolled}
              className="transition-all duration-500"
            />
          </Link>

          {/* Right: utilities */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            {/* Prominent predictive search trigger */}
            <button
              className="hidden items-center gap-2 rounded-full border border-line bg-canvas-raised px-4 py-2 text-left transition-colors hover:border-ink md:inline-flex md:min-w-[200px] lg:min-w-[240px]"
              aria-label="Search Bosianos"
              onClick={() => setSearch(true)}
              onMouseEnter={() => setActive(null)}
            >
              <Search className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} />
              <span className="truncate text-xs text-ink-muted">Search designers, looks…</span>
            </button>
            <button
              className="btn-ghost md:hidden"
              aria-label="Search"
              onClick={() => setSearch(true)}
              onMouseEnter={() => setActive(null)}
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <Link href="/compare" className="btn-ghost relative hidden sm:inline-flex" aria-label="Compare">
              <GitCompareArrows className="h-5 w-5" strokeWidth={1.5} />
              {hydrated && compare.length > 0 && <Badge>{compare.length}</Badge>}
            </Link>
            <Link href="/account" className="btn-ghost hidden sm:inline-flex" aria-label="Account">
              <User className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <Link href="/wishlist" className="btn-ghost relative" aria-label="Wishlist">
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {hydrated && wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
            </Link>
            <button
              className="btn-ghost relative"
              aria-label={`Cart, ${count} items`}
              onClick={() => setCart(true)}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {count > 0 && <Badge>{count}</Badge>}
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {active !== null && megaNav[active]?.columns && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-full hidden border-y border-line bg-canvas-raised lg:block"
              onMouseEnter={() => setActive(active)}
            >
              <div className="shell grid grid-cols-12 gap-10 py-10">
                <div className="col-span-8 grid grid-cols-3 gap-8">
                  {megaNav[active]!.columns!.map((col) => (
                    <div key={col.heading}>
                      <h3 className="eyebrow mb-4">{col.heading}</h3>
                      <ul className="space-y-2.5">
                        {col.links.map((l) => (
                          <li key={l.label}>
                            <Link
                              href={l.href}
                              onClick={() => setActive(null)}
                              className="link-underline text-sm text-ink-soft hover:text-ink"
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="col-span-4 grid grid-cols-1 gap-4">
                  {megaNav[active]!.featured?.map((f) => (
                    <Link
                      key={f.title}
                      href={f.href}
                      onClick={() => setActive(null)}
                      className="group relative block overflow-hidden"
                    >
                      <Media seed={f.image} ratio="landscape" label={f.title} className="rounded-xl">
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/70 to-transparent p-5">
                          <p className="font-serif text-xl text-canvas">{f.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-luxe text-canvas/80">
                            {f.caption}
                          </p>
                        </div>
                      </Media>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay />
      <CartDrawer />
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-semibold text-canvas">
      {children}
    </span>
  );
}
