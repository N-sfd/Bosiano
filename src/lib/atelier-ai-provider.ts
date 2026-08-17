import type { AtelierProduct } from "@/types/atelier";
import { generateGeminiTryOn, getGeminiApiKey } from "@/lib/atelier-gemini";

export type AtelierGenerationInput = {
  userImage: File | Blob;
  products: AtelierProduct[];
  origin?: string;
};

export type AtelierGenerationResult = {
  imageUrl: string | null;
  mode: "ai" | "lite";
  error?: string;
};

export function isAtelierAiConfigured() {
  return Boolean(
    (process.env.ATELIER_AI_URL && process.env.ATELIER_AI_KEY) || getGeminiApiKey()
  );
}

export async function generateAtelierPreview({
  userImage,
  products,
  origin,
}: AtelierGenerationInput): Promise<AtelierGenerationResult> {
  const apiUrl = process.env.ATELIER_AI_URL;
  const apiKey = process.env.ATELIER_AI_KEY;

  if (apiUrl && apiKey) {
    const custom = await generateFromCustomProvider(apiUrl, apiKey, userImage, products);
    if (custom?.imageUrl) return custom;
  }

  if (getGeminiApiKey()) {
    try {
      const result = await generateGeminiTryOn({ userImage, products, origin });
      if (result.imageUrl) return { imageUrl: result.imageUrl, mode: "ai" };
      return { imageUrl: null, mode: "lite", error: result.error };
    } catch (error) {
      console.error("Atelier Gemini request failed:", error);
      return {
        imageUrl: null,
        mode: "lite",
        error: error instanceof Error ? error.message : "AI try-on failed.",
      };
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
