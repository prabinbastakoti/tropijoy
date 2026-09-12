"use client";

import { ReactNode, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Tracks the cursor and feeds --mx/--my to the `.spotlight` CSS class so a
 * radial highlight follows the pointer across the card.
 */
export default function Spotlight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMove} className={cn("spotlight", className)}>
      {children}
    </div>
  );
}
