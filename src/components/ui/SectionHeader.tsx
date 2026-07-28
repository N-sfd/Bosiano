import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  center,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-6", center && "flex-col items-center text-center")}>
      <div className={cn(center && "max-w-2xl")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">{title}</h2>
        {description && <p className="mt-3 max-w-xl text-sm text-ink-soft sm:text-base">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group hidden shrink-0 items-center gap-2 text-xs uppercase tracking-luxe text-ink hover:text-gold sm:inline-flex"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
