import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Review } from "@/lib/types";

interface ReviewsState {
  userReviews: Review[];
  helpfulIds: string[];
  addReview: (
    review: Omit<Review, "id" | "date" | "helpfulCount" | "verified">
  ) => void;
  toggleHelpful: (reviewId: string) => void;
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      userReviews: [],
      helpfulIds: [],
      addReview: (draft) => {
        const review: Review = {
          ...draft,
          id: `user-${Date.now()}`,
          date: new Date().toISOString(),
          helpfulCount: 0,
          verified: false,
        };
        set({ userReviews: [review, ...get().userReviews] });
      },
      toggleHelpful: (reviewId) => {
        const ids = get().helpfulIds;
        set({
          helpfulIds: ids.includes(reviewId)
            ? ids.filter((id) => id !== reviewId)
            : [...ids, reviewId],
        });
      },
    }),
    { name: "tropijoy-reviews" }
  )
);
