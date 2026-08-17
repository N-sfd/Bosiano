"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  GitCompareArrows,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Check,
  Leaf,
  ArrowRight,
  Bell,
  ScanSearch,
  MapPin,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { getBrand } from "@/lib/brands";
import { getProductBreadcrumbs } from "@/lib/products";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { addProductToAtelier } from "@/lib/atelier-storage";
import { cn, formatPrice, classForStock } from "@/lib/utils";
import { ProductGallery } from "./ProductGallery";
import { SizeAdvisor } from "./SizeAdvisor";
import { SizeGuide } from "./SizeGuide";
import { ShareActions } from "./ShareActions";
import { StoreAvailability } from "./StoreAvailability";
import { Badge } from "@/components/ui/Badge";
import { SwatchButton } from "@/components/ui/SwatchButton";
import { OptionChip } from "@/components/ui/OptionChip";
import { IconToggle } from "@/components/ui/IconToggle";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Stars } from "@/components/ui/Stars";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const brand = getBrand(product.brandId);
  const initialVariantIndex = Math.max(
    0,
    product.variants.findIndex((v) => v.colorId === product.defaultColor)
  );
  const [variantIndex, setVariantIndex] = useState(initialVariantIndex);
  const isOneSize = product.sizes.length === 1 && /^one[\s-]?size$/i.test(product.sizes[0]);
  const [size, setSize] = useState<string | null>(isOneSize ? product.sizes[0] : null);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("details");
  const [qty, setQty] = useState(1);

  const variant = product.variants[variantIndex] ?? product.variants[0];
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

  /* Reset colour / size / qty when navigating between products client-side */
  useEffect(() => {
    const idx = Math.max(
      0,
      product.variants.findIndex((v) => v.colorId === product.defaultColor)
    );
    setVariantIndex(idx);
    const oneSize = product.sizes.length === 1 && /^one[\s-]?size$/i.test(product.sizes[0]);
    setSize(oneSize ? product.sizes[0] : null);
    setQty(1);
    setAdded(false);
  }, [product.slug, product.defaultColor, product.sizes, product.variants]);

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
    addToCart({ productId: product.id, variantId: variant.id, size, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleVirtualAtelier = () => {
    if (!size) return;
    addProductToAtelier({
      id: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.imagesByColor[variant.colorId]?.[0]?.src ?? product.cardImage,
      color: variant.color,
      size,
      category: product.category,
    });
    router.push("/virtual-atelier");
  };

  return (
    <div className="shell py-8 lg:py-12">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-muted" aria-label="Breadcrumb">
        {getProductBreadcrumbs(product).map((crumb, i, all) => (
          <span key={`${crumb.label}-${i}`} className="contents">
            {i > 0 ? <span>/</span> : null}
            {crumb.href && i < all.length - 1 ? (
              <Link href={crumb.href} className="hover:text-ink">
                {crumb.label}
              </Link>
            ) : (
              <span className={i === all.length - 1 ? "text-ink" : undefined}>{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery key={`${product.slug}-${variant.colorId}`} product={product} variant={variant} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.isNew && <Badge tone="neutral">New</Badge>}
            {product.isExclusive && <Badge tone="neutral">Exclusive</Badge>}
            {product.isPreorder && <Badge tone="neutral">Pre-order</Badge>}
            {product.isSustainable && <Badge tone="eco">Sustainable</Badge>}
            {product.sameDayEligible && <Badge tone="neutral">Same-day</Badge>}
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
                <SwatchButton
                  key={v.id}
                  size="md"
                  color={v.hex}
                  selected={i === variantIndex}
                  onClick={() => {
                    setVariantIndex(i);
                    /* One-size accessories keep size selected; sized apparel resets */
                    if (!isOneSize) setSize(null);
                    setQty(1);
                  }}
                  label={v.color}
                />
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="eyebrow">{isOneSize ? "Size — One Size" : "Size"}</p>
              {!isOneSize && (
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
              )}
            </div>
            {!isOneSize && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const stock = variant.inventory[s] ?? 0;
                  const disabled = stock <= 0 && !product.isPreorder;
                  return (
                    <OptionChip
                      key={s}
                      shape="box"
                      size="md"
                      disabled={disabled}
                      selected={size === s}
                      onClick={() => {
                        setSize(s);
                        setQty(1);
                      }}
                    >
                      {s}
                      {stock > 0 && stock <= 3 && (
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-gold" title="Low stock" />
                      )}
                    </OptionChip>
                  );
                })}
              </div>
            )}
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
                    ? isOneSize
                      ? "Currently unavailable"
                      : "Currently unavailable in this size"
                    : selectedStock <= 3
                      ? `Only ${selectedStock} left in ${variant.color}${isOneSize ? "" : ` · ${size}`}`
                      : `In stock · ${variant.color}${isOneSize ? "" : ` · ${size}`}`}
              </p>
            )}
            {product.modelMeasurements && !isOneSize && (
              <p className="mt-2 text-xs text-ink-muted">
                Model wears {product.modelMeasurements.sizeWorn} · {product.modelMeasurements.height}
              </p>
            )}
          </div>

          {!sizeOut && (
            <div className="mt-5">
              <p className="eyebrow mb-3">Quantity</p>
              <QuantityStepper value={qty} onChange={setQty} max={selectedStock ?? undefined} />
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3">
            {sizeOut && !product.isPreorder ? (
              <Button onClick={() => toggleNotify(product.id)} className={cn("w-full", notified && "bg-[#3a4a3b]")}>
                <Bell className="h-4 w-4" />
                {notified ? "We'll notify you" : "Notify me when available"}
              </Button>
            ) : (
              <Button onClick={handleAdd} disabled={!size} className={cn("w-full", added && "bg-[#3a4a3b]")}>
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added to bag
                  </>
                ) : !size ? (
                  isOneSize ? `Add to bag — ${formatPrice(product.price)}` : "Select a size"
                ) : product.isPreorder && (selectedStock ?? 0) <= 0 ? (
                  `Pre-order — ${formatPrice(product.price)}`
                ) : (
                  `Add to bag — ${formatPrice(product.price)}`
                )}
              </Button>
            )}
            <div className="flex gap-3">
              <IconToggle
                active={!!wished}
                onClick={() => toggleWishlist(product.id)}
                label="Add to wishlist"
                className="h-[52px] flex-1"
              >
                <Heart className={cn("h-4 w-4", wished && "fill-current")} />
              </IconToggle>
              <IconToggle
                active={!!comparing}
                onClick={() => toggleCompare(product.id)}
                label="Add to compare"
                className="h-[52px] w-[52px]"
              >
                <GitCompareArrows className="h-4 w-4" />
              </IconToggle>
              <ShareActions product={product} />
            </div>
            <Button variant="outline" onClick={handleVirtualAtelier} disabled={!size} className="w-full">
              <Sparkles className="h-4 w-4" /> Virtual Atelier
            </Button>
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
    </div>
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
