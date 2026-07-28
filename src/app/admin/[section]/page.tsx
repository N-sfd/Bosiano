import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ADMIN_SECTIONS } from "@/lib/admin";
import { AdminSectionClient } from "@/components/admin/AdminSectionClient";

const SECTION_IDS = ADMIN_SECTIONS.filter(
  (s) => s.id !== "overview" && s.id !== "merchandising" && s.id !== "analytics"
).map((s) => s.id);

export function generateStaticParams() {
  return SECTION_IDS.map((section) => ({ section }));
}

export function generateMetadata({ params }: { params: { section: string } }): Metadata {
  const s = ADMIN_SECTIONS.find((x) => x.id === params.section);
  return { title: s ? `Admin · ${s.label}` : "Admin" };
}

export default function AdminSectionPage({ params }: { params: { section: string } }) {
  if (!SECTION_IDS.includes(params.section as (typeof SECTION_IDS)[number])) {
    notFound();
  }
  return <AdminSectionClient section={params.section} />;
}
