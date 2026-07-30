import { cn } from "@/lib/utils";

export function Select({
  value,
  onChange,
  options,
  label,
  className,
  ...rest
}: {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  label?: string;
  className?: string;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange">) {
  const select = (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "border border-line bg-canvas px-3 py-2.5 text-xs uppercase tracking-luxe focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink/10",
        className
      )}
      {...rest}
    >
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );

  if (!label) return select;

  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-luxe text-ink-muted">
      {label}
      {select}
    </label>
  );
}
