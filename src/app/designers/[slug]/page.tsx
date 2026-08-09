import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight, Leaf, Play } from "lucide-react";
import { brands, getBrand, relatedBrands } from "@/lib/brands";
import { products } from "@/lib/products";
import { articlesForBrand } from "@/lib/journal";
import { Media } from "@/components/Media";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { FollowDesignerButton } from "@/components/designers/FollowDesignerButton";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const brand = getBrand(params.slug);
  if (!brand) return { title: "Not found" };
  return { title: brand.name, description: brand.bio };
}

export default function DesignerPage({ params }: { params: { slug: string } }) {
  const brand = getBrand(params.slug);
  if (!brand) notFound();

  const brandProducts = products.filter((p) => p.brandId === brand.id);
  const newArrivals = [...brandProducts].filter((p) => p.isNew).slice(0, 4);
  const bestSellers = [...brandProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
  const editorial = articlesForBrand(brand.id);
  const related = relatedBrands(brand.id);
  const collections = brand.collections ?? [];

  return (
    <>
      <section className="relative overflow-hidden bg-void text-canvas">
        <Media seed={brand.hero} ratio="auto" className="absolute inset-0 h-full w-full opacity-70" monogram={false} />
        <div className="shell relative flex min-h-[52vh] flex-col justify-end py-16">
          <p className="font-serif text-2xl tracking-[0.2em] text-canvas/70">{brand.logotype}</p>
          <h1 className="mt-3 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">{brand.name}</h1>
          <p className="mt-4 max-w-xl text-lg text-canvas/85">{brand.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-5 text-[0.7rem] uppercase tracking-luxe text-canvas/70">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> {brand.origin}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> Est. {brand.since}
            </span>
            <span>{brandProducts.length} pieces</span>
          </div>
          <div className="mt-6">
            <FollowDesignerButton brand={brand} />
          </div>
        </div>
      </section>

      <section className="shell py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="eyebrow">Brand story</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">A world of its own</h2>
            <p className="mt-4 text-ink-soft">{brand.bio}</p>
            {brand.sustainability && (
              <p className="mt-4 inline-flex items-start gap-2 text-sm text-ink-soft">
                <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {brand.sustainability}
              </p>
            )}
            {editorial[0] && (
              <Link
                href={`/journal/${editorial[0].slug}`}
                className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-luxe hover:text-gold"
              >
                Editorial story <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <Media
            seed={`${brand.hero}-editorial`}
            ratio="landscape"
            label={brand.name}
            className="rounded-2xl"
            monogram={false}
          />
        </div>
      </section>

      {collections.length > 0 && (
        <section className="bg-canvas-sunk py-12">
          <div className="shell">
            <p className="eyebrow">Collections</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {collections.map((c) => (
                <Link
                  key={c}
                  href={`/shop?brand=${brand.id}`}
                  className="rounded-full border border-line bg-canvas-raised px-5 py-2 text-sm hover:border-ink"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="shell py-14">
          <h2 className="mb-6 font-serif text-3xl">New arrivals</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {newArrivals.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="shell pb-14">
        <h2 className="mb-6 font-serif text-3xl">Best sellers</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {(bestSellers.length ? bestSellers : brandProducts.slice(0, 4)).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell pb-14">
        <div className="mb-8 flex items-end justify-between border-b border-line pb-5">
          <h2 className="font-serif text-3xl">Shop {brand.name}</h2>
          <Link href={`/shop?brand=${brand.id}`} className="text-xs uppercase tracking-luxe hover:text-gold">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {brandProducts.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.05}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {brand.videoSeed && (
        <section className="shell pb-14">
          <div className="relative overflow-hidden rounded-2xl">
            <Media seed={brand.videoSeed} ratio="wide" className="opacity-90" monogram={false} />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-canvas/90 text-ink">
                <Play className="h-6 w-6 fill-current" />
              </span>
            </div>
            <p className="absolute bottom-4 left-4 text-xs uppercase tracking-luxe text-ink">House film</p>
          </div>
        </section>
      )}

      {editorial.length > 0 && (
        <section className="shell pb-14">
          <h2 className="mb-6 font-serif text-3xl">Editorial stories</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {editorial.map((a) => (
              <Link key={a.slug} href={`/journal/${a.slug}`} className="group block">
                <Media seed={a.hero} ratio="landscape" className="rounded-xl" monogram={false} />
                <p className="eyebrow mt-3">{a.category}</p>
                <h3 className="mt-1 font-serif text-xl group-hover:text-gold">{a.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-canvas-sunk py-16">
        <div className="shell">
          <h2 className="mb-8 font-serif text-3xl">Related designers</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((b) => (
              <Link key={b.id} href={`/designers/${b.slug}`} className="group block">
                <Media
                  seed={b.hero}
                  ratio="portrait"
                  label={b.name}
                  className="rounded-xl card-hover group-hover:scale-[1.03]"
                />
                <p className="mt-3 font-serif text-xl">{b.name}</p>
                <p className="text-xs text-ink-muted">{b.origin}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
