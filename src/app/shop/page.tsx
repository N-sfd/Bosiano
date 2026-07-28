import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop the full Bosianos edit — tailoring, dresses, bags, shoes and more from our curated designers.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="shell py-20 text-center text-ink-muted">Loading the edit…</div>}>
      <ShopClient />
    </Suspense>
  );
}
