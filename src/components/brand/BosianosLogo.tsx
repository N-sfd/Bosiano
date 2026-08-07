"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoTone = "ink" | "gold";

const LOGO = {
  ink: "/brand/logo-primary.png",
  gold: "/brand/logo-gold.png",
} as const;

const MARK = {
  ink: "/brand/monogram-ink.png",
  gold: "/brand/monogram-gold.png",
} as const;

/**
 * Official Bosianos lockup — primary (ink) and gold PNG assets.
 */
export function BosianosLogo({
  variant = "stacked",
  tone = "ink",
  showTagline = false,
  compact = false,
  className,
}: {
  variant?: "stacked" | "horizontal" | "wordmark" | "mark";
  tone?: LogoTone;
  showTagline?: boolean;
  compact?: boolean;
  className?: string;
}) {
  if (variant === "mark") {
    return (
      <span
        className={cn(
          "relative inline-block",
          compact ? "h-8 w-8" : "h-10 w-10",
          className
        )}
        aria-label="Bosianos"
      >
        <Image
          src={MARK[tone]}
          alt="Bosianos"
          fill
          className="object-contain"
          sizes={compact ? "32px" : "40px"}
          priority={false}
        />
      </span>
    );
  }

  const isGold = tone === "gold";
  const width = compact
    ? isGold
      ? 140
      : 120
    : isGold
      ? showTagline
        ? 220
        : 180
      : 160;
  const height = compact
    ? isGold
      ? 90
      : 48
    : isGold
      ? showTagline
        ? 140
        : 110
      : 64;

  return (
    <span
      className={cn(
        "relative inline-block shrink-0",
        variant === "horizontal" && "align-middle",
        className
      )}
      style={{ width, height }}
      aria-label="Bosianos"
    >
      <Image
        src={LOGO[tone]}
        alt="Bosianos"
        fill
        className={cn(
          "object-contain",
          variant === "horizontal" || variant === "wordmark"
            ? "object-left"
            : "object-center",
          isGold ? "object-top" : "object-center"
        )}
        sizes={`${width}px`}
        priority={tone === "ink"}
      />
    </span>
  );
}

export function BosianosMark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: LogoTone;
}) {
  return <BosianosLogo variant="mark" tone={tone} className={className} />;
}
