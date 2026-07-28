import type { Metadata } from "next";
import { LookbookGrid } from "@/components/lookbook/LookbookGrid";

export const metadata: Metadata = {
  title: "Lookbook — Shop Complete Outfits",
  description: "Shop complete outfits from campaigns, editorials, influencers, runway, and customer uploads.",
};

export default function LookbookPage() {
  return <LookbookGrid />;
}
