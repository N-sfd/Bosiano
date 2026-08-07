"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoTone = "ink" | "gold";

const CREST = "/brand/crest-primary.png";
const LOCKUP = "/brand/logo-lockup.png";

/** Transparent lockup aspect (232×353 after bg removal). */
const LOCKUP_RATIO = 232 / 353;

const TONE = {
  ink: {
    word: "#1A1510",
    tag: "rgba(26, 21, 16, 0.62)",
    rule: "rgba(26, 21, 16, 0.28)",
  },
  gold: {
    word: "#CBA96A",
    tag: "rgba(203, 169, 106, 0.78)",
    rule: "rgba(203, 169, 106, 0.35)",
  },
} as const;

/**
 * Bosiano crest + typography on transparent PNGs — works on light and dark surfaces.
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
  const colors = TONE[tone];
  const onDark = tone === "gold";

  if (variant === "mark") {
    const size = compact ? 40 : 52;
    return (
      <span
        className={cn("relative inline-block shrink-0", className)}
        style={{ width: size, height: size }}
        aria-label="Bosiano"
      >
        <CrestImage size={size} onDark={onDark} />
      </span>
    );
  }

  /* Full transparent lockup on light surfaces */
  if (!onDark && (variant === "stacked" || variant === "wordmark")) {
    const height = compact ? 64 : 100;
    const width = Math.round(height * LOCKUP_RATIO);
    return (
      <span
        className={cn("relative inline-block shrink-0", className)}
        style={{ width, height }}
        aria-label="Bosiano — Italian Heritage"
      >
        <Image
          src={LOCKUP}
          alt="Bosiano Italian Heritage"
          width={width}
          height={height}
          className="h-full w-full object-contain"
          sizes={`${width}px`}
          priority
        />
      </span>
    );
  }

  const crestSize = compact ? (onDark ? 48 : 40) : onDark ? 64 : 52;
  const showLine = showTagline || variant === "stacked" || variant === "wordmark";
  const stacked = variant === "stacked" || variant === "wordmark" || onDark;

  return (
    <span
      className={cn(
        "inline-flex gap-2.5 sm:gap-3",
        stacked ? "flex-col items-center text-center" : "items-center",
        className
      )}
      aria-label="Bosiano — Italian Heritage"
    >
      <span className="relative shrink-0" style={{ width: crestSize, height: crestSize }}>
        <CrestImage size={crestSize} onDark={onDark} priority={!onDark} />
      </span>

      <span className={cn("flex flex-col", stacked ? "items-center" : "items-start")}>
        <span
          className={cn(
            "font-serif font-semibold leading-none tracking-[0.14em]",
            compact ? "text-[1rem] sm:text-[1.15rem]" : "text-[1.25rem] sm:text-[1.55rem]",
            onDark && "drop-shadow-[0_1px_8px_rgba(203,169,106,0.25)]"
          )}
          style={{ color: colors.word }}
        >
          BOSIANO
        </span>

        {showLine && (
          <span
            className={cn(
              "mt-1.5 inline-flex items-center gap-2 uppercase",
              compact ? "text-[0.4rem] tracking-[0.26em]" : "text-[0.48rem] tracking-[0.32em]"
            )}
            style={{ color: colors.tag }}
          >
            <span className="h-px w-4 sm:w-6" style={{ backgroundColor: colors.rule }} aria-hidden />
            Italian Heritage
            <span className="h-px w-4 sm:w-6" style={{ backgroundColor: colors.rule }} aria-hidden />
          </span>
        )}
      </span>
    </span>
  );
}

function CrestImage({
  size,
  onDark,
  priority = false,
}: {
  size: number;
  onDark: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={CREST}
      alt=""
      width={size}
      height={size}
      className={cn(
        "h-full w-full object-contain",
        onDark && "drop-shadow-[0_2px_12px_rgba(203,169,106,0.35)]"
      )}
      sizes={`${size}px`}
      priority={priority}
    />
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
