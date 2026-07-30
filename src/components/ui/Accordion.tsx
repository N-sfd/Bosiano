import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: (id: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={() => onToggle(open ? null : id)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left font-serif text-lg"
      >
        {title}
        <ChevronDown className={cn("h-5 w-5 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}
