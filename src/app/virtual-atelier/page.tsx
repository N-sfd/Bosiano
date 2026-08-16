"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AtelierStepper, type AtelierStep } from "@/components/atelier/AtelierStepper";
import { AtelierSelectedLook } from "@/components/atelier/AtelierSelectedLook";
import { AtelierProductSelector } from "@/components/atelier/AtelierProductSelector";
import { AtelierPhotoUpload } from "@/components/atelier/AtelierPhotoUpload";
import { AtelierPreview } from "@/components/atelier/AtelierPreview";
import { AtelierAddToBag } from "@/components/atelier/AtelierAddToBag";
import { Button } from "@/components/ui/Button";
import {
  addProductToAtelier,
  getAtelierLook,
  removeProductFromAtelier,
} from "@/lib/atelier-storage";
import type { AtelierProduct } from "@/types/atelier";

export default function VirtualAtelierPage() {
  const [hydrated, setHydrated] = useState(false);
  const [products, setProducts] = useState<AtelierProduct[]>([]);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getAtelierLook().products);
    setHydrated(true);
  }, []);

  function handleAddProduct(product: AtelierProduct) {
    addProductToAtelier(product);
    setProducts(getAtelierLook().products);
  }

  function handleRemoveProduct(productId: string) {
    removeProductFromAtelier(productId);
    setProducts(getAtelierLook().products);
  }

  function handlePhotoChange(file: File, previewUrl: string) {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(file);
    setPhotoPreview(previewUrl);
    setGeneratedImage(null);
    setError(null);
  }

  function handleRemovePhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
    setGeneratedImage(null);
    setError(null);
  }

  async function handleGenerate() {
    if (!photo || products.length === 0) return;
    setGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("personImage", photo);
      formData.append("products", JSON.stringify(products));

      const response = await fetch("/api/atelier/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to generate your outfit preview.");
      }

      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate your outfit preview.");
    } finally {
      setGenerating(false);
    }
  }

  const step: AtelierStep = !photoPreview
    ? products.length === 0
      ? "select"
      : "upload"
    : !generatedImage
      ? "generate"
      : "bag";

  return (
    <div className="shell py-8 lg:py-12">
      <p className="eyebrow inline-flex items-center gap-2 text-gold-deep">
        <Sparkles className="h-3.5 w-3.5" /> Virtual Atelier
      </p>
      <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">BOSIANO Virtual Atelier</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-soft">
        See your selected pieces on you before you buy. Upload a photo, generate an AI preview, and add the entire look to
        your bag in one step.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-canvas-raised p-5">
        <AtelierStepper current={step} />
      </div>

      {!hydrated ? (
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-canvas-sunk" />
      ) : (
        <div className="mt-6 space-y-6">
          <AtelierSelectedLook products={products} onRemove={handleRemoveProduct} />

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/shop" className="btn-outline inline-flex w-fit">
              Browse the shop
            </Link>
          </div>

          <AtelierProductSelector selectedIds={products.map((p) => p.id)} onAdd={handleAddProduct} />

          <section className="rounded-2xl border border-line bg-canvas-card p-6">
            <p className="eyebrow text-gold-deep">Upload Your Photo</p>
            <h2 className="mt-2 font-serif text-3xl">Step In</h2>
            <div className="mt-6">
              <AtelierPhotoUpload previewUrl={photoPreview} onChange={handlePhotoChange} onRemove={handleRemovePhoto} />
            </div>

            {photoPreview && (
              <div className="mt-6">
                {products.length === 0 ? (
                  <p className="text-sm text-ink-muted">Add at least one piece above before generating a preview.</p>
                ) : (
                  <Button onClick={handleGenerate} disabled={generating} className="w-full sm:w-auto">
                    <Sparkles className="h-4 w-4" /> {generating ? "Generating…" : "Generate AI Preview"}
                  </Button>
                )}
                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              </div>
            )}
          </section>

          {photoPreview && generatedImage && (
            <AtelierPreview
              originalImage={photoPreview}
              generatedImage={generatedImage}
              onRegenerate={handleGenerate}
              regenerating={generating}
            />
          )}

          {generatedImage && (
            <section className="rounded-2xl border border-line bg-canvas-card p-6">
              <AtelierAddToBag products={products} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
