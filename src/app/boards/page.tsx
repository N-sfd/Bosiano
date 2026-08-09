"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Globe, Lock, Share2, Plus, Check } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { getProduct } from "@/lib/products";
import { Media } from "@/components/Media";
import { formatPrice, cn } from "@/lib/utils";
import { getCommunityUser } from "@/lib/community";
import { products } from "@/lib/products";

export default function BoardsPage() {
  const hydrated = useHydrated();
  const boards = useStore((s) => s.outfitBoards);
  const posts = useStore((s) => s.ugcPosts);
  const createBoard = useStore((s) => s.createOutfitBoard);
  const addToBoard = useStore((s) => s.addToOutfitBoard);
  const shareBoard = useStore((s) => s.shareOutfitBoard);
  const setVisibility = useStore((s) => s.setBoardVisibility);
  const referralCode = useStore((s) => s.referralCode);

  const [title, setTitle] = useState("");
  const [activeId, setActiveId] = useState(boards[0]?.id ?? "");
  const [pickProduct, setPickProduct] = useState(products[0]?.id ?? "");
  const [copied, setCopied] = useState<string | null>(null);

  const board = useMemo(
    () => boards.find((b) => b.id === activeId) ?? boards[0],
    [boards, activeId]
  );

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow inline-flex items-center gap-2">
          <LayoutGrid className="h-3.5 w-3.5 text-gold" /> Social sharing
        </p>
        <h1 className="mt-3 font-serif text-5xl">Outfit boards</h1>
        <p className="mt-4 text-ink-soft">
          Pinterest-style collections you can keep private or share — plus referral links for friends.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {boards.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveId(b.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm",
              board?.id === b.id ? "border-ink bg-void text-canvas" : "border-line"
            )}
          >
            {b.title}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New board name"
          className="rounded-lg border border-line px-4 py-2 text-sm"
        />
        <button
          onClick={() => {
            if (!title.trim()) return;
            createBoard(title.trim());
            setTitle("");
          }}
          className="btn-outline !py-2"
        >
          <Plus className="h-4 w-4" /> Create board
        </button>
      </div>

      {board && (
        <section className="mt-8 rounded-2xl border border-line p-5 lg:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl">{board.title}</h2>
              <p className="mt-1 text-xs uppercase tracking-luxe text-ink-muted">
                {board.visibility} · {board.productIds.length} products · {board.postIds.length} looks
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setVisibility(board.id, board.visibility === "public" ? "private" : "public")}
                className="btn-outline !py-2"
              >
                {board.visibility === "public" ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {board.visibility === "public" ? "Public" : "Private"}
              </button>
              <button
                onClick={() => {
                  const token = shareBoard(board.id);
                  const url = `${window.location.origin}/boards/share/${token}`;
                  copy(url, "board");
                }}
                className="btn-primary !py-2"
              >
                {copied === "board" ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {copied === "board" ? "Link copied" : "Share board"}
              </button>
              <button
                onClick={() =>
                  copy(`${window.location.origin}/account/referrals?ref=${referralCode}`, "ref")
                }
                className="btn-outline !py-2"
              >
                {copied === "ref" ? "Referral copied" : `Referral · ${hydrated ? referralCode : "AMELIA25"}`}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <select
              value={pickProduct}
              onChange={(e) => setPickProduct(e.target.value)}
              className="rounded-lg border border-line px-3 py-2 text-sm"
            >
              {products.slice(0, 16).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button onClick={() => addToBoard(board.id, pickProduct)} className="btn-outline !py-2">
              Add product
            </button>
            <a
              href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.href : "https://bosiano.com/boards"
              )}&description=${encodeURIComponent(board.title)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline !py-2"
            >
              Pin to Pinterest
            </a>
            <a
              href={`https://www.instagram.com/`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline !py-2"
            >
              Instagram
            </a>
            <a href={`https://www.tiktok.com/`} target="_blank" rel="noreferrer" className="btn-outline !py-2">
              TikTok
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {board.productIds.map((id) => {
              const p = getProduct(id);
              if (!p) return null;
              return (
                <Link key={id} href={`/product/${p.slug}`} className="group">
                  <Media seed={p.variants[0].images[0]} swatches={[p.variants[0].hex]} ratio="portrait" className="rounded-xl" />
                  <p className="mt-2 font-serif text-lg group-hover:text-gold">{p.name}</p>
                  <p className="text-sm text-ink-muted">{formatPrice(p.price)}</p>
                </Link>
              );
            })}
            {board.postIds.map((id) => {
              const post = posts.find((p) => p.id === id);
              if (!post) return null;
              const user = getCommunityUser(post.userId);
              return (
                <Link key={id} href="/community" className="group">
                  <Media seed={post.photo} ratio="portrait" className="rounded-xl" monogram={false} />
                  <p className="mt-2 font-serif text-lg group-hover:text-gold">{post.caption}</p>
                  <p className="text-xs text-ink-muted">@{user?.handle}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <p className="mt-8 text-center text-sm text-ink-muted">
        Also share wishlists from{" "}
        <Link href="/wishlist" className="link-underline">
          Wishlist
        </Link>{" "}
        and product cards from any PDP.
      </p>
    </div>
  );
}
