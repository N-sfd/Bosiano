"use client";

import { useState } from "react";
import { X, Ruler } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const guideRows = [
  { size: "XS", bust: "81–84", waist: "61–64", hips: "86–89" },
  { size: "S", bust: "85–88", waist: "65–68", hips: "90–93" },
  { size: "M", bust: "89–93", waist: "69–73", hips: "94–98" },
  { size: "L", bust: "94–98", waist: "74–78", hips: "99–103" },
  { size: "XL", bust: "99–104", waist: "79–84", hips: "104–109" },
];

export function SizeGuide({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  if (!open) return null;

  const rows = guideRows.filter((r) => product.sizes.includes(r.size));
  const convert = (range: string) => {
    if (unit === "cm") return `${range} cm`;
    return range
      .split("–")
      .map((n) => (Number(n) / 2.54).toFixed(1))
      .join("–") + " in";
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center sm:items-center" role="dialog" aria-label="Size guide">
      <div className="absolute inset-0 bg-void/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-canvas-raised p-6 sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow inline-flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5" /> Size guide
            </p>
            <h2 className="mt-1 font-serif text-2xl">{product.name}</h2>
          </div>
          <button className="btn-ghost" onClick={onClose} aria-label="Close size guide">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {(["cm", "in"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs uppercase tracking-luxe",
                unit === u ? "bg-void text-canvas" : "border border-line"
              )}
            >
              {u}
            </button>
          ))}
        </div>

        <table className="mt-5 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[0.65rem] uppercase tracking-luxe text-ink-muted">
              <th className="py-2 font-medium">Size</th>
              <th className="py-2 font-medium">Bust</th>
              <th className="py-2 font-medium">Waist</th>
              <th className="py-2 font-medium">Hips</th>
            </tr>
          </thead>
          <tbody>
            {(rows.length ? rows : guideRows).map((r) => (
              <tr key={r.size} className="border-b border-line/70">
                <td className="py-3 font-medium">{r.size}</td>
                <td className="py-3 text-ink-soft">{convert(r.bust)}</td>
                <td className="py-3 text-ink-soft">{convert(r.waist)}</td>
                <td className="py-3 text-ink-soft">{convert(r.hips)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {product.modelMeasurements && (
          <div className="mt-5 rounded-xl bg-canvas-sunk p-4 text-sm">
            <p className="eyebrow">Model measurements</p>
            <p className="mt-2 text-ink-soft">
              Height {product.modelMeasurements.height} · Bust {product.modelMeasurements.bust} · Waist{" "}
              {product.modelMeasurements.waist} · Hips {product.modelMeasurements.hips}
            </p>
            <p className="mt-1 text-ink-soft">Wearing size {product.modelMeasurements.sizeWorn}</p>
          </div>
        )}
      </div>
    </div>
  );
}
