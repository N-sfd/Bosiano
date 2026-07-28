import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLook, looks } from "@/lib/looks";
import { LookDetailClient } from "@/components/lookbook/LookDetailClient";

export function generateStaticParams() {
  return looks.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const look = getLook(params.slug);
  if (!look) return { title: "Look not found" };
  return { title: `${look.title} — Lookbook`, description: look.dek };
}

export default function LookDetailPage({ params }: { params: { slug: string } }) {
  const look = getLook(params.slug);
  if (!look) notFound();
  return <LookDetailClient look={look} />;
}
