import reviewsData from "@/data/reviews.json";
import type { Review, ReviewSort } from "./types";

export const seededReviews = reviewsData as Review[];

export function getSeededReviews(productId: string): Review[] {
  return seededReviews.filter((r) => r.productId === productId);
}

export function sortReviews(reviews: Review[], sort: ReviewSort): Review[] {
  const list = [...reviews];
  switch (sort) {
    case "highest":
      return list.sort((a, b) => b.rating - a.rating);
    case "lowest":
      return list.sort((a, b) => a.rating - b.rating);
    case "helpful":
      return list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    default:
      return list.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }
}

export interface RatingBreakdown {
  average: number;
  total: number;
  /** Index 0 = 5 stars, index 4 = 1 star. */
  distribution: { stars: number; count: number; percent: number }[];
}

export function buildRatingBreakdown(reviews: Review[]): RatingBreakdown {
  const total = reviews.length;
  const average =
    total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
    return {
      stars,
      count,
      percent: total === 0 ? 0 : Math.round((count / total) * 100),
    };
  });

  return { average, total, distribution };
}
