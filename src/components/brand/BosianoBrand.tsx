"use client";

import Image from "next/image";
import { brand, brandAlt } from "@/config/brand";
import { cn } from "@/lib/utils";

/**
 * Official BOSIANO logo system (single master identity):
 *
 * crest-full   — transparent full lockup for header / footer / screens
 * crest-simple — shield-only (favicon, hardware, mobile, badges)
 * lockup       — CSS wordmark + ITALIAN HERITAGE (footer, labels, email)
 * wordmark     — BOSIANO only
 */

export type BosianoBrandVariant =
  | "wordmark"
  | "lockup"
  | "crest-full"
  | "crest-simple"
  | "crest-one-color"
  | "monogram";

export type BosianoBrandTheme = "dark" | "light" | "gold" | "monochrome";
export type BosianoBrandSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Full lockup widths (px) — size by WIDTH so BOSIANO / ITALIAN HERITAGE stay readable.
 * Header overrides via .header-logo CSS (~108 / 135 / 160). Footer via .footer-logo (~220).
 */
const FULL_W: Record<BosianoBrandSize, number> = {
  xs: 90,
  sm: 108,
  md: 132,
  lg: 140,
  xl: 160,
};

/** Legacy height map kept for wordmark / CSS lockup typography scale */
const FULL_H: Record<BosianoBrandSize, number> = {
  xs: 56,
  sm: 64,
  md: 80,
  lg: 96,
  xl: 112,
};

/** Shield-only heights */
const CREST_PX: Record<BosianoBrandSize, number> = {
  xs: 42,
  sm: 50,
  md: 58,
  lg: 66,
  xl: 74,
};

/** Trimmed transparent lockup aspect ratio (w/h) — current asset ~744×881 */
const LOCKUP_RATIO = 744 / 881;

export function BosianoBrand({
  variant = "wordmark",
  theme = "dark",
  size = "md",
  decorative = false,
  className,
  priority = false,
  src,
}: {
  variant?: BosianoBrandVariant;
  theme?: BosianoBrandTheme;
  size?: BosianoBrandSize;
  decorative?: boolean;
  className?: string;
  priority?: boolean;
  /** Optional image override (e.g. footer gold lockup) */
  src?: string;
}) {
  const a11y = brandAlt(decorative);
  const goldClass =
    theme === "gold" || theme === "light"
      ? "text-gold"
      : "text-ink";

  const subClass =
    theme === "gold" || theme === "light"
      ? "text-gold/75"
      : "text-ink-muted";

  /* —— Wordmark only —— */
  if (variant === "wordmark") {
    const h = FULL_H[size] * 0.42;
    return (
      <span
        className={cn("brand-wordmark inline-flex select-none items-center justify-center bg-transparent", goldClass, className)}
        style={{ height: h }}
        aria-label={a11y || undefined}
      >
        <span
          className="font-serif font-semibold uppercase leading-none tracking-[0.28em]"
          style={{ fontSize: `clamp(0.75rem, ${h * 0.55}px, 1.25rem)` }}
        >
          {brand.name}
        </span>
      </span>
    );
  }

  /* —— Wordmark + ITALIAN HERITAGE (footer / labels / email) —— */
  if (variant === "lockup") {
    const nameSize = size === "xs" ? 0.8 : size === "sm" ? 0.95 : size === "md" ? 1.15 : size === "lg" ? 1.3 : 1.5;
    return (
      <span
        className={cn("inline-flex flex-col items-start gap-2 bg-transparent", goldClass, className)}
        aria-label={a11y || undefined}
      >
        <span
          className="brand-wordmark select-none font-serif font-semibold uppercase leading-none tracking-[0.28em]"
          style={{ fontSize: `${nameSize}rem` }}
        >
          {brand.name}
        </span>
        <span
          className={cn("brand-subtitle select-none uppercase leading-none tracking-[0.28em]", subClass)}
          style={{ fontSize: `${Math.max(0.65, nameSize * 0.52)}rem` }}
        >
          {brand.subtitle}
        </span>
      </span>
    );
  }

  /* —— Full digital lockup (header / footer) —— width-led, never stretched —— */
  if (variant === "crest-full") {
    const w = FULL_W[size];
    const h = Math.round(w / LOCKUP_RATIO);
    const lockupSrc = src ?? brand.assets.digitalLockup;
    return (
      <span
        className={cn(
          "brand-crest bosiano-logo relative inline-block shrink-0 overflow-visible bg-transparent p-0 shadow-none ring-0",
          className
        )}
        style={{ width: w, height: h, background: "transparent" }}
        aria-label={a11y || undefined}
      >
        <Image
          src={lockupSrc}
          alt={a11y}
          width={w}
          height={h}
          className="bosiano-logo-img h-auto w-full bg-transparent object-contain object-center"
          style={{ width: "100%", height: "auto", background: "transparent", border: 0, boxShadow: "none" }}
          sizes={`(max-width: 767px) 108px, (max-width: 1199px) 132px, ${w}px`}
          priority={priority}
          placeholder="empty"
          unoptimized={false}
        />
      </span>
    );
  }

  /* —— Shield only —— */
  if (variant === "crest-simple") {
    const s = CREST_PX[size];
    return (
      <span
        className={cn(
          "brand-crest bosiano-logo relative inline-block shrink-0 bg-transparent p-0 shadow-none",
          className
        )}
        style={{ width: s, height: s }}
        aria-label={a11y || undefined}
      >
        <Image
          src={brand.assets.digitalCrest}
          alt={a11y}
          width={s}
          height={s}
          className="bosiano-logo-img h-full w-full bg-transparent object-contain"
          style={{ background: "transparent", border: 0, boxShadow: "none" }}
          sizes={`${s}px`}
          priority={priority}
          placeholder="empty"
        />
      </span>
    );
  }

  /* —— B monogram (small hardware signature — never full crest at this scale) —— */
  if (variant === "monogram") {
    const s = Math.round(CREST_PX[size] * 0.85);
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center bg-transparent font-serif font-semibold leading-none tracking-[0.08em]",
          goldClass,
          className
        )}
        style={{ width: s, height: s, fontSize: s * 0.72 }}
        aria-label={decorative ? undefined : "Bosiano B monogram"}
      >
        B
      </span>
    );
  }

  /* crest-one-color (SVG favicon mark) */
  const s = CREST_PX[size];
  return (
    <span className={cn("brand-crest relative inline-block shrink-0 bg-transparent", className)} style={{ width: s, height: s }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.assets.oneColorCrest}
        alt={a11y}
        width={s}
        height={s}
        className="h-full w-full bg-transparent object-contain"
      />
    </span>
  );
}

/** @deprecated Prefer BosianoBrand */
export function BosianosLogo({
  variant = "stacked",
  tone = "ink",
  showTagline = false,
  compact = false,
  className,
}: {
  variant?: "stacked" | "horizontal" | "wordmark" | "mark";
  tone?: "ink" | "gold";
  showTagline?: boolean;
  compact?: boolean;
  className?: string;
}) {
  if (variant === "mark") {
    return <BosianoBrand variant="crest-simple" size={compact ? "sm" : "md"} decorative className={className} />;
  }
  if (variant === "wordmark" || !showTagline) {
    return (
      <BosianoBrand
        variant="wordmark"
        theme={tone === "gold" ? "gold" : "monochrome"}
        size={compact ? "sm" : "md"}
        className={className}
        priority
      />
    );
  }
  return (
    <BosianoBrand
      variant="lockup"
      theme={tone === "gold" ? "gold" : "monochrome"}
      size={compact ? "sm" : "md"}
      className={className}
    />
  );
}

export function BosianosMark({ className }: { className?: string; tone?: "ink" | "gold" }) {
  return <BosianoBrand variant="crest-simple" size="md" decorative className={className} />;
}
