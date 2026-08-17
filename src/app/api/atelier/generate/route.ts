import { NextRequest, NextResponse } from "next/server";
import { generateAtelierPreview } from "@/lib/atelier-ai-provider";
import type { AtelierProduct } from "@/types/atelier";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

function getImageBlob(value: FormDataEntryValue | null): Blob | null {
  if (!value || typeof value === "string") return null;
  if (value.size <= 0) return null;
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const userPhoto = getImageBlob(formData.get("userPhoto"));
    const productsRaw = formData.get("selectedProducts");

    if (!userPhoto) {
      return NextResponse.json({ success: false, error: "Photo is required." }, { status: 400 });
    }

    if (typeof productsRaw !== "string") {
      return NextResponse.json({ success: false, error: "Selected products are required." }, { status: 400 });
    }

    let products: unknown;
    try {
      products = JSON.parse(productsRaw);
    } catch {
      return NextResponse.json({ success: false, error: "Selected products are invalid." }, { status: 400 });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: false, error: "Select at least one product." }, { status: 400 });
    }

    const result = await generateAtelierPreview({
      userImage: userPhoto,
      products: products as AtelierProduct[],
      origin: request.nextUrl.origin,
    });

    return NextResponse.json({
      success: Boolean(result.imageUrl) || result.mode === "lite",
      imageUrl: result.imageUrl,
      mode: result.mode,
      error: result.error,
    });
  } catch (error) {
    console.error("Virtual Atelier error:", error);
    return NextResponse.json(
      {
        success: false,
        imageUrl: null,
        mode: "lite",
        error: "Unable to generate your outfit preview.",
      },
      { status: 500 }
    );
  }
}
