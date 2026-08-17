import type { Metadata } from "next";
import { atelierConfig } from "@/lib/atelier-config";
import { VirtualAtelierClient } from "./VirtualAtelierClient";

export const metadata: Metadata = {
  title: "BOSIANO Virtual Atelier",
  description: "Your private AI styling room. Curate your look, upload your photo, and experience selected BOSIANO pieces together before you shop.",
};

export default function VirtualAtelierPage() {
  return <VirtualAtelierClient aiEnabled={atelierConfig.aiEnabled} />;
}
