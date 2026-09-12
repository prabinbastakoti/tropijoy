"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarPicker({
  value,
  onChange,
  size = 26,
}: {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className="transition-transform hover:scale-115 active:scale-95"
        >
          <Star
            size={size}
            className={cn(
              "transition-colors",
              star <= active ? "fill-sunny text-sunny-dark" : "text-forest/20"
            )}
          />
        </button>
      ))}
    </div>
  );
}
