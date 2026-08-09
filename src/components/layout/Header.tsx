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
  ScanSearch,
} from "lucide-react";
import { primaryNav, exploreNav } from "@/lib/nav";
import { useUI } from "@/store/useUI";
import { useStore, cartCount } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { Media } from "@/components/Media";
import { BosianoBrand } from "@/components/brand/BosianoBrand";
import { brand } from "@/config/brand";
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

  /** Collapse lower-priority labels before they can enter the protected logo zone */
  const navVisibility = (label: string) => {
    if (label === "Bags & Accessories") return "hidden min-[1200px]:inline-flex";
    if (label === "Designers" || label === "The Journal") return "hidden min-[1440px]:inline-flex";
    return "inline-flex";
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[90] w-full overflow-visible border-b border-line bg-canvas-raised/95 backdrop-blur-md transition-all duration-500 ease-silk",
          scrolled ? "border-line shadow-[0_1px_0_rgba(8,8,8,0.04)]" : "border-transparent"
        )}
        onMouseLeave={() => {
          setActive(null);
          setExploreOpen(false);
        }}
      >
        <div
          className={cn(
            "header-bar relative mx-auto w-full max-w-shell px-4 transition-all duration-500 sm:px-8 lg:px-10 min-[1200px]:px-12",
            scrolled && "is-scrolled"
          )}
        >
          {/* Logo is an absolute center layer — nav sides never include it */}
          <div className="relative flex h-full min-h-[inherit] w-full items-center overflow-visible">
            {/* Left: hamburger (mobile) + primary nav (desktop) */}
            <div className="header-side header-side--left gap-3">
              <button
                className="btn-ghost -ml-1 shrink-0 lg:hidden"
                aria-label="Open menu"
                onClick={() => setMenu(true)}
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <nav className="header-nav" aria-label="Primary">
                {primaryNav.map((item, i) => (
                  <div
                    key={item.label}
                    className={navVisibility(item.label)}
                    onMouseEnter={() => { setActive(i); setExploreOpen(false); }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "header-nav-item link-underline text-[0.62rem] font-normal uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink min-[1440px]:text-[0.65rem] min-[1440px]:tracking-[0.16em]",
                        item.label === "Sale" && "text-gold-deep hover:text-gold-deep",
                        active === i && "text-ink"
                      )}
                    >
                      {item.label === "Bags & Accessories" ? (
                        <span className="flex flex-col items-center leading-tight">
                          <span>Bags &amp;</span>
                          <span>Accessories</span>
                        </span>
                      ) : (
                        item.label
                      )}
                    </Link>
                  </div>
                ))}

                <div
                  ref={exploreRef}
                  className="relative inline-flex"
                  onMouseEnter={() => { setExploreOpen(true); setActive(null); }}
                >
                  <button
                    type="button"
                    className={cn(
                      "header-nav-item gap-0.5 text-[0.62rem] font-normal uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink min-[1440px]:text-[0.65rem] min-[1440px]:tracking-[0.16em]",
                      exploreOpen && "text-ink"
                    )}
                    aria-expanded={exploreOpen}
                    aria-haspopup="true"
                    onClick={() => setExploreOpen((o) => !o)}
                  >
                    Explore
                    <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", exploreOpen && "rotate-180")} strokeWidth={1.5} />
                  </button>
                  <AnimatePresence>
                    {exploreOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full z-30 mt-2 min-w-[200px] rounded-xl border border-line bg-canvas-raised py-2 shadow-lg"
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

            {/*
              Independently centered full lockup — absolute layer, page center.
              Transparent PNG only (no card / fill / checkerboard).
            */}
            <Link
              href="/"
              className="header-logo bosiano-logo-link"
              aria-label={`${brand.displayName} home`}
              onMouseEnter={() => { setActive(null); setExploreOpen(false); }}
            >
              <BosianoBrand variant="crest-full" size="xl" className="header-logo-mark" priority />
            </Link>

            {/* Right: search + actions — balanced against left, clear of logo zone */}
            <div className="header-side header-side--right gap-1 sm:gap-2">
              <button
                className="mr-0.5 hidden max-w-[160px] items-center gap-2 truncate rounded-full border border-line bg-canvas-raised px-3 py-1.5 text-left transition-colors hover:border-ink lg:inline-flex min-[1200px]:max-w-[200px] min-[1200px]:px-3.5 min-[1440px]:max-w-[220px]"
                aria-label="Search Bosiano"
                onClick={() => setSearch(true)}
                onMouseEnter={() => { setActive(null); setExploreOpen(false); }}
              >
                <Search className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} />
                <span className="truncate text-xs text-ink-muted">Search…</span>
              </button>
              <div className="flex items-center gap-0.5 sm:gap-1 sm:border-l sm:border-line sm:pl-2.5">
                <button
                  type="button"
                  className="btn-ghost hidden md:inline-flex"
                  aria-label="Visual search"
                  onClick={() => setSearch(true)}
                >
                  <ScanSearch className="h-5 w-5" strokeWidth={1.5} />
                </button>
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

          {/* Mobile / tablet search — below the centered logo row */}
          <button
            type="button"
            className="mt-2 flex w-full items-center gap-2 rounded-full border border-line bg-canvas-raised px-4 py-2 text-left text-ink-muted transition-colors hover:border-ink hover:text-ink lg:hidden"
            aria-label={`Search ${brand.displayName}`}
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
                          <p className="font-serif text-xl text-ink">{f.title}</p>
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
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-semibold text-void">
      {children}
    </span>
  );
}
