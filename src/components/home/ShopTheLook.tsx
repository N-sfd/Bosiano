"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Plus, Camera, Upload } from "lucide-react";
import { lookPalettes, shopTheLook, shopByTags, customLookTags } from "@/lib/search";
import { getBrand } from "@/lib/brands";
import { Media } from "@/components/Media";
import { formatPrice, cn } from "@/lib/utils";

export function ShopTheLook() {
  const [palette, setPalette] = useState(lookPalettes[0].id);
  const [tags, setTags] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const active = lookPalettes.find((p) => p.id === palette)!;

  const items = useMemo(
    () => (tags.length ? shopByTags(tags, 4) : shopTheLook(palette, 4)),
    [palette, tags]
  );

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <section className="bg-canvas-sunk py-16 lg:py-24">
      <div className="shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <Media
            seed={uploaded ? "look-quiet-luxury" : `look-${palette}`}
            swatches={active.swatches}
            ratio="portrait"
            label={active.label}
            className="rounded-2xl"
            monogram={false}
            sizes="(max-width: 1024px) 100vw, 50vw"
          >
            {items.slice(0, 3).map((p, i) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group absolute flex h-8 w-8 items-center justify-center rounded-full bg-canvas-raised text-ink shadow-lg transition-transform hover:scale-110"
                style={{ top: `${28 + i * 22}%`, left: `${20 + (i % 2) * 45}%` }}
                aria-label={`Shop ${p.name}`}
              >
                <Plus className="h-4 w-4" />
                <span className="pointer-events-none absolute left-10 z-10 hidden whitespace-nowrap rounded-full bg-void px-3 py-1 text-[0.65rem] uppercase tracking-luxe text-canvas group-hover:block group-focus:block">
                  {p.name} · {formatPrice(p.price)}
                </span>
              </Link>
            ))}
          </Media>
        </div>

        <div>
          <p className="eyebrow mb-3">Shop the Look · Visual Search</p>
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
            Find your mood, shop the story
          </h2>
          <p className="mt-3 max-w-md text-sm text-ink-soft sm:text-base">
            Upload a style photo, pick custom tags, or choose an aesthetic — our visual engine
            assembles a complete, shoppable look.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={() => {
                setUploaded(true);
                setPalette("quiet-luxury");
              }}
            />
            <button onClick={() => fileRef.current?.click()} className="btn-outline !py-3">
              {uploaded ? (
                <>
                  <Camera className="h-4 w-4" /> Photo matched
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Upload style photo
                </>
              )}
            </button>
          </div>

          <p className="eyebrow mb-2 mt-6">Custom tags</p>
          <div className="flex flex-wrap gap-2">
            {customLookTags.map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs capitalize transition-colors",
                  tags.includes(t) ? "border-ink bg-void text-canvas" : "border-line hover:border-ink"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {lookPalettes.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPalette(p.id);
                  setTags([]);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                  palette === p.id && !tags.length ? "border-ink bg-void text-canvas" : "border-line hover:border-ink"
                )}
              >
                <span className="flex gap-0.5">
                  {p.swatches.map((sw) => (
                    <span key={sw} className="h-3 w-3 rounded-full" style={{ background: sw }} />
                  ))}
                </span>
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {items.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group">
                <Media
                  seed={p.variants[0].images[0]}
                  swatches={[p.variants[0].hex]}
                  ratio="square"
                  label={p.name}
                  className="rounded-lg"
                  sizes="160px"
                />
                <p className="mt-2 text-[0.65rem] uppercase tracking-luxe text-ink-muted">
                  {getBrand(p.brandId)?.name}
                </p>
                <p className="truncate font-serif text-sm">{p.name}</p>
                <p className="text-xs">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/lookbook" className="btn-primary">
              Shop complete outfits
            </Link>
            <Link href="/stylist" className="btn-outline">
              Ask AI stylist
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
