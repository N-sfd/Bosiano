"use client";

import { RotateCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AtelierSelectedLook } from "./AtelierSelectedLook";
import { AtelierAddToBag } from "./AtelierAddToBag";
import type { AtelierProduct } from "@/types/atelier";

type Props = {
  aiEnabled: boolean;
  photoPreview: string;
  generatedImageUrl: string | null;
  mode: "ai" | "lite" | null;
  generating: boolean;
  error: string | null;
  products: AtelierProduct[];
  onRemoveProduct: (productId: string) => void;
  onChangePieces: () => void;
  onUploadAnotherPhoto: () => void;
  onRegenerate: () => void;
};

export function AtelierWorkspace({
  aiEnabled,
  photoPreview,
  generatedImageUrl,
  mode,
  generating,
  error,
  products,
  onRemoveProduct,
  onChangePieces,
  onUploadAnotherPhoto,
  onRegenerate,
}: Props) {
  const previewSrc = generatedImageUrl || photoPreview;
  const usingGenerated = Boolean(generatedImageUrl);

  return (
    <section className="rounded-2xl border border-line bg-canvas-card p-6">
      <p className="eyebrow text-gold-deep">Your BOSIANO Look</p>
      <h2 className="mt-2 font-serif text-3xl">Preview Look</h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* LEFT — photo / AI preview */}
        <div>
          <div className="relative overflow-hidden rounded-xl bg-canvas-sunk">
            <img
              src={previewSrc}
              alt={usingGenerated ? "Your BOSIANO Virtual Atelier preview" : "Your uploaded photo"}
              className="h-full max-h-[650px] w-full object-contain"
            />
            {generating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/50 text-canvas">
                <RotateCw className="h-6 w-6 animate-spin" />
                <p className="text-xs uppercase tracking-luxe">Generating…</p>
              </div>
            )}
          </div>

          {mode === "lite" && !generating && (
            <div className="mt-4 rounded-xl border border-gold/25 bg-gold/5 p-4">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-luxe text-gold-deep">
                <Sparkles className="h-3.5 w-3.5" /> Atelier Lite Preview
              </p>
              <p className="mt-1.5 text-sm text-ink-soft">
                {aiEnabled
                  ? "AI try-on was unavailable, so your photo and selected pieces are shown as a styling lookboard."
                  : "Your photo and selected pieces, composed as a styling lookboard. Live AI try-on appears here when generation is enabled."}
              </p>
            </div>
          )}

          {mode === "ai" && (
            <p className="mt-3 text-xs leading-5 text-ink-muted">
              AI-generated styling preview. Actual fit, proportions, materials and colour may vary.
            </p>
          )}

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        {/* RIGHT — selected products */}
        <div>
          <AtelierSelectedLook products={products} onRemove={onRemoveProduct} />

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onChangePieces}>
              Change Pieces
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onUploadAnotherPhoto}>
              Upload Another Photo
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onRegenerate} disabled={generating}>
              <Sparkles className="h-3.5 w-3.5" /> {generating ? "Regenerating…" : "Refresh Preview"}
            </Button>
          </div>

          <div className="mt-6">
            <AtelierAddToBag products={products} />
          </div>
        </div>
      </div>
    </section>
  );
}
