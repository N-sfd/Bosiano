import { NextRequest, NextResponse } from "next/server";
import { generateAtelierPreview } from "@/lib/atelier-ai-provider";
import type { AtelierProduct } from "@/types/atelier";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

function isImagePart(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const userPhoto = formData.get("userPhoto");
    const productsRaw = formData.get("selectedProducts");

    if (!isImagePart(userPhoto)) {
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
    });

    return NextResponse.json({ success: true, imageUrl: result.imageUrl, mode: result.mode });
  } catch (error) {
    console.error("Virtual Atelier error:", error);
    return NextResponse.json(
      { success: true, imageUrl: null, mode: "lite" },
      { status: 200 }
    );
  }
}
