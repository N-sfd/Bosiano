"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoTone = "ink" | "gold";

const CREST = "/brand/crest-primary.png";
const LOCKUP = "/brand/logo-lockup.png";

/**
 * Bosiano brand mark — crowned tiger crest + BOSIANO / ITALIAN HERITAGE.
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
  const color = tone === "gold" ? "#CBA96A" : "#1a1510";
  const isGold = tone === "gold";

  if (variant === "mark") {
    return (
      <span
        className={cn(
          "relative inline-block overflow-hidden",
          compact ? "h-9 w-9" : "h-11 w-11",
          className
        )}
        aria-label="Bosiano"
      >
        <Image
          src={CREST}
          alt=""
          fill
          className={cn("object-contain", !isGold && "mix-blend-multiply")}
          sizes={compact ? "36px" : "44px"}
        />
      </span>
    );
  }

  /* Full photographic lockup — best for light surfaces / marketing */
  if (variant === "stacked" && showTagline && !compact) {
    return (
      <span
        className={cn("relative inline-block h-[148px] w-[168px] sm:h-[168px] sm:w-[190px]", className)}
        aria-label="Bosiano — Italian Heritage"
      >
        <Image
          src={LOCKUP}
          alt="Bosiano Italian Heritage"
          fill
          className={cn("object-contain object-left", !isGold && "mix-blend-multiply")}
          sizes="190px"
          priority={false}
        />
      </span>
    );
  }

  const crestSize = compact ? (variant === "horizontal" ? 36 : 40) : variant === "horizontal" ? 44 : 56;
  const showLine = showTagline || variant === "stacked" || variant === "wordmark";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 sm:gap-3",
        (variant === "stacked" || variant === "wordmark") && "flex-col gap-1.5 sm:gap-2",
        className
      )}
      style={{ color }}
      aria-label="Bosiano — Italian Heritage"
    >
      <span
        className="relative shrink-0 overflow-hidden"
        style={{ width: crestSize, height: crestSize }}
      >
        <Image
          src={CREST}
          alt=""
          fill
          className={cn("object-contain", !isGold && "mix-blend-multiply")}
          sizes={`${crestSize}px`}
          priority={!isGold}
        />
      </span>

      <span
        className={cn(
          "flex flex-col",
          variant === "horizontal" ? "items-start" : "items-center text-center"
        )}
      >
        <span
          className={cn(
            "font-serif font-semibold leading-none tracking-[0.12em]",
            compact
              ? "text-[0.95rem] sm:text-[1.1rem]"
              : "text-[1.15rem] sm:text-[1.45rem]"
          )}
        >
          BOSIANO
        </span>
        {showLine && (
          <span
            className={cn(
              "mt-1 font-sans font-medium uppercase leading-none tracking-[0.28em] opacity-70",
              compact ? "text-[0.38rem] sm:text-[0.42rem]" : "text-[0.42rem] sm:text-[0.5rem]"
            )}
          >
            Italian Heritage
          </span>
        )}
      </span>
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
