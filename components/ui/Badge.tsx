import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "sunny" | "forest" | "sale" | "outline" | "warning";
  className?: string;
}

const variantClasses = {
  sunny: "bg-sunny text-white",
  forest: "bg-forest text-white",
  sale: "bg-red-500 text-white",
  outline: "border border-forest/30 text-forest bg-white/70",
  warning: "border border-sunny/40 text-sunny-dark bg-white/85",
};

export default function Badge({ children, variant = "forest", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
