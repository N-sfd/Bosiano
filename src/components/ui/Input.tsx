import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function Input({
  label,
  icon: Icon,
  className,
  ...rest
}: {
  label?: string;
  icon?: LucideIcon;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const field = (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />}
      <input
        className={cn(
          "w-full rounded-lg border border-line bg-canvas py-3 text-sm transition-colors focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink/10",
          Icon ? "pl-9 pr-3" : "px-4"
        )}
        {...rest}
      />
    </div>
  );

  if (!label) return <div className={className}>{field}</div>;

  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[0.7rem] uppercase tracking-luxe text-ink-muted">{label}</span>
      {field}
    </label>
  );
}
