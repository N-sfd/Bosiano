"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_SECTIONS } from "@/lib/admin";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-0.5" aria-label="Admin">
      {ADMIN_SECTIONS.map((s) => {
        const active =
          s.href === "/admin"
            ? pathname === "/admin"
            : pathname === s.href || pathname.startsWith(`${s.href}/`);
        return (
          <Link
            key={s.id}
            href={s.href}
            className={cn(
              "block rounded-lg px-3 py-2 text-[0.78rem] transition-colors",
              active
                ? "bg-void text-canvas"
                : "text-ink-soft hover:bg-canvas-raised hover:text-ink"
            )}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
