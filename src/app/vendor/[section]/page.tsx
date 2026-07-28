import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VENDOR_SECTIONS } from "@/lib/vendor";
import { VendorPortalClient } from "@/components/vendor/VendorPortalClient";

const SECTION_IDS = VENDOR_SECTIONS.filter((s) => s.id !== "overview").map((s) => s.id);

export function generateStaticParams() {
  return SECTION_IDS.map((section) => ({ section }));
}

export function generateMetadata({ params }: { params: { section: string } }): Metadata {
  const s = VENDOR_SECTIONS.find((x) => x.id === params.section);
  return { title: s ? `Vendor · ${s.label}` : "Vendor Portal" };
}

export default function VendorSectionPage({ params }: { params: { section: string } }) {
  if (!SECTION_IDS.includes(params.section as (typeof SECTION_IDS)[number])) {
    notFound();
  }
  return <VendorPortalClient section={params.section} />;
}
