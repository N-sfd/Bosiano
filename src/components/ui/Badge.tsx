import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-canvas-sunk text-ink",
  ink: "bg-void text-canvas",
  gold: "bg-gold text-ink",
  eco: "bg-[#3a4a3b] text-canvas",
  outline: "border border-line bg-canvas-card/95 text-ink shadow-sm",
};

export function Badge({
  children,
  tone = "neutral",
  onRemove,
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-luxe",
        tones[tone],
        className
      )}
    >
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label="Remove filter" className="-mr-0.5">
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
