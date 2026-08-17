import { readFile } from "fs/promises";
import path from "path";
import type { AtelierProduct } from "@/types/atelier";

const GEMINI_MODELS = [
  process.env.ATELIER_GEMINI_MODEL,
  "gemini-2.5-flash-image",
  "gemini-3.1-flash-image-preview",
].filter((model, index, list): model is string => Boolean(model) && list.indexOf(model) === index);

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

export type GeminiTryOnResult = {
  imageUrl: string | null;
  error?: string;
};

function mimeFromName(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
}

function isAccessory(product: AtelierProduct) {
  const haystack = `${product.category ?? ""} ${product.name}`.toLowerCase();
  return /bag|earring|jewel|ring|necklace|bracelet|sunglass|hat|scarf|belt|watch|shoe|heel|boot/.test(haystack);
}

async function blobToInline(image: Blob): Promise<InlineImage> {
  const buffer = Buffer.from(await image.arrayBuffer());
  return {
    mimeType: image.type || "image/jpeg",
    data: buffer.toString("base64"),
  };
}

async function loadFromDisk(src: string): Promise<InlineImage | null> {
  const relative = src.replace(/^\/+/, "");
  if (!relative || relative.includes("..")) return null;
  try {
    const filePath = path.join(process.cwd(), "public", relative);
    const buffer = await readFile(filePath);
    return { mimeType: mimeFromName(relative), data: buffer.toString("base64") };
  } catch {
    return null;
  }
}

async function loadFromUrl(url: string): Promise<InlineImage | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    const mimeType = response.headers.get("content-type")?.split(";")[0] || mimeFromName(url);
    return { mimeType, data: buffer.toString("base64") };
  } catch (error) {
    console.error("Failed to fetch atelier garment image:", url, error);
    return null;
  }
}

async function loadProductImage(src: string, origin?: string): Promise<InlineImage | null> {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return loadFromUrl(src);
  }
  if (!src.startsWith("/")) return null;

  const fromDisk = await loadFromDisk(src);
  if (fromDisk) return fromDisk;

  if (origin) {
    return loadFromUrl(new URL(src, origin).toString());
  }
  return null;
}

function extractImage(result: unknown): string | null {
  const payload = result as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          inlineData?: { mimeType?: string; data?: string };
          inline_data?: { mime_type?: string; data?: string };
        }>;
      };
    }>;
    error?: { message?: string };
  };
  const parts = payload.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const data = part.inlineData?.data ?? part.inline_data?.data;
    if (!data) continue;
    const mime = part.inlineData?.mimeType ?? part.inline_data?.mime_type ?? "image/png";
    return `data:${mime};base64,${data}`;
  }
  return null;
}

function buildPrompt(products: AtelierProduct[]) {
  const list = products
    .map((product, i) => `${i + 1}. ${product.name}${product.color ? ` in ${product.color}` : ""}`)
    .join("\n");
  const accessoriesOnly = products.every(isAccessory);

  return `Create a single photorealistic virtual try-on photograph for BOSIANO.

IMAGE 1 is the customer. Keep their identity, face, hair, skin, body, pose, and background.

Selected pieces:
${list}

${
  accessoriesOnly
    ? "These are accessories only. Keep the customer's current clothing. Place the bag naturally on the shoulder or in hand. Place earrings on the ears. Match metal, colour, and scale."
    : "Dress the customer in these exact BOSIANO pieces. Replace conflicting clothing. Keep identity and pose."
}

Output only one photograph of the same person wearing the selected look. No collage, thumbnail rail, split layout, product flat, text, or watermark.`;
}

function friendlyGeminiError(status: number, raw: string) {
  const exhausted =
    status === 429 ||
    /RESOURCE_EXHAUSTED|rate[- ]limit|quota/i.test(raw);
  if (exhausted) {
    return "Gemini is busy or over quota. Wait about a minute, then generate once — do not click repeatedly.";
  }
  if (status === 401 || status === 403) {
    return "Gemini rejected the API key. Check GEMINI_API_KEY in Vercel.";
  }
  if (status === 404) {
    return "The Gemini image model is unavailable for this key.";
  }
  return `Gemini could not generate the try-on (${status}).`;
}

function authForKey(apiKey: string) {
  const json = { "Content-Type": "application/json" };
  if (apiKey.startsWith("AQ.")) {
    return { headers: { ...json, "x-goog-api-key": apiKey }, query: false };
  }
  return { headers: json, query: true };
}

async function callGemini(
  model: string,
  apiKey: string,
  parts: Array<Record<string, unknown>>
): Promise<{ imageUrl?: string; error?: string; fatal?: boolean }> {
  const body = JSON.stringify({
    contents: [{ role: "user", parts }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const mode = authForKey(apiKey);
  const url = mode.query
    ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`
    : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, { method: "POST", headers: mode.headers, body });
  const raw = await response.text();

  if (!response.ok) {
    console.error("Atelier Gemini error:", model, response.status, raw.slice(0, 1500));
    return { error: friendlyGeminiError(response.status, raw), fatal: response.status === 429 || response.status === 401 || response.status === 403 };
  }

  try {
    const parsed = JSON.parse(raw);
    const imageUrl = extractImage(parsed);
    if (imageUrl) return { imageUrl };
    return { error: parsed?.error?.message || "Gemini returned text but no image." };
  } catch {
    return { error: "Gemini returned an unexpected response." };
  }
}

export async function generateGeminiTryOn({
  userImage,
  products,
  origin,
}: {
  userImage: Blob;
  products: AtelierProduct[];
  origin?: string;
}): Promise<GeminiTryOnResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return { imageUrl: null, error: "Gemini API key is not configured." };

  const person = await blobToInline(userImage);
  const garments = (
    await Promise.all(products.slice(0, 4).map((product) => loadProductImage(product.image, origin)))
  ).filter((image): image is InlineImage => Boolean(image));

  if (garments.length === 0) {
    console.error("Atelier Gemini: no garment images could be loaded.", products.map((p) => p.image));
    return { imageUrl: null, error: "Could not load the selected product images for try-on." };
  }

  const parts: Array<Record<string, unknown>> = [
    { inlineData: { mimeType: person.mimeType, data: person.data } },
    { text: "IMAGE 1: the customer to style." },
  ];

  garments.forEach((garment, index) => {
    const product = products[index];
    parts.push({ inlineData: { mimeType: garment.mimeType, data: garment.data } });
    parts.push({
      text: `Piece ${index + 1}: ${product?.name ?? "selected piece"}${product?.color ? `, ${product.color}` : ""}.`,
    });
  });

  parts.push({ text: buildPrompt(products) });

  let lastError = "Gemini did not return an image.";
  for (const model of GEMINI_MODELS) {
    const result = await callGemini(model, apiKey, parts);
    if (result.imageUrl) return { imageUrl: result.imageUrl };
    if (result.error) lastError = result.error;
    if (result.fatal) break;
  }

  return { imageUrl: null, error: lastError };
}
