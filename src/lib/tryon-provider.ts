type GenerateParams = {
  personImage: File;
  productImages: string[];
};

type GenerateResult = {
  imageUrl: string;
};

export async function generateVirtualTryOn({
  personImage,
  productImages,
}: GenerateParams): Promise<GenerateResult> {
  const apiUrl = process.env.TRYON_API_URL;
  const apiKey = process.env.TRYON_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error("Virtual try-on provider is not configured.");
  }

  const formData = new FormData();
  formData.append("person_image", personImage);
  productImages.forEach((image) => {
    formData.append("product_images", image);
  });

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    console.error("Try-on provider error:", message);
    throw new Error("AI outfit generation failed.");
  }

  const result = await response.json();

  const imageUrl: unknown = result.imageUrl ?? result.output?.imageUrl ?? result.output?.[0] ?? result.image;

  if (typeof imageUrl !== "string" || !imageUrl) {
    console.error("Try-on provider returned an unexpected shape:", result);
    throw new Error("AI outfit generation failed.");
  }

  return { imageUrl };
}
