import { cn } from "@/lib/utils";

export function IconToggle({
  active,
  onClick,
  label,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-all",
        active ? "border-gold bg-gold text-void" : "border-line bg-canvas-raised/90 text-ink",
        className
      )}
    >
      {children}
    </button>
  );
}
