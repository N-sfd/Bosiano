"use client";

import { useState } from "react";
import {
  Share2,
  Link2,
  Check,
  Mail,
  Instagram,
  LayoutGrid,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { getBrand } from "@/lib/brands";
import { useStore } from "@/store/useStore";
import { Media } from "@/components/Media";

export function ShareActions({ product }: { product: Product }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const referralCode = useStore((s) => s.referralCode);
  const boards = useStore((s) => s.outfitBoards);
  const addToBoard = useStore((s) => s.addToOutfitBoard);
  const brand = getBrand(product.brandId);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/product/${product.slug}?ref=${referralCode}`
      : `https://bosiano.com/product/${product.slug}?ref=${referralCode}`;
  const text = `Discover ${product.name} by ${brand?.name ?? "Bosiano"}`;
  const pinMedia =
    typeof window !== "undefined"
      ? `${window.location.origin}/`
      : "https://bosiano.com/";

  const copy = async (value = url) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn-outline !px-4"
        aria-label="Share product"
        aria-expanded={open}
      >
        <Share2 className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-line bg-canvas-raised p-2 shadow-lg">
          <button
            onClick={() => copy()}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-canvas-sunk"
          >
            {copied ? <Check className="h-4 w-4 text-gold" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Link copied" : "Copy shareable link"}
          </button>
          <button
            onClick={() => {
              setCardOpen(true);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-canvas-sunk"
          >
            <LayoutGrid className="h-4 w-4" /> Shareable product card
          </button>
          <a
            href={`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-canvas-sunk"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
          <a
            href={`https://www.instagram.com/`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-canvas-sunk"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </a>
          <a
            href={`https://www.tiktok.com/`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-canvas-sunk"
          >
            <span className="flex h-4 w-4 items-center justify-center text-[0.65rem] font-bold">TT</span> TikTok
          </a>
          <a
            href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}&media=${encodeURIComponent(pinMedia)}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-canvas-sunk"
          >
            <span className="flex h-4 w-4 items-center justify-center text-[0.65rem] font-bold text-[#E60023]">P</span>{" "}
            Pinterest
          </a>
          {boards[0] && (
            <button
              onClick={() => {
                addToBoard(boards[0].id, product.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-canvas-sunk"
            >
              Add to outfit board
            </button>
          )}
          <button
            onClick={() => copy(`${typeof window !== "undefined" ? window.location.origin : ""}/account/referrals?ref=${referralCode}`)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-canvas-sunk"
          >
            Referral link ({referralCode})
          </button>
        </div>
      )}

      {cardOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-void/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-canvas-raised p-5 shadow-xl">
            <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">Shareable product card</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-line">
              <Media seed={product.variants[0].images[0]} swatches={[product.variants[0].hex]} ratio="portrait" />
              <div className="p-4">
                <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{brand?.name}</p>
                <p className="font-serif text-2xl leading-tight">{product.name}</p>
                <p className="mt-1 text-sm">{formatPrice(product.price)}</p>
                <p className="mt-3 text-xs text-ink-muted">bosiano.com · ref {referralCode}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => copy()} className={cn("btn-primary flex-1")}>
                {copied ? "Copied" : "Copy link"}
              </button>
              <button onClick={() => setCardOpen(false)} className="btn-outline flex-1">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
