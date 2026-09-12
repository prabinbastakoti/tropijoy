"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface IconButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  active?: boolean;
}

export default function IconButton({
  children,
  className,
  active,
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full w-10 h-10 transition-colors",
        active
          ? "bg-forest text-white"
          : "bg-white/80 text-forest hover:bg-forest/10",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
