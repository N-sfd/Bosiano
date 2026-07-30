import { cn } from "@/lib/utils";

export function SwatchButton({
  color,
  selected,
  onClick,
  onMouseEnter,
  size = "sm",
  label,
  className,
}: {
  color: string;
  selected?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  size?: "sm" | "md";
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      aria-label={label}
      aria-pressed={!!selected}
      className={cn(
        "rounded-full border transition-transform",
        size === "sm"
          ? cn("h-3 w-3", selected ? "scale-110 border-ink" : "border-line")
          : cn(
              "h-9 w-9 border-2 hover:scale-105",
              selected ? "border-ink ring-2 ring-gold ring-offset-2 ring-offset-canvas" : "border-line"
            ),
        className
      )}
      style={{ background: color }}
    />
  );
}
