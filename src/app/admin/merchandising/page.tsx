import type { Metadata } from "next";
import { MerchandisingClient } from "@/components/admin/MerchandisingClient";

export const metadata: Metadata = {
  title: "Merchandising",
};

export default function MerchandisingPage() {
  return <MerchandisingClient />;
}
