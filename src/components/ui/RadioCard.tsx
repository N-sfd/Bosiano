import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function RadioCard({
  selected,
  onClick,
  icon: Icon,
  title,
  subtitle,
  trailing,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors",
        selected ? "border-ink bg-canvas-raised" : "border-line hover:border-ink",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {Icon ? (
          <Icon className="h-4 w-4 shrink-0 text-gold" />
        ) : (
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
              selected ? "border-ink bg-ink text-canvas" : "border-line"
            )}
          >
            {selected && <Check className="h-3 w-3" />}
          </span>
        )}
        <div>
          <p className="text-sm font-medium">{title}</p>
          {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
        </div>
      </div>
      {trailing && <span className="text-sm">{trailing}</span>}
    </button>
  );
}
