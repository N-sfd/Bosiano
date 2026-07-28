import type { Metadata } from "next";
import Link from "next/link";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Bosianos is a curated luxury marketplace uniting the world's most considered designers.",
};

const values = [
  { title: "Considered curation", copy: "We partner only with designers whose craft, ethics, and vision we admire — quality over quantity, always." },
  { title: "Service without compromise", copy: "From express delivery to complimentary alterations, every touchpoint is designed to feel effortless." },
  { title: "Technology with taste", copy: "AI-powered discovery, virtual try-on, and personalization — in service of a more human way to shop." },
];

const stats = [
  { value: "8", label: "Founding designers" },
  { value: "40+", label: "Countries served" },
  { value: "98%", label: "Would recommend" },
  { value: "24/7", label: "Client care" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-canvas">
        <Media seed="about-hero" swatches={["#141414", "#6b6156", "#c2a367"]} ratio="auto" className="absolute inset-0 h-full w-full opacity-60" monogram={false} />
        <div className="shell relative py-24 text-center lg:py-32">
          <p className="eyebrow !text-canvas/70">Our Story</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            A new home for considered design
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-canvas/85">
            Bosianos was founded on a simple belief: that discovering exceptional design should feel as
            beautiful as the pieces themselves.
          </p>
        </div>
      </section>

      <section className="shell py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Media seed="about-editorial" ratio="landscape" label="Bosianos" className="rounded-2xl" monogram={false} />
          <div>
            <p className="eyebrow">The idea</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">Where the world&apos;s ateliers meet</h2>
            <p className="mt-4 text-ink-soft">
              We built Bosianos to bring together independent houses and established makers on one
              considered platform — a marketplace with the intimacy of a boutique and the reach of the
              world.
            </p>
            <p className="mt-4 text-ink-soft">
              Every designer is chosen by hand. Every piece is guaranteed authentic. And every
              experience — from the first scroll to the final unboxing — is crafted with intention.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-canvas-sunk py-16 lg:py-24">
        <div className="shell">
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div>
                  <span className="font-serif text-5xl text-gold">0{i + 1}</span>
                  <h3 className="mt-4 font-serif text-2xl">{v.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{v.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-serif text-5xl text-ink">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-luxe text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell pb-24 text-center">
        <h2 className="font-serif text-4xl">Explore the marketplace</h2>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/shop" className="btn-primary">Shop now</Link>
          <Link href="/designers" className="btn-outline">Meet the designers</Link>
        </div>
      </section>
    </>
  );
}
