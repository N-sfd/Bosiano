import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveImage } from "@/lib/images";

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
  /** Kept for API compatibility — soft colour wash over the photo */
  swatches?: string[];
  className?: string;
  overlayClassName?: string;
  rounded?: boolean;
  children?: React.ReactNode;
  monogram?: boolean;
  priority?: boolean;
  sizes?: string;
  /** CSS object-position for crop framing */
  objectPosition?: string;
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
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  objectPosition = "center",
}: MediaProps) {
  const src = resolveImage(seed);
  const wash = swatches?.[0];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-canvas-sunk",
        rounded && "rounded-2xl",
        ratioClass[ratio],
        className
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
      />

      {/* subtle colour wash for brand / variant tinting */}
      {wash && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-25"
          style={{ background: wash }}
          aria-hidden
        />
      )}

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

      <div className={cn("absolute inset-0", overlayClassName)}>{children}</div>
    </div>
  );
}
