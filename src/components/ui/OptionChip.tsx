import { cn } from "@/lib/utils";

export function OptionChip({
  children,
  selected,
  disabled,
  onClick,
  shape = "box",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  shape?: "box" | "pill";
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      aria-pressed={!!selected}
      className={cn(
        "relative border text-sm transition-colors",
        shape === "box" ? "rounded-md" : "rounded-full",
        size === "md" ? "min-w-14 px-3 py-3" : "min-w-10 px-2 py-1.5 text-xs",
        selected ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink",
        disabled && "cursor-not-allowed border-line text-ink-muted/50 line-through hover:border-line",
        className
      )}
    >
      {children}
    </button>
  );
}
