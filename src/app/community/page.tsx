"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Bookmark,
  Flag,
  UserPlus,
  Upload,
  MessageCircle,
  Share2,
} from "lucide-react";
import { communityUsers, getCommunityUser } from "@/lib/community";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { getProduct } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";
import { products } from "@/lib/products";

const photoSeeds = [
  "look-quiet-luxury",
  "look-romantic-evening",
  "look-riviera",
  "look-modern-utility",
  "look-artisan",
  "hero-autumn-campaign",
];

export default function CommunityPage() {
  const hydrated = useHydrated();
  const posts = useStore((s) => s.ugcPosts);
  const followed = useStore((s) => s.followedUsers);
  const liked = useStore((s) => s.likedPosts);
  const saved = useStore((s) => s.savedUgc);
  const toggleFollow = useStore((s) => s.toggleFollowUser);
  const toggleLike = useStore((s) => s.toggleLikePost);
  const toggleSave = useStore((s) => s.toggleSaveUgc);
  const report = useStore((s) => s.reportUgc);
  const upload = useStore((s) => s.uploadUgc);
  const boards = useStore((s) => s.outfitBoards);
  const addToBoard = useStore((s) => s.addToOutfitBoard);

  const [caption, setCaption] = useState("");
  const [tip, setTip] = useState("");
  const [fitNote, setFitNote] = useState("");
  const [photo, setPhoto] = useState(photoSeeds[0]);
  const [tags, setTags] = useState<string[]>(["sculpted-wool-blazer"]);
  const [filter, setFilter] = useState<"all" | "following" | "saved">("all");
  const [toast, setToast] = useState<string | null>(null);

  const feed = useMemo(() => {
    let list = posts.filter((p) => !p.reported);
    if (filter === "following") list = list.filter((p) => followed.includes(p.userId));
    if (filter === "saved") list = list.filter((p) => saved.includes(p.id));
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }, [posts, filter, followed, saved]);

  const toggleTag = (id: string) =>
    setTags((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id].slice(0, 4)));

  const submit = () => {
    if (!caption.trim() || tags.length === 0) return;
    upload({ photo, caption: caption.trim(), tip: tip || undefined, fitNote: fitNote || undefined, productIds: tags });
    setCaption("");
    setTip("");
    setFitNote("");
    setToast("Outfit uploaded — pending community moderation (demo-approved).");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">User-generated content</p>
        <h1 className="mt-3 font-serif text-5xl">Community looks</h1>
        <p className="mt-4 text-ink-soft">
          Upload outfits, tag purchases, share fit notes and tips. Follow creators, like and save looks —
          approved photos appear on product pages.
        </p>
        <Link href="/boards" className="mt-4 inline-flex text-xs uppercase tracking-luxe hover:text-gold">
          Pinterest-style boards →
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-line p-5 lg:p-6">
        <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl">
          <Upload className="h-5 w-5 text-gold" /> Upload outfit photo
        </h2>
        <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
          <div>
            <p className="mb-2 text-[0.65rem] uppercase tracking-luxe text-ink-muted">Photo</p>
            <div className="grid grid-cols-3 gap-2">
              {photoSeeds.map((s) => (
                <button
                  key={s}
                  onClick={() => setPhoto(s)}
                  className={cn("overflow-hidden rounded-lg border-2", photo === s ? "border-ink" : "border-transparent")}
                >
                  <Media seed={s} ratio="portrait" monogram={false} />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption your look"
              className="w-full rounded-lg border border-line px-4 py-3 text-sm"
            />
            <input
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              placeholder="Styling tip (optional)"
              className="w-full rounded-lg border border-line px-4 py-3 text-sm"
            />
            <input
              value={fitNote}
              onChange={(e) => setFitNote(e.target.value)}
              placeholder="Fit information e.g. TTS · 170cm"
              className="w-full rounded-lg border border-line px-4 py-3 text-sm"
            />
            <div>
              <p className="mb-2 text-[0.65rem] uppercase tracking-luxe text-ink-muted">Tag purchased items</p>
              <div className="flex flex-wrap gap-2">
                {products.slice(0, 10).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => toggleTag(p.id)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs",
                      tags.includes(p.id) ? "border-ink bg-ink text-canvas" : "border-line"
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={submit} className="btn-primary">
              Share look
            </button>
            {toast && <p className="text-sm text-gold-deep">{toast}</p>}
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(
            [
              ["all", "All"],
              ["following", "Following"],
              ["saved", "Saved"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs uppercase tracking-luxe",
                filter === id ? "border-ink bg-ink text-canvas" : "border-line"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {communityUsers
            .filter((u) => u.id !== "user-amelia")
            .map((u) => {
              const isFollowing = hydrated && followed.includes(u.id);
              return (
                <button
                  key={u.id}
                  onClick={() => toggleFollow(u.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
                    isFollowing ? "border-gold text-gold-deep" : "border-line"
                  )}
                >
                  <UserPlus className="h-3 w-3" />
                  {isFollowing ? `Following @${u.handle}` : `Follow @${u.handle}`}
                </button>
              );
            })}
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {feed.map((post) => {
          const user = getCommunityUser(post.userId);
          const isLiked = hydrated && liked.includes(post.id);
          const isSaved = hydrated && saved.includes(post.id);
          return (
            <article key={post.id} className="overflow-hidden rounded-2xl border border-line">
              <Media seed={post.photo} ratio="portrait" monogram={false} />
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full">
                      <Media seed={user?.avatar ?? "cat-women"} ratio="square" monogram={false} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">@{user?.handle}</p>
                      <p className="text-[0.65rem] text-ink-muted">{user?.bio}</p>
                    </div>
                  </div>
                  {user && user.id !== "user-amelia" && (
                    <button
                      onClick={() => toggleFollow(user.id)}
                      className="text-[0.65rem] uppercase tracking-luxe text-gold-deep"
                    >
                      {followed.includes(user.id) ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
                <p className="mt-3 font-serif text-xl leading-tight">{post.caption}</p>
                {post.tip && (
                  <p className="mt-2 inline-flex items-start gap-1 text-sm text-ink-soft">
                    <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" /> {post.tip}
                  </p>
                )}
                {post.fitNote && (
                  <p className="mt-1 text-xs uppercase tracking-luxe text-ink-muted">Fit · {post.fitNote}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.productIds.map((id) => {
                    const p = getProduct(id);
                    if (!p) return null;
                    return (
                      <Link
                        key={id}
                        href={`/product/${p.slug}`}
                        className="rounded-full border border-line px-2.5 py-1 text-[0.65rem] hover:border-ink"
                      >
                        {p.name} · {formatPrice(p.price)}
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-3 text-ink-muted">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={cn("inline-flex items-center gap-1 text-sm", isLiked && "text-gold-deep")}
                    aria-label="Like"
                  >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-current")} /> {post.likes}
                  </button>
                  <button
                    onClick={() => toggleSave(post.id)}
                    className={cn(isSaved && "text-gold-deep")}
                    aria-label="Save look"
                  >
                    <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                  </button>
                  {boards[0] && (
                    <button
                      onClick={() => {
                        addToBoard(boards[0].id, undefined, post.id);
                        setToast("Saved to outfit board");
                        setTimeout(() => setToast(null), 1500);
                      }}
                      className="text-[0.65rem] uppercase tracking-luxe hover:text-ink"
                    >
                      Add to board
                    </button>
                  )}
                  <button
                    onClick={() => {
                      report(post.id);
                      setToast("Thanks — content flagged for review");
                      setTimeout(() => setToast(null), 2000);
                    }}
                    className="ml-auto inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-luxe hover:text-ink"
                  >
                    <Flag className="h-3.5 w-3.5" /> Report
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
