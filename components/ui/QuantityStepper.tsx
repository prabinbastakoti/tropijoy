"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  incrementDisabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  incrementDisabled,
  size = "md",
  className,
}: QuantityStepperProps) {
  const btn =
    size === "sm"
      ? "w-6 h-6 rounded-full"
      : "w-8 h-8 rounded-full";
  const icon = size === "sm" ? 12 : 15;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 bg-cream rounded-full p-1",
        className
      )}
    >
      <button
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className={cn(
          btn,
          "bg-white flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-colors"
        )}
      >
        <Minus size={icon} />
      </button>
      <span
        className={cn(
          "text-center font-semibold text-forest-deep tabular-nums",
          size === "sm" ? "w-5 text-sm" : "w-7"
        )}
      >
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        disabled={incrementDisabled}
        aria-label="Increase quantity"
        className={cn(
          btn,
          "bg-white flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-forest"
        )}
      >
        <Plus size={icon} />
      </button>
    </div>
  );
}
