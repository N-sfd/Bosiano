import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { journal, getArticle } from "@/lib/journal";
import { getProduct } from "@/lib/products";
import { getBrand } from "@/lib/brands";
import { Media } from "@/components/Media";
import { ProductCard } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return journal.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return { title: "Not found" };
  return { title: article.title, description: article.dek };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const more = journal.filter((a) => a.slug !== article.slug).slice(0, 3);
  const date = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const shoppable = article.productIds.map((id) => getProduct(id)).filter(Boolean);
  const brand = article.brandId ? getBrand(article.brandId) : null;

  return (
    <article className="pb-20">
      <div className="shell pt-8">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-luxe text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> The Journal
        </Link>
      </div>
      <header className="shell mx-auto max-w-3xl pt-8 text-center">
        <p className="eyebrow">{article.category}</p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{article.title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">{article.dek}</p>
        <p className="mt-6 text-xs uppercase tracking-luxe text-ink-muted">
          By {article.author} · {date} · {article.readTime} min read
          {brand ? (
            <>
              {" "}
              ·{" "}
              <Link href={`/designers/${brand.slug}`} className="hover:text-gold">
                {brand.name}
              </Link>
            </>
          ) : null}
        </p>
      </header>

      <div className="shell mt-10">
        <Media seed={article.hero} ratio="wide" label={article.title} className="rounded-2xl" monogram={false} />
      </div>

      <div className="shell mx-auto mt-12 max-w-2xl">
        {article.body.map((para, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "font-serif text-2xl leading-relaxed text-ink first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-gold"
                : "mt-6 text-lg leading-relaxed text-ink-soft"
            }
          >
            {para}
          </p>
        ))}

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-sm text-ink-muted">Written by</p>
          <p className="font-serif text-xl">{article.author}</p>
        </div>
      </div>

      {shoppable.length > 0 && (
        <section className="shell mt-16">
          <div className="mb-8 flex items-end justify-between border-b border-line pb-5">
            <div>
              <p className="eyebrow">Shop the story</p>
              <h2 className="mt-2 font-serif text-3xl">Featured products</h2>
            </div>
            <p className="text-xs text-ink-muted">{shoppable.length} pieces</p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {shoppable.map((p) =>
              p ? (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ) : null
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {shoppable.map((p) =>
              p ? (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-luxe hover:border-ink"
                >
                  {p.name} · {formatPrice(p.price)}
                </Link>
              ) : null
            )}
          </div>
        </section>
      )}

      <section className="shell mt-16">
        <h2 className="mb-8 font-serif text-3xl">Continue reading</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {more.map((a) => (
            <Link key={a.slug} href={`/journal/${a.slug}`} className="group block">
              <Media
                seed={a.hero}
                ratio="landscape"
                label={a.title}
                className="rounded-xl card-hover group-hover:scale-[1.02]"
                monogram={false}
              />
              <p className="eyebrow mt-3">{a.category}</p>
              <h3 className="mt-1 font-serif text-xl leading-tight group-hover:text-gold">{a.title}</h3>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/journal" className="btn-outline">
            All stories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
