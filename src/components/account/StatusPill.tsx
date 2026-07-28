import { cn } from "@/lib/utils";

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    processing: "bg-canvas-sunk text-ink",
    shipped: "bg-blue-100 text-blue-800",
    "out-for-delivery": "bg-gold/20 text-gold-deep",
    delivered: "bg-[#3a4a3b]/15 text-[#3a4a3b]",
  };
  const label = status.replace(/-/g, " ");
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[0.65rem] font-medium uppercase tracking-luxe capitalize",
        map[status]
      )}
    >
      {label}
    </span>
  );
}
