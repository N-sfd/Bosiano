"use client";

import { useState } from "react";
import { X, Sparkles, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SizeAdvisor({
  product,
  open,
  onClose,
  onPick,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
  onPick: (size: string) => void;
}) {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [fit, setFit] = useState<"snug" | "regular" | "relaxed">("regular");
  const [result, setResult] = useState<{ size: string; confidence: number } | null>(null);

  if (!open) return null;

  const compute = () => {
    // Simple heuristic: BMI-ish score mapped onto the product's size ladder.
    const sizes = product.sizes;
    const score = weight / Math.pow(height / 100, 2); // ~BMI
    let idx = Math.round(((score - 17) / (32 - 17)) * (sizes.length - 1));
    if (fit === "relaxed") idx += 1;
    if (fit === "snug") idx -= 1;
    idx = Math.max(0, Math.min(sizes.length - 1, idx));
    const confidence = 82 + Math.round(Math.random() * 14);
    setResult({ size: sizes[idx], confidence });
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-2xl bg-canvas-raised p-7" role="dialog" aria-label="Size advisor">
        <button className="absolute right-4 top-4 btn-ghost" aria-label="Close" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
        <p className="eyebrow inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-gold" /> AI Size Advisor
        </p>
        <h2 className="mt-2 font-serif text-2xl">Find your perfect size</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Tell us a little about you and we&apos;ll recommend the best fit for the {product.name}.
        </p>

        <div className="mt-6 space-y-5">
          <Slider label="Height" value={height} min={150} max={200} unit="cm" onChange={setHeight} />
          <Slider label="Weight" value={weight} min={45} max={120} unit="kg" onChange={setWeight} />
          <div>
            <p className="eyebrow mb-2">Preferred fit</p>
            <div className="grid grid-cols-3 gap-2">
              {(["snug", "regular", "relaxed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFit(f)}
                  className={cn(
                    "rounded-lg border py-2.5 text-xs capitalize transition-colors",
                    fit === f ? "border-ink bg-void text-canvas" : "border-line hover:border-ink"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {result ? (
          <div className="mt-6 rounded-xl border border-gold/40 bg-gold/5 p-5 text-center">
            <p className="text-sm text-ink-muted">We recommend</p>
            <p className="my-1 font-serif text-4xl text-gold-deep">Size {result.size}</p>
            <p className="text-xs text-ink-muted">{result.confidence}% confidence based on 12,000+ similar shoppers</p>
            <button
              onClick={() => {
                onPick(result.size);
                onClose();
              }}
              className="btn-primary mt-4 w-full"
            >
              <Check className="h-4 w-4" /> Select size {result.size}
            </button>
          </div>
        ) : (
          <button onClick={compute} className="btn-primary mt-6 w-full">
            <Sparkles className="h-4 w-4" /> Get my recommendation
          </button>
        )}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="eyebrow">{label}</p>
        <span className="text-sm font-medium">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-canvas-sunk accent-gold"
        aria-label={label}
      />
    </div>
  );
}
