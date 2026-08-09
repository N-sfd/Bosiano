import Link from "next/link";
import { ArrowRight, Truck, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { PersonalizedRail } from "@/components/home/PersonalizedRail";
import { ShopTheLook } from "@/components/home/ShopTheLook";
import { ProductRail } from "@/components/product/ProductRail";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/Media";
import { products } from "@/lib/products";
import { brands } from "@/lib/brands";
import { journal } from "@/lib/journal";

const categories = [
  {
    label: "Womenswear",
    href: "/shop?category=women",
    seed: "cat-women",
    swatches: ["#c8b8a8", "#8a7a6a", "#efe8e0"],
    objectPosition: "center 18%",
  },
  {
    label: "Menswear",
    href: "/shop?category=men",
    seed: "cat-men",
    swatches: ["#3a3a3c", "#6b6156", "#c2a367"],
    objectPosition: "center 15%",
  },
  {
    label: "Bags",
    href: "/shop?category=bags",
    seed: "cat-bags",
    swatches: ["#7a5236", "#a4562f", "#e0c39a"],
    objectPosition: "center center",
  },
  {
    label: "Shoes",
    href: "/shop?category=shoes",
    seed: "cat-shoes",
    swatches: ["#57606a", "#9b9a95", "#e4e0d8"],
    objectPosition: "center 40%",
  },
];

const trust = [
  { icon: Truck, title: "Complimentary shipping", copy: "Express delivery over $250" },
  { icon: RefreshCw, title: "30-day free returns", copy: "Easy, prepaid returns portal" },
  { icon: ShieldCheck, title: "Guaranteed authentic", copy: "Sourced direct from houses" },
  { icon: Sparkles, title: "Bosiano Club", copy: "Earn points on every order" },
];

export default function HomePage() {
  const newArrivals = products.filter((p) => p.isNew).concat(products).slice(0, 8);
  const bestSellers = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  const featuredBrands = brands.filter((b) => b.featured);
  const featuredJournal = journal.slice(0, 3);

  return (
    <>
      <Hero />

      {/* trust strip — full height so it isn’t clipped under the hero fold */}
      <div className="relative z-[1] border-b border-line bg-canvas-raised">
        <div className="shell grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {trust.map((t) => (
            <div key={t.title} className="flex items-center gap-3 py-6 sm:py-7 lg:justify-center lg:px-4">
              <t.icon className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
              <div className="min-w-0">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] sm:text-xs">{t.title}</p>
                <p className="mt-0.5 text-[0.7rem] leading-snug text-ink-muted">{t.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* new arrivals */}
      <section className="shell py-16 lg:py-24">
        <SectionHeader
          eyebrow="Just Landed"
          title="New This Season"
          description="The first arrivals from our designers, chosen by our editors."
          href="/shop?sort=new"
        />
        <div className="mt-8">
          <ProductRail products={newArrivals} label="new arrivals" />
        </div>
      </section>

      {/* Bosiano Collection */}
      <section className="border-y border-line bg-canvas-raised py-16 lg:py-24">
        <div className="shell">
          <SectionHeader
            eyebrow="Bosiano Collection"
            title="The Bosiano Edit"
            description="Crest hardware, leather emboss, and quiet embroidery — house pieces with integrated branding, never watermarks."
            href="/shop?collection=house&brand=bosiano"
          />
          <div className="mt-8">
            <ProductRail
              products={products.filter((p) => p.brandId === "bosiano")}
              label="bosiano collection"
            />
          </div>
        </div>
      </section>

      {/* Signature hardware moment */}
      <section className="shell py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-canvas-sunk">
            <Media
              seed="/brand/crest-metal-hardware.png"
              ratio="portrait"
              label="Bosiano crest hardware"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="eyebrow">Signature hardware</p>
            <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">The Bosiano crest lock</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
              The Shield Crest is Bosiano’s iconic hardware signature — satin and brushed gold on
              clasps, locks, and leather tags. The B monogram handles the smallest details: buttons,
              crowns, zipper pulls, and jewelry clasps.
            </p>
            <Link
              href="/shop?brand=bosiano&category=bags"
              className="btn-primary mt-8 inline-flex items-center gap-2"
            >
              Shop leather &amp; hardware <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Designer Marketplace */}
      <section className="border-y border-line py-16 lg:py-24">
        <div className="shell">
          <SectionHeader
            eyebrow="Designer Marketplace"
            title="Curated houses"
            description="Authentic designer pieces with their original branding intact — filter by house."
            href="/shop?collection=marketplace"
          />
          <div className="mt-8">
            <ProductRail
              products={products.filter((p) => p.brandId !== "bosiano").slice(0, 8)}
              label="designer marketplace"
            />
          </div>
        </div>
      </section>

      {/* category tiles */}
      <section className="shell pb-16 lg:pb-24">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.08}>
              <Link href={c.href} className="group block overflow-hidden rounded-2xl">
                <Media
                  seed={c.seed}
                  swatches={c.swatches}
                  ratio="tall"
                  objectPosition={c.objectPosition}
                  className="[&_img]:duration-700 group-hover:[&_img]:scale-105"
                  monogram={false}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                >
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10 p-5 sm:p-6">
                    <p className="font-serif text-xl leading-tight text-canvas drop-shadow-sm sm:text-2xl lg:text-[1.65rem]">
                      {c.label}
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[0.68rem] font-medium uppercase tracking-luxe text-canvas/90">
                      Shop now <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Media>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <PersonalizedRail />

      {/* editorial split */}
      <section className="bg-void text-canvas">
        <div className="shell grid gap-0 lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center py-14 lg:order-1 lg:pr-16">
            <p className="eyebrow !text-canvas/70 mb-4">The Bosiano Journal</p>
            <h2 className="font-serif text-4xl leading-tight sm:text-5xl">The New Tailoring: Softness as Strength</h2>
            <p className="mt-4 max-w-md text-canvas/80">
              How a generation of designers is rewriting the rules of the suit — trading rigidity for
              fluid, lived-in power.
            </p>
            <Link
              href="/journal/the-new-tailoring"
              className="mt-8 inline-flex w-fit items-center gap-2 border border-canvas/50 px-8 py-4 text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-canvas hover:text-ink"
            >
              Read the story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            <Media seed="journal-tailoring" ratio="landscape" className="h-full min-h-[320px] w-full lg:min-h-[520px]" monogram={false} sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <ShopTheLook />

      {/* featured designers */}
      <section className="shell py-16 lg:py-24">
        <SectionHeader
          eyebrow="The Houses"
          title="Featured Designers"
          description="Each with a distinct point of view. Explore their worlds."
          href="/designers"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {featuredBrands.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.05}>
              <Link href={`/designers/${b.slug}`} className="group block">
                <Media seed={b.hero} ratio="portrait" label={b.name} className="rounded-xl card-hover group-hover:scale-[1.03]" />
                <p className="mt-3 font-serif text-xl">{b.name}</p>
                <p className="text-xs text-ink-muted">{b.origin} · Est. {b.since}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* best sellers */}
      <section className="shell pb-16 lg:pb-24">
        <SectionHeader eyebrow="Most Loved" title="Bestsellers" href="/shop?sort=popular" />
        <div className="mt-8">
          <ProductRail products={bestSellers} label="bestsellers" />
        </div>
      </section>

      {/* journal preview */}
      <section className="bg-canvas-sunk py-16 lg:py-24">
        <div className="shell">
          <SectionHeader eyebrow="Stories" title="From The Journal" href="/journal" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredJournal.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.08}>
                <Link href={`/journal/${a.slug}`} className="group block">
                  <Media seed={a.hero} ratio="landscape" label={a.title} className="rounded-xl card-hover group-hover:scale-[1.02]" monogram={false} />
                  <p className="eyebrow mt-4">{a.category} · {a.readTime} min read</p>
                  <h3 className="mt-2 font-serif text-2xl leading-tight group-hover:text-gold">{a.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{a.dek}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* loyalty CTA */}
      <section className="shell py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl">
          <Media seed="loyalty-club" swatches={["#2f3033", "#8a6a2c", "#c2a367"]} ratio="wide" className="min-h-[340px]" monogram={false} sizes="100vw">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-void/50 p-8 text-center text-ink">
              <p className="eyebrow !text-canvas/80">Bosiano Club</p>
              <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                Rewards worthy of your wardrobe
              </h2>
              <p className="mt-3 max-w-lg text-canvas/85">
                Earn points on every purchase, unlock private previews, early access to sales, and
                complimentary alterations.
              </p>
              <Link
                href="/rewards"
                className="mt-7 bg-canvas px-8 py-4 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold hover:text-void"
              >
                Join the Club
              </Link>
            </div>
          </Media>
        </div>
      </section>
    </>
  );
}
