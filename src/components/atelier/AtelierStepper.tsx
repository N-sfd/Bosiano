"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type AtelierStep = "select" | "upload" | "preview" | "shop";

const STEPS: { id: AtelierStep; number: string; label: string }[] = [
  { id: "select", number: "01", label: "Select Pieces" },
  { id: "upload", number: "02", label: "Upload Photo" },
  { id: "preview", number: "03", label: "Preview Look" },
  { id: "shop", number: "04", label: "Shop Look" },
];

export function AtelierStepper({ current }: { current: AtelierStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.65rem]",
                done ? "bg-void text-canvas" : active ? "border border-ink text-ink" : "border border-line text-ink-muted"
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : step.number}
            </span>
            <span className={cn("text-xs uppercase tracking-luxe", active ? "text-ink" : "text-ink-muted")}>
              {step.label}
            </span>
            {i < STEPS.length - 1 && <span className="mx-2 hidden h-px w-6 bg-line sm:block" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
