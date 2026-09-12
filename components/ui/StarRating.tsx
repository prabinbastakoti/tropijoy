import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewsCount?: number;
  size?: number;
  className?: string;
}

export default function StarRating({
  rating,
  reviewsCount,
  size = 14,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "fill-sunny text-sunny-dark" : "text-gray-300"}
            />
          );
        })}
      </div>
      <span className="text-xs text-gray-500 font-medium">
        {rating.toFixed(1)}
        {reviewsCount !== undefined && ` (${reviewsCount})`}
      </span>
    </div>
  );
}
