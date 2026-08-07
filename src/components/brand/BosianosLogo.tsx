"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoTone = "ink" | "gold";

/** Official Bosiano crest + wordmark lockup (Italian Heritage). */
const LOCKUP = "/brand/logo-lockup.png";
/** Crest only — crowned tiger shield. */
const CREST = "/brand/crest-primary.png";

/**
 * Renders the real brand PNG assets (not a CSS recreation),
 * so the site matches the Bosiano identity boards.
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
  const isGold = tone === "gold";

  if (variant === "mark") {
    const size = compact ? 40 : 52;
    return (
      <span
        className={cn("relative inline-block shrink-0", className)}
        style={{ width: size, height: size }}
        aria-label="Bosiano"
      >
        <Image
          src={CREST}
          alt="Bosiano"
          width={size}
          height={size}
          className={cn("h-full w-full object-contain", !isGold && "mix-blend-multiply")}
          priority={false}
        />
      </span>
    );
  }

  /* Full lockup: crest + BOSIANO + ITALIAN HERITAGE */
  const height = compact ? 64 : 104;
  const width = Math.round(height * (445 / 490));

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden",
        isGold && "rounded-sm bg-[#F5F0E8]/95 p-1 shadow-sm",
        className
      )}
      style={{ width: isGold ? width + 8 : width, height: isGold ? height + 8 : height }}
      aria-label="Bosiano — Italian Heritage"
    >
      <Image
        src={LOCKUP}
        alt="Bosiano Italian Heritage"
        width={width}
        height={height}
        className={cn(
          "h-full w-full object-contain object-center",
          !isGold && "mix-blend-multiply"
        )}
        sizes={`${width}px`}
        priority={!isGold}
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
