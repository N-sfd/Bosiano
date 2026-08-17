import type { AtelierProduct } from "@/types/atelier";
import { generateGeminiTryOn, getGeminiApiKey } from "@/lib/atelier-gemini";

export type AtelierGenerationInput = {
  userImage: File | Blob;
  products: AtelierProduct[];
};

export type AtelierGenerationResult = {
  imageUrl: string | null;
  mode: "ai" | "lite";
};

export function isAtelierAiConfigured() {
  return Boolean(
    (process.env.ATELIER_AI_URL && process.env.ATELIER_AI_KEY) || getGeminiApiKey()
  );
}

/**
 * Virtual Atelier generation:
 * 1. Custom backend when ATELIER_AI_URL + ATELIER_AI_KEY are set
 * 2. Built-in Gemini 2.5 Flash Image try-on when a Gemini/Google key is set
 * 3. Lite fallback (no try-on) otherwise
 */
export async function generateAtelierPreview({
  userImage,
  products,
}: AtelierGenerationInput): Promise<AtelierGenerationResult> {
  const apiUrl = process.env.ATELIER_AI_URL;
  const apiKey = process.env.ATELIER_AI_KEY;

  if (apiUrl && apiKey) {
    const custom = await generateFromCustomProvider(apiUrl, apiKey, userImage, products);
    if (custom) return custom;
  }

  if (getGeminiApiKey()) {
    try {
      const imageUrl = await generateGeminiTryOn({ userImage, products });
      if (imageUrl) return { imageUrl, mode: "ai" };
    } catch (error) {
      console.error("Atelier Gemini request failed:", error);
    }
  }

  return { imageUrl: null, mode: "lite" };
}

async function generateFromCustomProvider(
  apiUrl: string,
  apiKey: string,
  userImage: Blob,
  products: AtelierProduct[]
): Promise<AtelierGenerationResult | null> {
  const formData = new FormData();
  formData.append("userImage", userImage);
  formData.append("products", JSON.stringify(products));

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    if (!response.ok) {
      console.error("Atelier AI provider error:", await response.text());
      return null;
    }

    const result = await response.json();
    const imageUrl: unknown = result.imageUrl ?? result.output?.imageUrl ?? result.output?.[0] ?? result.image;
    if (typeof imageUrl !== "string" || !imageUrl) {
      console.error("Atelier AI provider returned an unexpected shape:", result);
      return null;
    }
    return { imageUrl, mode: "ai" };
  } catch (error) {
    console.error("Atelier AI provider request failed:", error);
    return null;
  }
}
