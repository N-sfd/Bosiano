"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  GitCompareArrows,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Sparkles,
  Star,
  ChevronDown,
  Check,
  Leaf,
  ArrowRight,
  Bell,
  ScanSearch,
  MapPin,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { getBrand } from "@/lib/brands";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { cn, formatPrice, classForStock } from "@/lib/utils";
import { ProductGallery } from "./ProductGallery";
import { SizeAdvisor } from "./SizeAdvisor";
import { SizeGuide } from "./SizeGuide";
import { VirtualTryOn } from "./VirtualTryOn";
import { ShareActions } from "./ShareActions";
import { StoreAvailability } from "./StoreAvailability";

export function ProductDetail({ product }: { product: Product }) {
  const brand = getBrand(product.brandId);
  const [variantIndex, setVariantIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("details");

  const variant = product.variants[variantIndex];
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const toggleNotify = useStore((s) => s.toggleNotify);
  const viewProduct = useStore((s) => s.viewProduct);
  const wishlist = useStore((s) => s.wishlist);
  const compare = useStore((s) => s.compare);
  const notifyList = useStore((s) => s.notifyList);
  const hydrated = useHydrated();

  useEffect(() => {
    viewProduct(product.id);
  }, [product.id, viewProduct]);

  const wished = hydrated && wishlist.includes(product.id);
  const comparing = hydrated && compare.includes(product.id);
  const notified = hydrated && notifyList.includes(product.id);

  const eta = useMemo(() => {
    const start = product.sameDayEligible ? 0 : product.isPreorder ? 14 : 2;
    const end = product.sameDayEligible ? 0 : product.isPreorder ? 21 : 4;
    const d = new Date();
    d.setDate(d.getDate() + start);
    const d2 = new Date();
    d2.setDate(d2.getDate() + end);
    const fmt = (x: Date) => x.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    if (product.sameDayEligible && !product.isPreorder) return "Today with same-day delivery";
    return `${fmt(d)} – ${fmt(d2)}`;
  }, [product.isPreorder, product.sameDayEligible]);

  const selectedStock = size ? variant.inventory[size] ?? 0 : null;
  const sizeOut = size != null && (selectedStock ?? 0) <= 0;

  const handleAdd = () => {
    if (!size || sizeOut) return;
    addToCart({ productId: product.id, variantId: variant.id, size, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="shell py-8 lg:py-12">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="capitalize hover:text-ink">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} variant={variant} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.isNew && <Badge>New</Badge>}
            {product.isExclusive && <Badge>Exclusive</Badge>}
            {product.isPreorder && <Badge>Pre-order</Badge>}
            {product.isSustainable && <Badge tone="eco">Sustainable</Badge>}
            {product.sameDayEligible && <Badge>Same-day</Badge>}
          </div>

          <Link href={`/designers/${brand?.slug}`} className="link-underline mt-3 inline-block text-xs uppercase tracking-luxe text-ink-muted">
            {brand?.name}
          </Link>
          <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-[2.75rem]">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <Stars rating={product.rating} />
            <a href="#reviews" className="text-xs text-ink-muted hover:text-ink">
              {product.rating} · {product.reviewCount} reviews
            </a>
            <a href="#qa" className="text-xs text-ink-muted hover:text-ink">
              Q&amp;A
            </a>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className={cn("font-serif text-2xl", product.compareAtPrice && "text-gold-deep")}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-ink-muted line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-7">
            <p className="eyebrow">Colour — {variant.color}</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setVariantIndex(i);
                    setSize(null);
                  }}
                  aria-label={v.color}
                  aria-pressed={i === variantIndex}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 transition-transform hover:scale-105",
                    i === variantIndex ? "border-ink ring-2 ring-gold ring-offset-2 ring-offset-canvas" : "border-line"
                  )}
                  style={{ background: v.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="eyebrow">Size</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setGuideOpen(true)} className="text-xs text-ink-muted hover:text-ink hover:underline">
                  Size guide
                </button>
                <button
                  onClick={() => setAdvisorOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-gold-deep hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" /> AI size recommendation
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const stock = variant.inventory[s] ?? 0;
                const disabled = stock <= 0 && !product.isPreorder;
                return (
                  <button
                    key={s}
                    disabled={disabled}
                    onClick={() => setSize(s)}
                    className={cn(
                      "relative min-w-14 rounded-md border px-3 py-3 text-sm transition-colors",
                      size === s ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink",
                      disabled && "cursor-not-allowed border-line text-ink-muted/50 line-through hover:border-line"
                    )}
                  >
                    {s}
                    {stock > 0 && stock <= 3 && (
                      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-gold" title="Low stock" />
                    )}
                  </button>
                );
              })}
            </div>
            {size && selectedStock !== null && (
              <p
                className={cn(
                  "mt-2 text-xs",
                  classForStock(selectedStock) === "low" ? "text-gold-deep" : "text-ink-muted"
                )}
              >
                {product.isPreorder && selectedStock <= 0
                  ? "Available for pre-order · ships when restocked"
                  : selectedStock <= 0
                    ? "Currently unavailable in this size"
                    : selectedStock <= 3
                      ? `Only ${selectedStock} left in ${variant.color} · ${size}`
                      : `In stock · ${variant.color} · ${size}`}
              </p>
            )}
            {product.modelMeasurements && (
              <p className="mt-2 text-xs text-ink-muted">
                Model wears {product.modelMeasurements.sizeWorn} · {product.modelMeasurements.height}
              </p>
            )}
          </div>

          <div className="mt-7 flex flex-col gap-3">
            {sizeOut && !product.isPreorder ? (
              <button
                onClick={() => toggleNotify(product.id)}
                className={cn("btn-primary w-full", notified && "bg-[#3a4a3b]")}
              >
                <Bell className="h-4 w-4" />
                {notified ? "We'll notify you" : "Notify me when available"}
              </button>
            ) : (
              <button onClick={handleAdd} disabled={!size} className={cn("btn-primary w-full", added && "bg-[#3a4a3b]")}>
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added to bag
                  </>
                ) : !size ? (
                  "Select a size"
                ) : product.isPreorder && (selectedStock ?? 0) <= 0 ? (
                  `Pre-order — ${formatPrice(product.price)}`
                ) : (
                  `Add to bag — ${formatPrice(product.price)}`
                )}
              </button>
            )}
            <div className="flex gap-3">
              <button onClick={() => setTryOnOpen(true)} className="btn-outline flex-1">
                <Ruler className="h-4 w-4" /> Virtual try-on
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={!!wished}
                className={cn("btn-outline !px-4", wished && "border-gold bg-gold text-canvas")}
                aria-label="Add to wishlist"
              >
                <Heart className={cn("h-4 w-4", wished && "fill-current")} />
              </button>
              <button
                onClick={() => toggleCompare(product.id)}
                aria-pressed={!!comparing}
                className={cn("btn-outline !px-4", comparing && "border-gold bg-gold text-canvas")}
                aria-label="Add to compare"
              >
                <GitCompareArrows className="h-4 w-4" />
              </button>
              <ShareActions product={product} />
            </div>
            <Link
              href={`/shop?sub=${encodeURIComponent(product.subcategory)}`}
              className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-luxe text-ink-muted hover:text-ink"
            >
              <ScanSearch className="h-3.5 w-3.5" /> Find similar
            </Link>
          </div>

          <div className="mt-7 space-y-3 rounded-xl border border-line bg-canvas-raised p-5">
            <Row icon={Truck} title="Delivery-date estimate" copy={`Arrives ${eta}`} accent />
            {product.sameDayEligible && (
              <Row icon={MapPin} title="Same-day delivery" copy="Eligible in select metro areas" />
            )}
            <Row icon={RotateCcw} title="Free 30-day returns" copy="Prepaid label included in every order" />
            <Row icon={ShieldCheck} title="Guaranteed authentic" copy={`Sourced directly from ${brand?.name}`} />
          </div>

          <div className="mt-5">
            <StoreAvailability product={product} />
          </div>

          <div className="mt-7 space-y-4">
            {brand && (
              <Link
                href={`/designers/${brand.slug}`}
                className="group flex gap-4 overflow-hidden rounded-xl border border-line transition-colors hover:border-ink"
              >
                <div className="w-24 shrink-0 sm:w-28">
                  <Media seed={brand.hero} ratio="square" label={brand.name} monogram={false} sizes="112px" />
                </div>
                <div className="flex flex-1 flex-col justify-center py-3 pr-4">
                  <p className="eyebrow">Designer story</p>
                  <p className="mt-1 font-serif text-xl group-hover:text-gold">{brand.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-soft">{brand.bio}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-luxe text-ink">
                    Explore the designer <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            )}
            {product.isSustainable && (
              <div className="rounded-xl border border-[#3a4a3b]/25 bg-[#3a4a3b]/5 p-5">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-luxe text-[#3a4a3b]">
                  <Leaf className="h-4 w-4" /> Sustainability information
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  Responsibly sourced materials and ethical production. {product.materials}{" "}
                  <Link href="/journal/the-case-for-fewer-better" className="link-underline text-ink">
                    Read our sustainability story
                  </Link>
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 divide-y divide-line border-y border-line">
            <Accordion id="details" title="Details & Fit" open={openSection === "details"} onToggle={setOpenSection}>
              <ul className="space-y-1.5 text-sm text-ink-soft">
                {product.details.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="text-gold">—</span> {d}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion id="materials" title="Materials & Care" open={openSection === "materials"} onToggle={setOpenSection}>
              <p className="text-sm text-ink-soft">{product.materials}</p>
              <p className="mt-2 text-sm text-ink-soft">{product.care}</p>
              {product.materialTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.materialTags.map((m) => (
                    <Link
                      key={m}
                      href={`/shop?material=${m}`}
                      className="rounded-full border border-line px-3 py-1 text-xs capitalize hover:border-ink"
                    >
                      {m}
                    </Link>
                  ))}
                </div>
              )}
            </Accordion>
            <Accordion id="origin" title="Product origin" open={openSection === "origin"} onToggle={setOpenSection}>
              <p className="text-sm text-ink-soft">
                Country of manufacture: <strong className="font-medium text-ink">{product.countryOfOrigin}</strong>
              </p>
              {brand && (
                <p className="mt-2 text-sm text-ink-soft">
                  House based in {brand.origin}. Established {brand.since}.
                </p>
              )}
              <p className="mt-2 font-mono text-xs text-ink-muted">Barcode · {product.barcode}</p>
            </Accordion>
            <Accordion id="shipping" title="Shipping & Returns" open={openSection === "shipping"} onToggle={setOpenSection}>
              <p className="text-sm text-ink-soft">
                Complimentary express shipping on orders over $250. Standard delivery in 2–4 business days.
                Enjoy free returns within 30 days via our returns portal.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      <SizeAdvisor product={product} open={advisorOpen} onClose={() => setAdvisorOpen(false)} onPick={(s) => setSize(s)} />
      <SizeGuide product={product} open={guideOpen} onClose={() => setGuideOpen(false)} />
      <VirtualTryOn product={product} variant={variant} open={tryOnOpen} onClose={() => setTryOnOpen(false)} />
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone?: "eco" }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-luxe",
        tone === "eco" ? "bg-[#3a4a3b] text-canvas" : "bg-canvas-sunk text-ink"
      )}
    >
      {children}
    </span>
  );
}

function Row({ icon: Icon, title, copy, accent }: { icon: any; title: string; copy: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", accent ? "text-gold" : "text-ink-muted")} strokeWidth={1.5} />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-ink-muted">{copy}</p>
      </div>
    </div>
  );
}

function Accordion({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: (id: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={() => onToggle(open ? null : id)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left font-serif text-lg"
      >
        {title}
        <ChevronDown className={cn("h-5 w-5 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={cn(i <= Math.round(rating) ? "fill-gold text-gold" : "fill-transparent text-line")}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
