"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AtelierStepper, type AtelierStep } from "@/components/atelier/AtelierStepper";
import { AtelierSelectedLook } from "@/components/atelier/AtelierSelectedLook";
import { AtelierProductSelector } from "@/components/atelier/AtelierProductSelector";
import { AtelierPhotoUpload } from "@/components/atelier/AtelierPhotoUpload";
import { AtelierWorkspace } from "@/components/atelier/AtelierWorkspace";
import { Button } from "@/components/ui/Button";
import {
  addProductToAtelier,
  getAtelierLook,
  removeProductFromAtelier,
} from "@/lib/atelier-storage";
import { composeAtelierLookboard, compressAtelierPhoto } from "@/lib/atelier-preview";
import type { AtelierProduct } from "@/types/atelier";

export function VirtualAtelierClient({ aiEnabled }: { aiEnabled: boolean }) {
  const [hydrated, setHydrated] = useState(false);
  const [products, setProducts] = useState<AtelierProduct[]>([]);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<"ai" | "lite" | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

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
    setMode(null);
    setError(null);
  }

  function handleRemovePhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
    setGeneratedImage(null);
    setMode(null);
    setError(null);
  }

  function handleUploadAnotherPhoto() {
    handleRemovePhoto();
    // The upload section only re-enters the DOM once `mode` clears, so defer
    // the scroll until after that re-render has committed.
    setTimeout(() => photoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function handleChangePieces() {
    selectedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleGenerate() {
    if (!photo || !photoPreview || products.length === 0) return;
    setGenerating(true);
    setError(null);

    try {
      let aiImage: string | null = null;
      let nextMode: "ai" | "lite" = "lite";

    try {
      const compressed = await compressAtelierPhoto(photo);
      const formData = new FormData();
      formData.append("userPhoto", compressed);
      formData.append("selectedProducts", JSON.stringify(products));

      const response = await fetch("/api/atelier/generate", {
        method: "POST",
        body: formData,
      });

      const raw = await response.text();
      let data: { success?: boolean; imageUrl?: string | null; mode?: "ai" | "lite"; error?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (data.mode === "ai" && typeof data.imageUrl === "string" && data.imageUrl) {
        aiImage = data.imageUrl;
        nextMode = "ai";
      }
    } catch (requestError) {
      console.error("Atelier generate request failed:", requestError);
    }

      const imageUrl =
        aiImage ??
        (await composeAtelierLookboard(photoPreview, products).catch(() => photoPreview));
      setGeneratedImage(imageUrl);
      setMode(nextMode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate your outfit preview.");
    } finally {
      setGenerating(false);
    }
  }

  const step: AtelierStep = !hydrated || products.length === 0
    ? "select"
    : !photoPreview
      ? "upload"
      : !mode
        ? "preview"
        : "shop";

  return (
    <div className="shell py-8 lg:py-12">
      <p className="eyebrow inline-flex items-center gap-2 text-gold-deep">
        <Sparkles className="h-3.5 w-3.5" /> Virtual Atelier
      </p>
      <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">BOSIANO Virtual Atelier</h1>
      <p className="mt-2 text-sm uppercase tracking-luxe text-ink-muted">Your private AI styling room.</p>
      <p className="mt-3 max-w-xl text-sm text-ink-soft">
        Curate your look, upload your photo, and experience selected BOSIANO pieces together before you shop.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-canvas-raised p-5">
        <AtelierStepper current={step} />
      </div>

      {!hydrated ? (
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-canvas-sunk" />
      ) : products.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-canvas-card p-10 text-center">
          <p className="eyebrow text-gold-deep">Get Started</p>
          <h2 className="mt-2 font-serif text-3xl">Build Your Look</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
            Select pieces from the BOSIANO collection to begin.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/shop?category=women" className="btn-primary">
              Shop Women
            </Link>
            <Link href="/shop?category=men" className="btn-outline">
              Shop Men
            </Link>
            <Link href="/shop?category=bags" className="btn-outline">
              Shop Bags &amp; Accessories
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div ref={selectedRef}>
            <AtelierSelectedLook products={products} onRemove={handleRemoveProduct} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/shop" className="btn-outline inline-flex w-fit">
              Browse the shop
            </Link>
          </div>

          <AtelierProductSelector selectedIds={products.map((p) => p.id)} onAdd={handleAddProduct} />

          {!mode && (
            <section ref={photoRef} className="rounded-2xl border border-line bg-canvas-card p-6">
              <p className="eyebrow text-gold-deep">Upload Your Photo</p>
              <h2 className="mt-2 font-serif text-3xl">Step In</h2>
              <div className="mt-6">
                <AtelierPhotoUpload previewUrl={photoPreview} onChange={handlePhotoChange} onRemove={handleRemovePhoto} />
              </div>

              {photoPreview && (
                <div className="mt-6">
                  <Button onClick={handleGenerate} disabled={generating} className="w-full sm:w-auto">
                    <Sparkles className="h-4 w-4" /> {generating ? "Generating…" : "Generate AI Styling Preview"}
                  </Button>
                  {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                </div>
              )}
            </section>
          )}

          {mode && photoPreview && (
            <AtelierWorkspace
              aiEnabled={aiEnabled}
              photoPreview={photoPreview}
              generatedImageUrl={generatedImage}
              mode={mode}
              generating={generating}
              error={error}
              products={products}
              onRemoveProduct={handleRemoveProduct}
              onChangePieces={handleChangePieces}
              onUploadAnotherPhoto={handleUploadAnotherPhoto}
              onRegenerate={handleGenerate}
            />
          )}
        </div>
      )}
    </div>
  );
}
