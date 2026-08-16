"use client";

import { ChangeEvent, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

type Props = {
  previewUrl: string | null;
  onChange: (file: File, previewUrl: string) => void;
  onRemove: () => void;
};

export function AtelierPhotoUpload({ previewUrl, onChange, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      alert("Please upload a JPG, PNG or WebP photo.");
      return;
    }

    if (selected.size > MAX_BYTES) {
      alert("Photo must be smaller than 10MB.");
      return;
    }

    onChange(selected, URL.createObjectURL(selected));
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-line bg-canvas-sunk">
          <img src={previewUrl} alt="Your uploaded photo" className="max-h-[520px] w-full object-contain" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-3 top-3 rounded-full bg-void/70 p-2 text-canvas hover:bg-void"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-canvas-raised px-6 py-16 text-center transition-colors hover:border-ink"
        >
          <Upload className="h-6 w-6 text-gold" />
          <span className="text-sm font-medium">Select a photo of yourself</span>
          <span className="text-xs text-ink-muted">JPG, PNG or WebP · up to 10MB</span>
        </button>
      )}

      {previewUrl && (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} className="mt-3">
          Choose a different photo
        </Button>
      )}
    </div>
  );
}
