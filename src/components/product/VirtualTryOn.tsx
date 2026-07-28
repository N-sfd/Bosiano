"use client";

import { useMemo, useRef, useState } from "react";
import {
  X,
  Camera,
  Sparkles,
  Upload,
  RotateCw,
  Ruler,
  Shirt,
  Save,
} from "lucide-react";
import type { Product, ProductVariant } from "@/lib/types";
import { Media } from "@/components/Media";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import {
  modalityForProduct,
  modalityCopy,
  fitSimulation,
  sizeComparison,
  tryOnSupported,
} from "@/lib/tryOn";

const bodyTypes = ["Petite", "Regular", "Tall", "Curvy", "Athletic"] as const;

export function VirtualTryOn({
  product,
  variant,
  open,
  onClose,
}: {
  product: Product;
  variant: ProductVariant;
  open: boolean;
  onClose: () => void;
}) {
  const bodyProfile = useStore((s) => s.bodyProfile);
  const updateBodyProfile = useStore((s) => s.updateBodyProfile);
  const styleProfile = useStore((s) => s.styleProfile);
  const addToWardrobe = useStore((s) => s.addToWardrobe);
  const fileRef = useRef<HTMLInputElement>(null);

  const modality = modalityForProduct(product);
  const copy = modalityCopy[modality];
  const [body, setBody] = useState(bodyProfile.bodyType);
  const [size, setSize] = useState(
    product.sizes.find((s) => s === styleProfile.sizes.tops || s === styleProfile.sizes.shoes) ||
      product.sizes[0] ||
      ""
  );
  const [tab, setTab] = useState<"tryon" | "fit" | "compare" | "body">("tryon");
  const [uploaded, setUploaded] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [saved, setSaved] = useState(false);

  const sim = useMemo(
    () =>
      fitSimulation(
        product,
        {
          heightCm: bodyProfile.heightCm,
          weightKg: bodyProfile.weightKg,
          bodyType: body,
          preferredFit: styleProfile.preferredFits[0] ?? "regular",
        },
        size
      ),
    [product, bodyProfile, body, styleProfile.preferredFits, size]
  );

  const compareRows = useMemo(() => sizeComparison(product, size), [product, size]);

  if (!open) return null;

  const run = () => {
    setRendering(true);
    setRendered(false);
    setTimeout(() => {
      setRendering(false);
      setRendered(true);
      updateBodyProfile({ bodyType: body });
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden overflow-y-auto rounded-2xl bg-canvas-raised md:grid-cols-2"
        role="dialog"
        aria-label="Virtual try-on"
      >
        <button className="absolute right-4 top-4 z-10 btn-ghost text-canvas md:text-ink" aria-label="Close" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>

        <div className="relative bg-ink">
          <Media
            seed={`tryon-${modality}-${variant.id}-${body}`}
            swatches={[variant.hex, "#2f3033", "#c2a367"]}
            ratio="portrait"
            monogram={false}
            label={product.name}
          >
            {rendering && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/50 text-canvas">
                <RotateCw className="h-8 w-8 animate-spin" />
                <p className="text-xs uppercase tracking-luxe">Rendering {modality} try-on…</p>
              </div>
            )}
            {rendered && (
              <div className="absolute inset-x-4 bottom-4 rounded-xl bg-canvas-raised/95 p-3 text-xs">
                <p className="flex items-center gap-1.5 font-medium text-gold-deep">
                  <Sparkles className="h-3.5 w-3.5" /> {copy.title}
                </p>
                <p className="mt-1 text-ink-soft">{copy.overlay}</p>
                <p className="mt-1 text-ink-soft">
                  {sim.verdict} — {sim.detail}
                </p>
              </div>
            )}
          </Media>
        </div>

        <div className="p-6 sm:p-7">
          <p className="eyebrow inline-flex items-center gap-2">
            <Camera className="h-3.5 w-3.5 text-gold" /> Virtual Try-On · {modality}
          </p>
          <h2 className="mt-2 font-serif text-2xl">{copy.title}</h2>
          <p className="mt-1 text-sm text-ink-muted">{copy.hint}</p>

          {!tryOnSupported(product) && (
            <p className="mt-3 text-xs text-gold-deep">Limited preview for this category.</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ["tryon", "Try-on"],
                ["fit", "Fit simulation"],
                ["compare", "Size compare"],
                ["body", "Body profile"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs uppercase tracking-luxe",
                  tab === id ? "bg-ink text-canvas" : "border border-line"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "tryon" && (
            <>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={() => setUploaded(true)}
              />
              <button className="btn-outline mt-5 w-full" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4" /> {uploaded ? "Photo uploaded" : "Upload your photo"}
              </button>

              <p className="eyebrow mb-2 mt-6">Body type</p>
              <div className="flex flex-wrap gap-2">
                {bodyTypes.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setBody(b);
                      setRendered(false);
                    }}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs transition-colors",
                      body === b ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {product.sizes.length > 0 && (
                <>
                  <p className="eyebrow mb-2 mt-5">Size to preview</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={cn(
                          "min-w-10 rounded-md border px-2 py-1.5 text-xs",
                          size === s ? "border-ink bg-ink text-canvas" : "border-line"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button onClick={run} disabled={rendering} className="btn-primary mt-6 w-full">
                <Sparkles className="h-4 w-4" /> {rendered ? "Re-render" : "Visualize on me"}
              </button>
              <button
                className="btn-outline mt-3 w-full"
                onClick={() => {
                  addToWardrobe(product.id, "try-on");
                  setSaved(true);
                }}
              >
                <Save className="h-4 w-4" /> {saved ? "Saved to wardrobe" : "Save to digital wardrobe"}
              </button>
            </>
          )}

          {tab === "fit" && (
            <div className="mt-5 space-y-3 rounded-xl border border-line p-4 text-sm">
              <p className="inline-flex items-center gap-2 font-medium">
                <Shirt className="h-4 w-4 text-gold" /> {sim.verdict}
              </p>
              <p className="text-ink-soft">{sim.detail}</p>
              <p className="text-xs text-ink-muted">Fabric give · {sim.stretch}</p>
              <p className="text-xs text-ink-muted">Length · {sim.length}</p>
            </div>
          )}

          {tab === "compare" && (
            <div className="mt-5 overflow-hidden rounded-xl border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-canvas-sunk text-[0.65rem] uppercase tracking-luxe text-ink-muted">
                  <tr>
                    <th className="px-3 py-2">Size</th>
                    <th className="px-3 py-2">Relation</th>
                    <th className="px-3 py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((r) => (
                    <tr key={r.size} className="border-t border-line">
                      <td className="px-3 py-2 font-medium">{r.size}</td>
                      <td className="px-3 py-2 text-ink-soft">{r.relation}</td>
                      <td className="px-3 py-2 text-xs text-ink-muted">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "body" && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {(
                [
                  ["heightCm", "Height (cm)", bodyProfile.heightCm],
                  ["weightKg", "Weight (kg)", bodyProfile.weightKg],
                  ["bustCm", "Bust (cm)", bodyProfile.bustCm ?? 86],
                  ["waistCm", "Waist (cm)", bodyProfile.waistCm ?? 68],
                  ["hipsCm", "Hips (cm)", bodyProfile.hipsCm ?? 94],
                ] as const
              ).map(([key, label, value]) => (
                <label key={key} className="text-xs uppercase tracking-luxe text-ink-muted">
                  {label}
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => updateBodyProfile({ [key]: Number(e.target.value) })}
                    className="mt-1 w-full border border-line bg-canvas px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  />
                </label>
              ))}
              <label className="col-span-2 text-xs uppercase tracking-luxe text-ink-muted">
                Shoe EU
                <input
                  value={bodyProfile.shoeEu ?? ""}
                  onChange={(e) => updateBodyProfile({ shoeEu: e.target.value })}
                  className="mt-1 w-full border border-line bg-canvas px-3 py-2 text-sm focus:border-ink focus:outline-none"
                />
              </label>
              <p className="col-span-2 inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <Ruler className="h-3.5 w-3.5" /> Saved to your account for future try-ons.
              </p>
            </div>
          )}

          <p className="mt-4 text-[0.7rem] text-ink-muted">
            Supports eyewear, shoes, jewelry, bags, makeup, and selected clothing. Photos are processed privately.
          </p>
        </div>
      </div>
    </div>
  );
}
