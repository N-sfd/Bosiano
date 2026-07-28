import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products, findSimilar } from "@/lib/products";
import { getBrand } from "@/lib/brands";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductQA } from "@/components/product/ProductQA";
import { ProductUGC } from "@/components/product/ProductUGC";
import { ProductRail } from "@/components/product/ProductRail";
import { RecentlyViewedRail } from "@/components/product/RecentlyViewedRail";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "Not found" };
  const brand = getBrand(product.brandId);
  return {
    title: `${product.name} — ${brand?.name}`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const similar = findSimilar(product, 8);
  const completeTheLook = findSimilar(product, 4);

  return (
    <>
      <ProductDetail product={product} />
      <ProductUGC product={product} />
      <ProductReviews product={product} />
      <ProductQA productId={product.id} />
      <section className="shell py-14 lg:py-16" id="similar">
        <SectionHeader eyebrow="More like this" title="Find similar" href={`/shop?sub=${encodeURIComponent(product.subcategory)}`} />
        <div className="mt-8">
          <ProductRail products={similar} />
        </div>
      </section>
      <section className="shell border-t border-line py-14 lg:py-16">
        <SectionHeader eyebrow="You may also like" title="Complete the look" href="/shop" />
        <div className="mt-8">
          <ProductRail products={completeTheLook} />
        </div>
      </section>
      <RecentlyViewedRail excludeId={product.id} />
    </>
  );
}
