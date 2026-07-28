import type { Metadata } from "next";
import { StylistChat } from "@/components/stylist/StylistChat";

export const metadata: Metadata = {
  title: "AI Personal Stylist",
  description: "Conversational styling powered by your sizes, designers, wishlist, and browsing history.",
};

export default function StylistPage({
  searchParams,
}: {
  searchParams?: { look?: string };
}) {
  return <StylistChat initialLookSlug={searchParams?.look} />;
}
