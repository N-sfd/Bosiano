"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LayoutGrid } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { getProduct } from "@/lib/products";
import { Media } from "@/components/Media";
import { formatPrice } from "@/lib/utils";
import { getCommunityUser } from "@/lib/community";

export default function SharedBoardPage({ params }: { params: { token: string } }) {
  const hydrated = useHydrated();
  const boards = useStore((s) => s.outfitBoards);
  const posts = useStore((s) => s.ugcPosts);

  const board = useMemo(
    () => boards.find((b) => b.shareToken === params.token && b.visibility === "public"),
    [boards, params.token]
  );

  if (!hydrated) {
    return (
      <div className="shell py-16">
        <h1 className="font-serif text-4xl">Shared board</h1>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="shell flex flex-col items-center py-24 text-center">
        <LayoutGrid className="h-8 w-8 text-ink-muted" />
        <h1 className="mt-4 font-serif text-3xl">Board not found or private</h1>
        <Link href="/boards" className="btn-primary mt-6">
          Browse boards
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-10 lg:py-14">
      <p className="eyebrow">Shared outfit board</p>
      <h1 className="mt-2 font-serif text-4xl">{board.title}</h1>
      <p className="mt-1 text-sm text-ink-muted">Curated on Bosiano</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {board.productIds.map((id) => {
          const p = getProduct(id);
          if (!p) return null;
          return (
            <Link key={id} href={`/product/${p.slug}`} className="group">
              <Media seed={p.variants[0].images[0]} ratio="portrait" className="rounded-xl" />
              <p className="mt-2 font-serif text-xl group-hover:text-gold">{p.name}</p>
              <p className="text-sm">{formatPrice(p.price)}</p>
            </Link>
          );
        })}
        {board.postIds.map((id) => {
          const post = posts.find((p) => p.id === id);
          if (!post) return null;
          return (
            <div key={id}>
              <Media seed={post.photo} ratio="portrait" className="rounded-xl" monogram={false} />
              <p className="mt-2 font-serif text-xl">{post.caption}</p>
              <p className="text-xs text-ink-muted">@{getCommunityUser(post.userId)?.handle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
