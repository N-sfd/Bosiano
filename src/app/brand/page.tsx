import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { brand } from "@/config/brand";
import { BosianoBrand } from "@/components/brand/BosianoBrand";
import { BrandApplications } from "@/components/brand/BrandApplications";
import { BrandIdentitySystem } from "@/components/brand/BrandIdentitySystem";

export const metadata: Metadata = {
  title: "Brand",
  description: `${brand.displayName} — Shield crest, B monogram, wordmark, and full lockup. Italian heritage identity system.`,
};

export default function BrandPage() {
  return (
    <main>
      {/* Hero — full lockup for brand-building */}
      <section className="hero-wash border-b border-line">
        <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
          <div className="mt-8">
            <BosianoBrand variant="crest-full" size="xl" priority />
          </div>
          <p className="mt-8 max-w-lg text-sm leading-relaxed text-ink-soft sm:text-base">
            Recognised by design language — shield hardware, the B at small scale, an elegant
            wordmark, and the full lockup reserved for flagship moments.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/shop?collection=house&brand=bosiano" className="btn-primary">
              Shop the Collection
            </Link>
            <Link href="/journal" className="btn-outline">
              {brand.journalName}
            </Link>
          </div>
        </div>
      </section>

      {/* Identity system + matrix */}
      <section className="shell py-20">
        <BrandIdentitySystem />
      </section>

      {/* Story */}
      <section className="section-surface border-y border-line py-20">
        <div className="shell mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Brand story</p>
            <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Italian heritage, worn lightly</h1>
            <p className="mt-5 text-sm leading-relaxed text-ink-soft sm:text-base">
              {brand.displayName} was founded to unite considered design with the discipline of Italian
              craft. The Shield Crest is the iconic hardware signature. The B Monogram is the everyday
              detail. The wordmark conveys elegance in packaging and digital. The full lockup is earned.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
              Leather emphasises craftsmanship — blind emboss, small gold crest hardware, interior foil —
              never oversized printed logos on the exterior.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-canvas-sunk">
            <Image
              src={brand.assets.applications.hardware}
              alt=""
              fill
              className="object-contain p-10"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Emblem */}
      <section className="border-y border-line bg-void py-20 text-canvas">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex justify-center">
            <BosianoBrand variant="crest-simple" size="xl" decorative />
          </div>
          <div>
            <p className="text-[0.68rem] font-medium uppercase tracking-luxe text-gold">Defining element</p>
            <h2 className="mt-3 font-serif text-3xl text-canvas sm:text-4xl">The Shield Crest</h2>
            <p className="mt-4 text-sm leading-relaxed text-canvas/70 sm:text-base">
              Handbags, wallets, travel goods, lock hardware, leather tags, and the watch dial at twelve.
              Finishes: satin gold, brushed gold, antique gold, matte champagne — never mirror polish for
              everyday pieces.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-canvas/70">
              <li>· B monogram for buttons, crowns, clasps, and jewelry at small scale</li>
              <li>· Wordmark for perfume, neck labels, dust bags, footer, and invoices</li>
              <li>· Full crest + wordmark for header, campaigns, shopping bags, and gift boxes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Packaging */}
      <section className="shell py-20">
        <p className="eyebrow">Packaging</p>
        <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Where the full identity shines</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Shopping bag",
              copy: "Gold foil BOSIANO wordmark, small embossed crest, premium rope handles. Full lockup permitted.",
            },
            {
              title: "Gift box",
              copy: "Full crest and wordmark in gold foil. Magnetic closure. Italian cream textured paper.",
            },
            {
              title: "Dust bag",
              copy: "Gold wordmark and small shield crest on heavy cotton or linen.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-canvas-card p-6">
              <h3 className="font-serif text-xl text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Applications */}
      <section className="section-surface border-t border-line py-20">
        <div className="shell">
          <BrandApplications />
        </div>
      </section>

      {/* CTA */}
      <section className="shell py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Bosiano Collection</p>
            <h2 className="mt-2 font-serif text-3xl text-ink">Leather · Time · Fragrance · Cloth</h2>
            <p className="mt-4 text-sm text-ink-soft">
              House pieces with integrated shield hardware, B details, and wordmark labels — never
              watermarks on product photography.
            </p>
            <Link href="/shop?collection=house&brand=bosiano" className="btn-primary mt-8 inline-flex">
              View collection
            </Link>
          </div>
          <div className="rounded-2xl bg-void p-10 text-canvas">
            <p className="text-[0.68rem] uppercase tracking-luxe text-gold">{brand.journalName}</p>
            <h2 className="mt-3 font-serif text-3xl text-canvas">Stories of craft</h2>
            <p className="mt-3 text-sm text-canvas/70">
              Essays on Italian ateliers, material science, and how quiet luxury is worn.
            </p>
            <Link href="/journal" className="mt-8 inline-flex text-[0.78rem] uppercase tracking-[0.14em] text-gold hover:text-gold-soft">
              Read The Journal →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
