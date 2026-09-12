"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  // Primary conversion CTA — solid Primary Accent fill, per the brand kit.
  primary: "bg-forest text-white font-semibold hover:bg-forest-light shadow-lift",
  secondary: "bg-sunny text-white font-semibold hover:bg-sunny-bright",
  outline:
    "border-2 border-forest text-forest font-semibold hover:bg-forest hover:text-white",
  ghost: "text-forest hover:bg-forest/10 font-medium",
  dark: "bg-forest-deep text-cream font-semibold hover:bg-forest",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  fullWidth?: boolean,
  className?: string
) {
  return cn(
    base,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );
}

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={buttonClasses(variant, size, fullWidth, className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  children,
  fullWidth,
  className,
}: ButtonLinkProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn("inline-flex", fullWidth && "w-full")}
    >
      <Link
        href={href}
        className={buttonClasses(variant, size, fullWidth, className)}
      >
        {children}
      </Link>
    </motion.div>
  );
}
