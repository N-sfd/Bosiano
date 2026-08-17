import type { AtelierProduct } from "@/types/atelier";

const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src.startsWith("http")) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = src;
  });
}

/** Shrink a photo so the generate request stays under Vercel’s ~4.5MB body limit. */
export async function compressAtelierPhoto(file: File): Promise<File> {
  if (typeof createImageBitmap === "undefined") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );
  if (!blob) return file;

  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}

/**
 * Compose a styling lookboard: the guest photo plus selected pieces.
 * Used when no AI provider is configured, and as a fallback if generation fails.
 */
export async function composeAtelierLookboard(
  photoSrc: string,
  products: AtelierProduct[]
): Promise<string> {
  const photo = await loadImage(photoSrc);
  const garments = (
    await Promise.all(
      products.slice(0, 4).map(async (product) => {
        try {
          return { product, img: await loadImage(product.image) };
        } catch {
          return null;
        }
      })
    )
  ).filter((item): item is { product: AtelierProduct; img: HTMLImageElement } => Boolean(item));

  const rail = 280;
  const pad = 28;
  const canvasW = 1200;
  const canvasH = 1500;
  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to compose your outfit preview.");

  ctx.fillStyle = "#F4EFE6";
  ctx.fillRect(0, 0, canvasW, canvasH);

  const photoBoxW = canvasW - rail - pad * 3;
  const photoBoxH = canvasH - pad * 2 - 56;
  const photoScale = Math.min(photoBoxW / photo.width, photoBoxH / photo.height);
  const dw = photo.width * photoScale;
  const dh = photo.height * photoScale;
  const dx = pad + (photoBoxW - dw) / 2;
  const dy = pad + 40 + (photoBoxH - 40 - dh) / 2;
  ctx.drawImage(photo, dx, dy, dw, dh);

  ctx.fillStyle = "#1A1612";
  ctx.font = "500 13px Times New Roman, serif";
  ctx.fillText("BOSIANO  VIRTUAL ATELIER", pad, pad + 22);

  const railX = canvasW - rail - pad;
  const slotH = Math.min(300, Math.floor((canvasH - pad * 2 - 24) / Math.max(garments.length, 1)) - 12);
  garments.forEach((item, i) => {
    const y = pad + 40 + i * (slotH + 12);
    ctx.fillStyle = "#EDE6D9";
    ctx.fillRect(railX, y, rail, slotH);
    const gScale = Math.min((rail - 16) / item.img.width, (slotH - 16) / item.img.height);
    const gw = item.img.width * gScale;
    const gh = item.img.height * gScale;
    ctx.drawImage(item.img, railX + (rail - gw) / 2, y + (slotH - gh) / 2, gw, gh);
  });

  return canvas.toDataURL("image/jpeg", 0.9);
}
