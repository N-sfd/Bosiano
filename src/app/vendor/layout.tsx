"use client";

import Link from "next/link";
import { VendorNav } from "@/components/vendor/VendorNav";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-line bg-canvas-raised/40">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">Bosiano · Partners</p>
            <p className="font-serif text-lg">Designer & Vendor Portal</p>
          </div>
          <div className="flex gap-4 text-xs uppercase tracking-luxe">
            <Link href="/" className="text-ink-muted hover:text-ink">
              Storefront
            </Link>
            <Link href="/admin" className="text-ink-muted hover:text-ink">
              Admin
            </Link>
          </div>
        </div>
      </div>
      <div className="shell py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <VendorNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
