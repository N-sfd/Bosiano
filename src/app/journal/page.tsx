"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { journal, journalCategories } from "@/lib/journal";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export default function JournalPage() {
  const [category, setCategory] = useState("All");
  const filtered = useMemo(
    () => (category === "All" ? journal : journal.filter((a) => a.category === category)),
    [category]
  );
  const [lead, ...rest] = filtered.length ? filtered : journal;

  return (
    <div className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Stories & Ideas</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight sm:text-6xl">The Bosiano Journal</h1>
        <p className="mt-4 text-ink-soft">
          Designer interviews, craftsmanship, runway, celebrity styling, care guides — every story shoppable.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {["All", ...journalCategories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs uppercase tracking-luxe",
              category === c ? "border-ink bg-ink text-canvas" : "border-line text-ink-soft"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <Link
        href={`/journal/${lead.slug}`}
        className="group mt-10 grid overflow-hidden rounded-2xl border border-line lg:grid-cols-2"
      >
        <Media
          seed={lead.hero}
          ratio="landscape"
          label={lead.title}
          className="h-full min-h-[280px] card-hover group-hover:scale-[1.02]"
          monogram={false}
        />
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <p className="eyebrow">
            {lead.category} · {lead.readTime} min read · {lead.productIds.length} shoppable
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight group-hover:text-gold">{lead.title}</h2>
          <p className="mt-3 text-ink-soft">{lead.dek}</p>
          <p className="mt-4 text-xs text-ink-muted">By {lead.author}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-luxe">
            Read story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((a, i) => (
          <Reveal key={a.slug} delay={(i % 3) * 0.08}>
            <Link href={`/journal/${a.slug}`} className="group block">
              <Media
                seed={a.hero}
                ratio="landscape"
                label={a.title}
                className="rounded-xl card-hover group-hover:scale-[1.02]"
                monogram={false}
              />
              <p className="eyebrow mt-4">
                {a.category} · {a.readTime} min
              </p>
              <h3 className="mt-2 font-serif text-2xl leading-tight group-hover:text-gold">{a.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{a.dek}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
