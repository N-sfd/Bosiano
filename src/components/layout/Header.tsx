"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  GitCompareArrows,
  ChevronDown,
} from "lucide-react";
import { primaryNav, exploreNav } from "@/lib/nav";
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
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!exploreRef.current?.contains(e.target as Node)) setExploreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const count = hydrated ? cartCount(cart) : 0;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[90] w-full border-b bg-canvas/90 backdrop-blur-md transition-all duration-500 ease-silk",
          scrolled ? "border-line shadow-[0_1px_0_rgba(8,8,8,0.04)]" : "border-transparent"
        )}
        onMouseLeave={() => {
          setActive(null);
          setExploreOpen(false);
        }}
      >
        <div
          className={cn(
            "mx-auto w-full max-w-shell px-4 transition-all duration-500 sm:px-10 lg:px-14",
            scrolled ? "py-3" : "py-4 sm:py-5"
          )}
        >
          {/* Desktop / tablet top bar */}
          <div className="flex w-full items-center justify-between gap-3 sm:gap-5">
            {/* Left: mobile menu + primary nav */}
            <div className="flex min-w-0 flex-1 items-center gap-5 lg:gap-7">
              <button
                className="btn-ghost -ml-1 lg:hidden"
                aria-label="Open menu"
                onClick={() => setMenu(true)}
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <nav className="hidden items-center gap-4 xl:gap-5 lg:flex" aria-label="Primary">
                {primaryNav.map((item, i) => (
                  <div key={item.label} onMouseEnter={() => { setActive(i); setExploreOpen(false); }}>
                    <Link
                      href={item.href}
                      className={cn(
                        "link-underline py-2 text-[0.65rem] font-normal uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink",
                        item.label === "Sale" && "text-gold-deep hover:text-gold-deep",
                        active === i && "text-ink"
                      )}
                    >
                      {item.label === "Bags & Accessories" ? "Bags" : item.label === "The Journal" ? "Journal" : item.label}
                    </Link>
                  </div>
                ))}

                <div
                  ref={exploreRef}
                  className="relative"
                  onMouseEnter={() => { setExploreOpen(true); setActive(null); }}
                >
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 py-2 text-[0.65rem] font-normal uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink",
                      exploreOpen && "text-ink"
                    )}
                    aria-expanded={exploreOpen}
                    aria-haspopup="true"
                    onClick={() => setExploreOpen((o) => !o)}
                  >
                    Explore
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", exploreOpen && "rotate-180")} strokeWidth={1.5} />
                  </button>
                  <AnimatePresence>
                    {exploreOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full z-20 mt-2 min-w-[200px] rounded-xl border border-line bg-canvas-raised py-2 shadow-lg"
                      >
                        {exploreNav.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            className="block px-4 py-2.5 text-sm text-ink-soft transition-colors hover:bg-canvas-sunk hover:text-ink"
                            onClick={() => setExploreOpen(false)}
                          >
                            {l.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>
            </div>

            {/* Center logo */}
            <Link
              href="/"
              className="mx-1 shrink-0 transition-transform duration-500 ease-silk sm:mx-4"
              aria-label="Bosiano home"
              onMouseEnter={() => { setActive(null); setExploreOpen(false); }}
            >
              <BosianosLogo
                variant="stacked"
                tone="ink"
                showTagline
                compact={scrolled}
                className="transition-all duration-500"
              />
            </Link>

            {/* Right utilities */}
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-3">
              <button
                className="mr-1 hidden max-w-[200px] items-center gap-2 truncate rounded-full border border-line bg-canvas-raised px-3.5 py-2 text-left transition-colors hover:border-ink lg:mr-3 lg:inline-flex xl:max-w-[240px]"
                aria-label="Search Bosianos"
                onClick={() => setSearch(true)}
                onMouseEnter={() => { setActive(null); setExploreOpen(false); }}
              >
                <Search className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} />
                <span className="truncate text-xs text-ink-muted">Search designers, looks…</span>
              </button>
              <div className="flex items-center gap-0.5 sm:gap-1 sm:border-l sm:border-line sm:pl-3">
                <Link href="/compare" className="btn-ghost relative hidden md:inline-flex" aria-label="Compare">
                  <GitCompareArrows className="h-5 w-5" strokeWidth={1.5} />
                  {hydrated && compare.length > 0 && <Badge>{compare.length}</Badge>}
                </Link>
                <Link href="/account" className="btn-ghost hidden md:inline-flex" aria-label="Account">
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
          </div>

          {/* Mobile / tablet search row — below logo */}
          <button
            type="button"
            className="mt-3 flex w-full items-center gap-2 rounded-full border border-line bg-canvas-raised px-4 py-2.5 text-left text-ink-muted transition-colors hover:border-ink hover:text-ink lg:hidden"
            aria-label="Search Bosianos"
            onClick={() => setSearch(true)}
          >
            <Search className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span className="truncate text-sm">Search designers, looks, products…</span>
          </button>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {active !== null && primaryNav[active]?.columns && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-full hidden border-y border-line bg-canvas-raised lg:block"
              onMouseEnter={() => setActive(active)}
            >
              <div className="mx-auto grid max-w-shell grid-cols-12 gap-10 px-6 py-10 sm:px-10 lg:px-14">
                <div className="col-span-8 grid grid-cols-3 gap-8">
                  {primaryNav[active]!.columns!.map((col) => (
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
                  {primaryNav[active]!.featured?.map((f) => (
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
