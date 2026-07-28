"use client";

import { cn } from "@/lib/utils";

export type LogoTone = "ink" | "gold";

function toneColor(tone: LogoTone) {
  return tone === "gold" ? "#CBA96A" : "#080808";
}

/**
 * Updated logo system based on the user's latest BOSIANO ITALY boards.
 * Uses a refined Italian luxury wordmark instead of the older BS monogram lockup.
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
  const color = toneColor(tone);

  if (variant === "mark") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center font-serif italic leading-none",
          compact ? "text-3xl" : "text-4xl",
          className
        )}
        style={{ color }}
        aria-label="Bosiano"
      >
        B
      </span>
    );
  }

  if (variant === "horizontal") {
    return (
      <span className={cn("inline-flex items-center", className)} style={{ color }}>
        <span className="flex flex-col items-start">
          <Wordmark compact={compact} />
          <ItalyLine align="left" compact={compact} />
        </span>
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span className={cn("inline-flex flex-col items-center", className)} style={{ color }}>
        <Wordmark compact={compact} />
        <ItalyLine compact={compact} />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex flex-col items-center", className)} style={{ color }}>
      <Wordmark compact={compact} />
      <ItalyLine compact={compact} />
      {showTagline && (
        <span className="mt-1 text-[0.48rem] font-medium uppercase tracking-[0.3em] opacity-60">
          Premium Fashion Marketplace
        </span>
      )}
    </span>
  );
}

function Wordmark({ compact }: { compact?: boolean }) {
  return (
    <span
      className={cn(
        "font-serif italic font-medium leading-none tracking-[0.01em]",
        compact ? "text-[1.65rem]" : "text-[2.15rem]"
      )}
    >
      Bosiano
    </span>
  );
}

function ItalyLine({
  compact,
  align = "center",
}: {
  compact?: boolean;
  align?: "center" | "left";
}) {
  return (
    <span
      className={cn(
        "mt-1 inline-flex items-center gap-2.5 uppercase opacity-75",
        align === "left" ? "justify-start" : "justify-center"
      )}
    >
      <span className={cn("h-px bg-current", compact ? "w-8" : "w-10")} />
      <span
        className={cn(
          "font-medium leading-none tracking-[0.34em]",
          compact ? "text-[0.48rem]" : "text-[0.56rem]"
        )}
      >
        Italy
      </span>
      <span className={cn("h-px bg-current", compact ? "w-8" : "w-10")} />
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
  return (
    <span className={cn("inline-block font-serif italic", className)} style={{ color: toneColor(tone) }}>
      B
    </span>
  );
}
