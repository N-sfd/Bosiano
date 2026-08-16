"use client";

import { RotateCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Props = {
  originalImage: string;
  generatedImage: string;
  onRegenerate: () => void;
  regenerating?: boolean;
};

export function AtelierPreview({ originalImage, generatedImage, onRegenerate, regenerating }: Props) {
  return (
    <section className="rounded-2xl border border-line bg-canvas-card p-6">
      <p className="eyebrow text-gold-deep">Your BOSIANO Look</p>
      <h2 className="mt-2 font-serif text-3xl">AI Preview</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">Original</p>
          <div className="overflow-hidden rounded-xl bg-canvas-sunk">
            <img src={originalImage} alt="Your original photo" className="h-full max-h-[650px] w-full object-contain" />
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3">AI Preview</p>
          <div className="relative overflow-hidden rounded-xl bg-canvas-sunk">
            <img src={generatedImage} alt="BOSIANO Virtual Atelier preview" className="h-full max-h-[650px] w-full object-contain" />
            {regenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/50 text-canvas">
                <RotateCw className="h-6 w-6 animate-spin" />
                <p className="text-xs uppercase tracking-luxe">Regenerating…</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="outline" onClick={onRegenerate} disabled={regenerating}>
          <Sparkles className="h-4 w-4" /> Regenerate
        </Button>
      </div>

      <p className="mt-5 text-xs leading-5 text-ink-muted">
        AI-generated styling preview. Actual fit, proportions, materials and colour may vary.
      </p>
    </section>
  );
}
