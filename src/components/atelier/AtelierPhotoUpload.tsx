"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
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
  const [dragging, setDragging] = useState(false);

  function acceptFile(selected: File | undefined) {
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

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = "";
    acceptFile(selected);
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
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
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center transition-colors ${
            dragging ? "border-ink bg-canvas-sunk" : "border-line bg-canvas-raised hover:border-ink"
          }`}
        >
          <Upload className="h-6 w-6 text-gold" />
          <span className="text-sm font-medium uppercase tracking-luxe">Upload Your Photo</span>
          <span className="text-xs text-ink-muted">Drag and drop or browse</span>
          <ul className="mt-2 space-y-1 text-xs text-ink-muted">
            <li>For best results:</li>
            <li>• Use a full-body photo</li>
            <li>• Face the camera</li>
            <li>• Use even lighting</li>
            <li>• Keep your outfit visible</li>
            <li>• Avoid heavily cropped photos</li>
          </ul>
          <span className="text-xs text-ink-muted">JPG, PNG or WebP · up to 10MB</span>
        </button>
      )}

      {previewUrl && (
        <div className="mt-3 flex flex-wrap gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            Replace Photo
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onRemove}>
            Remove Photo
          </Button>
        </div>
      )}

      <p className="mt-3 text-xs leading-5 text-ink-muted">
        Your photo is used only to create your styling preview. Do not upload sensitive or private images.
      </p>
    </div>
  );
}
