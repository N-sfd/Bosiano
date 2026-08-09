"use client";

import { brand, type BrandProductType } from "@/config/brand";
import { BosianoBrand } from "@/components/brand/BosianoBrand";
import { cn } from "@/lib/utils";

export type BrandFinish = "embroidery" | "foil" | "blind" | "engraving" | "print";
export type BrandPlacementSlot =
  | "left-chest"
  | "center-chest"
  | "back"
  | "sleeve"
  | "neck"
  | "dial"
  | "caseback"
  | "front"
  | "gusset"
  | "interior"
  | "custom";

/**
 * Controlled brand mark placement for mockup frames only.
 * Do NOT use on live commerce product photography — that would misrepresent manufactured goods.
 */
export function ProductBrandPlacement({
  productType,
  placement = "left-chest",
  variant = "wordmark",
  finish = "embroidery",
  size = "sm",
  tone = "ink",
  className,
  label,
}: {
  productType: BrandProductType;
  placement?: BrandPlacementSlot;
  variant?: "wordmark" | "lockup" | "crest-simple" | "crest-full" | "monogram";
  finish?: BrandFinish;
  size?: "xs" | "sm" | "md";
  tone?: "ink" | "ivory" | "gold";
  className?: string;
  /** Visible caption for mockup honesty */
  label?: string;
}) {
  const rules = brand.placement[productType];
  const finishClass =
    finish === "embroidery"
      ? "brand-embroidery"
      : finish === "foil"
        ? "brand-foil"
        : finish === "blind"
          ? "brand-emboss"
          : finish === "engraving"
            ? "brand-engraving"
            : "";

  const theme = tone === "gold" ? "gold" : tone === "ivory" ? "light" : "monochrome";

  const slotClass: Record<BrandPlacementSlot, string> = {
    "left-chest": "left-[16%] top-[28%] w-[14%] max-w-[3.25rem]",
    "center-chest": "left-1/2 top-[32%] w-[28%] max-w-[6.5rem] -translate-x-1/2",
    back: "left-1/2 top-[22%] w-[42%] max-w-[10rem] -translate-x-1/2",
    sleeve: "right-[12%] top-[42%] w-[18%] max-w-[4rem]",
    neck: "left-1/2 top-[8%] w-[20%] max-w-[4.5rem] -translate-x-1/2",
    dial: "left-1/2 top-[28%] w-[34%] max-w-[5rem] -translate-x-1/2",
    caseback: "left-1/2 top-[40%] w-[30%] max-w-[4.5rem] -translate-x-1/2",
    front: "left-1/2 top-[42%] w-[48%] max-w-[9rem] -translate-x-1/2",
    gusset: "right-[6%] top-[40%] w-[14%] max-w-[2.75rem]",
    interior: "left-1/2 top-[55%] w-[40%] max-w-[7rem] -translate-x-1/2",
    custom: "left-1/2 top-1/2 w-[30%] -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div
      className={cn("pointer-events-none absolute z-[2]", slotClass[placement], finishClass, className)}
      data-product-type={productType}
      data-brand-rule={JSON.stringify(rules)}
      aria-hidden
    >
      <BosianoBrand variant={variant} theme={theme} size={size} decorative />
      {label && (
        <span className="mt-1 block text-center text-[0.55rem] uppercase tracking-luxe text-ink-muted/80">
          {label}
        </span>
      )}
    </div>
  );
}
