"use client";

import { cn } from "@/lib/utils";

const methods = [
  { id: "apple", label: "Apple\u00A0Pay", className: "bg-ink text-canvas" },
  { id: "google", label: "Google\u00A0Pay", className: "bg-white text-ink border border-line" },
  { id: "paypal", label: "PayPal", className: "bg-[#ffc439] text-[#003087]" },
  { id: "klarna", label: "Klarna", className: "bg-[#ffb3c7] text-ink" },
  { id: "affirm", label: "Affirm", className: "bg-[#0FA0EA] text-white" },
];

export function ExpressPayButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      {!compact && (
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">Express checkout</span>
          <span className="h-px flex-1 bg-line" />
        </div>
      )}
      <div className={cn("grid gap-2", compact ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-5")}>
        {methods.map((m) => (
          <button
            key={m.id}
            className={cn(
              "flex items-center justify-center rounded-lg py-3 text-xs font-semibold transition-transform hover:scale-[1.02]",
              m.className
            )}
            aria-label={`Pay with ${m.label.replace(/\u00A0/g, " ")}`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
