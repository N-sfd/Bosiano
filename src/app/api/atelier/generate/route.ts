import { NextRequest, NextResponse } from "next/server";
import { generateVirtualTryOn } from "@/lib/tryon-provider";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const personImage = formData.get("personImage");
    const productsRaw = formData.get("products");

    if (!(personImage instanceof File)) {
      return NextResponse.json({ error: "Photo is required." }, { status: 400 });
    }

    if (typeof productsRaw !== "string") {
      return NextResponse.json({ error: "Selected products are required." }, { status: 400 });
    }

    let products: unknown;
    try {
      products = JSON.parse(productsRaw);
    } catch {
      return NextResponse.json({ error: "Selected products are invalid." }, { status: 400 });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Select at least one product." }, { status: 400 });
    }

    const productImages = products
      .map((product) => (product && typeof product === "object" ? (product as { image?: unknown }).image : undefined))
      .filter((image): image is string => typeof image === "string" && image.length > 0);

    const result = await generateVirtualTryOn({ personImage, productImages });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Virtual Atelier error:", error);
    return NextResponse.json({ error: "Unable to generate your outfit preview." }, { status: 500 });
  }
}
