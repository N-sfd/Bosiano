"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { brand } from "@/config/brand";
import { DEFAULT_PRODUCT_PLACEHOLDER, resolveImage } from "@/lib/images";

export type MediaRatio = "portrait" | "square" | "landscape" | "wide" | "tall" | "auto";

const ratioClass: Record<MediaRatio, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  tall: "aspect-[2/3]",
  auto: "",
};

interface MediaProps {
  seed: string;
  ratio?: MediaRatio;
  label?: string;
  /** Kept for API compatibility — never used to tint / fake colour variants */
  swatches?: string[];
  className?: string;
  overlayClassName?: string;
  rounded?: boolean;
  children?: React.ReactNode;
  monogram?: boolean;
  /** Place Bosiano crest on intentional mockups only — NEVER on commerce product cards */
  brandMark?: boolean | "chest" | "center" | "corner";
  priority?: boolean;
  sizes?: string;
  /** CSS object-position for crop framing */
  objectPosition?: string;
  /** Hide the media frame entirely when the image fails (thumbnails) */
  hideOnError?: boolean;
  onImageError?: () => void;
}

export function Media({
  seed,
  ratio = "portrait",
  label,
  swatches,
  className,
  overlayClassName,
  rounded = false,
  children,
  monogram = false,
  brandMark = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  objectPosition = "center",
  hideOnError = false,
  onImageError,
}: MediaProps) {
  const resolved = seed ? resolveImage(seed) : "";
  const [failed, setFailed] = useState(false);
  /* swatches kept for API compatibility — NEVER used to fake product colour variants */
  void swatches;
  const mark = brandMark === true ? "chest" : brandMark;

  if (!resolved || (failed && hideOnError)) {
    return null;
  }

  const src = failed ? DEFAULT_PRODUCT_PLACEHOLDER : resolved;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-canvas-sunk",
        rounded && "rounded-2xl",
        ratioClass[ratio],
        className,
        overlayClassName
      )}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={!label && !children}
    >
      <Image
        src={src}
        alt={label ?? ""}
        fill
        priority={priority}
        sizes={sizes}
        quality={priority ? 85 : 75}
        className="object-cover transition-transform duration-700 ease-silk"
        style={{ objectPosition }}
        onError={() => {
          if (!failed) {
            setFailed(true);
            onImageError?.();
          }
        }}
      />

      {/* soft vignette for text legibility when overlays exist */}
      {children && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" aria-hidden />
      )}

      {/* fine grain for print-like editorial feel */}
      <div className="media-grain pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden />

      {monogram && label && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-[22vw] leading-none text-white/10 sm:text-[7rem]">
          {label
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
        </span>
      )}

      {mark && (
        <span
          className={cn(
            "pointer-events-none absolute z-[2]",
            mark === "chest" && "left-[18%] top-[30%] w-[7%] max-w-[1.85rem]",
            mark === "center" &&
              "left-1/2 top-[46%] w-[10%] max-w-[2.25rem] -translate-x-1/2 -translate-y-1/2",
            mark === "corner" && "bottom-4 right-4 w-[9%] max-w-[1.75rem]"
          )}
          aria-hidden
        >
          <Image
            src={brand.assets.simpleCrest}
            alt=""
            width={72}
            height={72}
            className="h-auto w-full object-contain opacity-90"
          />
        </span>
      )}

      {children}
    </div>
  );
}
