"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type AtelierStep = "select" | "upload" | "generate" | "bag";

const STEPS: { id: AtelierStep; label: string }[] = [
  { id: "select", label: "Selected Pieces" },
  { id: "upload", label: "Upload Photo" },
  { id: "generate", label: "AI Preview" },
  { id: "bag", label: "Add to Bag" },
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
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
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
