import { readFile } from "fs/promises";
import path from "path";
import type { AtelierProduct } from "@/types/atelier";

const GEMINI_MODEL = process.env.ATELIER_GEMINI_MODEL || "gemini-2.5-flash-image";

export function getGeminiApiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ""
  );
}

type InlineImage = {
  mimeType: string;
  data: string;
};

function mimeFromName(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
}

async function blobToInline(image: Blob): Promise<InlineImage> {
  const buffer = Buffer.from(await image.arrayBuffer());
  return {
    mimeType: image.type || "image/jpeg",
    data: buffer.toString("base64"),
  };
}

async function loadProductImage(src: string): Promise<InlineImage | null> {
  try {
    if (src.startsWith("/") && !src.startsWith("//")) {
      const relative = src.replace(/^\/+/, "");
      if (relative.includes("..")) return null;
      const filePath = path.join(process.cwd(), "public", relative);
      const buffer = await readFile(filePath);
      return { mimeType: mimeFromName(relative), data: buffer.toString("base64") };
    }

    if (src.startsWith("http://") || src.startsWith("https://")) {
      const response = await fetch(src);
      if (!response.ok) return null;
      const buffer = Buffer.from(await response.arrayBuffer());
      const mimeType = response.headers.get("content-type")?.split(";")[0] || mimeFromName(src);
      return { mimeType, data: buffer.toString("base64") };
    }
  } catch (error) {
    console.error("Failed to load atelier garment image:", src, error);
  }
  return null;
}

function extractImage(result: {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: { mimeType?: string; data?: string };
        inline_data?: { mime_type?: string; data?: string };
      }>;
    };
  }>;
}): string | null {
  const parts = result.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const inline = part.inlineData ?? part.inline_data;
    const data = inline?.data;
    if (!data) continue;
    const mime = inline?.mimeType ?? inline?.mime_type ?? "image/png";
    return `data:${mime};base64,${data}`;
  }
  return null;
}

function buildPrompt(products: AtelierProduct[]) {
  const list = products
    .map((product, i) => `${i + 1}. ${product.name}${product.color ? ` in ${product.color}` : ""}`)
    .join("\n");

  return `Create a single photorealistic virtual try-on photograph for the BOSIANO luxury boutique.

IMAGE 1 is the customer. Preserve their identity, face, hair, skin, body shape, pose, hands, and background exactly.

The following product photos are the garments they selected. Dress the customer in these exact BOSIANO pieces, replacing their current clothes. Match color, fabric, cut, collar, sleeves, and details. Natural drape, fit, and lighting.

Selected look:
${list}

Hard rules:
- Output one photograph of the same person wearing the selected look
- Do not create a collage, mood board, split layout, thumbnail rail, or product flat
- Do not keep their original outfit if it conflicts with the selected pieces
- No text, logos, watermarks, or extra people`;
}

export async function generateGeminiTryOn({
  userImage,
  products,
}: {
  userImage: Blob;
  products: AtelierProduct[];
}): Promise<string | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  const person = await blobToInline(userImage);
  const garments = (
    await Promise.all(products.slice(0, 4).map((product) => loadProductImage(product.image)))
  ).filter((image): image is InlineImage => Boolean(image));

  if (garments.length === 0) {
    console.error("Atelier Gemini: no garment images could be loaded.");
    return null;
  }

  const parts: Array<Record<string, unknown>> = [
    { inlineData: { mimeType: person.mimeType, data: person.data } },
    { text: "IMAGE 1: the customer to dress." },
  ];

  garments.forEach((garment, index) => {
    const product = products[index];
    parts.push({ inlineData: { mimeType: garment.mimeType, data: garment.data } });
    parts.push({
      text: `Garment ${index + 1}: ${product?.name ?? "selected piece"}${product?.color ? `, ${product.color}` : ""}.`,
    });
  });

  parts.push({ text: buildPrompt(products) });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      }),
    }
  );

  const raw = await response.text();
  if (!response.ok) {
    console.error("Atelier Gemini error:", response.status, raw.slice(0, 2000));
    return null;
  }

  try {
    return extractImage(JSON.parse(raw));
  } catch (error) {
    console.error("Atelier Gemini returned non-JSON:", error, raw.slice(0, 500));
    return null;
  }
}
