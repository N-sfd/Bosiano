import { cn } from "@/lib/utils";

const variants = {
  primary: "btn-primary",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

const sizes = {
  md: "",
  sm: "!px-4 !py-2.5",
  icon: "!px-4 !py-4 aspect-square",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}
