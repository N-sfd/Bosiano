import type { Metadata } from "next";
import Link from "next/link";
import { brands } from "@/lib/brands";
import { products } from "@/lib/products";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Designers",
  description: "Explore the houses of Bosiano — each with a distinct point of view, curated for the discerning.",
};

export default function DesignersPage() {
  return (
    <div className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">The Houses</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight sm:text-6xl">Our Designers</h1>
        <p className="mt-4 text-ink-soft">
          A carefully assembled family of designers from around the world, each chosen for their craft,
          vision, and integrity.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {brands.map((b, i) => {
          const count = products.filter((p) => p.brandId === b.id).length;
          return (
            <Reveal key={b.id} delay={(i % 2) * 0.08}>
              <Link href={`/designers/${b.slug}`} className="group block overflow-hidden rounded-2xl">
                <Media seed={b.hero} ratio="wide" label={b.name} className="card-hover group-hover:scale-[1.03]" monogram={false}>
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/75 via-ink/10 to-transparent p-7 text-ink">
                    <p className="font-serif text-3xl">{b.name}</p>
                    <p className="mt-1 max-w-md text-sm text-canvas/85">{b.tagline}</p>
                    <p className="mt-3 text-[0.65rem] uppercase tracking-luxe text-canvas/70">
                      {b.origin} · Est. {b.since} · {count} pieces
                    </p>
                  </div>
                </Media>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
