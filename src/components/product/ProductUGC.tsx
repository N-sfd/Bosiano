"use client";

import Link from "next/link";
import { Heart, Bookmark } from "lucide-react";
import type { Product } from "@/lib/types";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { postsForProduct, getCommunityUser } from "@/lib/community";
import { Media } from "@/components/Media";
import { cn } from "@/lib/utils";

export function ProductUGC({ product }: { product: Product }) {
  const hydrated = useHydrated();
  const posts = useStore((s) => s.ugcPosts);
  const liked = useStore((s) => s.likedPosts);
  const saved = useStore((s) => s.savedUgc);
  const toggleLike = useStore((s) => s.toggleLikePost);
  const toggleSave = useStore((s) => s.toggleSaveUgc);

  const approved = postsForProduct(hydrated ? posts : posts.filter((p) => p.approved), product.id);

  if (approved.length === 0) return null;

  return (
    <section className="shell border-t border-line py-14 lg:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Worn by the community</p>
          <h2 className="mt-2 font-serif text-3xl">Customer photos</h2>
          <p className="mt-1 text-sm text-ink-muted">Approved outfit uploads tagged with this piece.</p>
        </div>
        <Link href="/community" className="text-xs uppercase tracking-luxe hover:text-gold">
          View community
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {approved.slice(0, 4).map((post) => {
          const user = getCommunityUser(post.userId);
          const isLiked = hydrated && liked.includes(post.id);
          const isSaved = hydrated && saved.includes(post.id);
          return (
            <article key={post.id} className="overflow-hidden rounded-xl border border-line">
              <Media seed={post.photo} ratio="portrait" monogram={false} />
              <div className="p-3">
                <p className="text-xs text-ink-muted">@{user?.handle}</p>
                <p className="mt-1 font-serif text-lg leading-tight">{post.caption}</p>
                {post.fitNote && (
                  <p className="mt-1 text-[0.65rem] uppercase tracking-luxe text-ink-soft">Fit · {post.fitNote}</p>
                )}
                <div className="mt-2 flex gap-3 text-ink-muted">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={cn("inline-flex items-center gap-1 text-xs", isLiked && "text-gold-deep")}
                  >
                    <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} /> {post.likes}
                  </button>
                  <button onClick={() => toggleSave(post.id)} className={cn(isSaved && "text-gold-deep")}>
                    <Bookmark className={cn("h-3.5 w-3.5", isSaved && "fill-current")} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
