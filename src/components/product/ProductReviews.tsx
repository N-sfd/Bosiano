import type { Product } from "@/lib/types";
import { getReviews, ratingBreakdown } from "@/lib/reviews";
import { Stars } from "@/components/ui/Stars";
import { CheckCircle2 } from "lucide-react";

export function ProductReviews({ product }: { product: Product }) {
  const reviews = getReviews(product);
  const breakdown = ratingBreakdown(product);
  const fitLabel = { small: "Runs small", true: "True to size", large: "Runs large" };

  return (
    <section id="reviews" className="border-t border-line bg-canvas-raised">
      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
          {/* summary */}
          <div>
            <h2 className="font-serif text-3xl">Reviews</h2>
            <div className="mt-4 flex items-end gap-3">
              <span className="font-serif text-5xl">{product.rating.toFixed(1)}</span>
              <div className="pb-1">
                <Stars rating={product.rating} size={16} />
                <p className="mt-1 text-xs text-ink-muted">{product.reviewCount} verified reviews</p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {[5, 4, 3, 2, 1].map((star, i) => (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-3 text-ink-muted">{star}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas-sunk">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${breakdown[4 - i]}%` }} />
                  </div>
                  <span className="w-8 text-right text-ink-muted">{breakdown[4 - i]}%</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-line p-4 text-sm">
              <p className="text-ink-muted">Fit feedback</p>
              <p className="mt-1 font-medium">Most say: True to size</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-canvas-sunk">
                <div className="h-full w-3/4 rounded-full bg-ink" />
              </div>
              <div className="mt-1 flex justify-between text-[0.65rem] uppercase tracking-luxe text-ink-muted">
                <span>Small</span>
                <span>True</span>
                <span>Large</span>
              </div>
            </div>
          </div>

          {/* list */}
          <div className="space-y-8">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-line pb-8">
                <div className="flex items-center justify-between">
                  <Stars rating={r.rating} />
                  <span className="text-xs text-ink-muted">{r.date}</span>
                </div>
                <h3 className="mt-3 font-serif text-xl">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
                  <span className="font-medium text-ink">{r.author}</span>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-[#3a4a3b]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified purchase
                    </span>
                  )}
                  <span>Fit: {fitLabel[r.fit]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
