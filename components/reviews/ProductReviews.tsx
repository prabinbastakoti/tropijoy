"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, MessageSquarePlus, Star, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import type { Review, ReviewSort } from "@/lib/types";
import { getSeededReviews, sortReviews, buildRatingBreakdown } from "@/lib/reviews";
import { useReviewsStore } from "@/store/reviews-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import StarPicker from "./StarPicker";

const sortLabels: { value: ReviewSort; label: string }[] = [
  { value: "recent", label: "Most recent" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
  { value: "helpful", label: "Most helpful" },
];

export default function ProductReviews({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [sort, setSort] = useState<ReviewSort>("recent");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const hydrated = useHydrated();
  const userReviews = useReviewsStore((s) => s.userReviews);
  const helpfulIds = useReviewsStore((s) => s.helpfulIds);
  const addReview = useReviewsStore((s) => s.addReview);
  const toggleHelpful = useReviewsStore((s) => s.toggleHelpful);

  const seeded = useMemo(() => getSeededReviews(productId), [productId]);

  const allReviews: Review[] = useMemo(() => {
    const mine = hydrated
      ? userReviews.filter((r) => r.productId === productId)
      : [];
    return [...mine, ...seeded];
  }, [hydrated, userReviews, seeded, productId]);

  const breakdown = useMemo(() => buildRatingBreakdown(allReviews), [allReviews]);

  const visible = useMemo(() => {
    const filtered =
      starFilter === null
        ? allReviews
        : allReviews.filter((r) => Math.round(r.rating) === starFilter);
    return sortReviews(filtered, sort);
  }, [allReviews, starFilter, sort]);

  /* ---- form state ---- */
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !body.trim()) return;
    addReview({
      productId,
      author: name.trim(),
      rating,
      title: title.trim(),
      body: body.trim(),
    });
    toast.success("Thanks — your review is live");
    setName("");
    setTitle("");
    setBody("");
    setRating(5);
    setFormOpen(false);
    setSort("recent");
    setStarFilter(null);
  }

  return (
    <section id="reviews" className="scroll-mt-28">
      <div className="grid lg:grid-cols-[300px_1fr] gap-10">
        {/* summary rail */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-white border border-forest/10 p-6">
            <p className="font-display text-5xl font-extrabold text-forest-deep leading-none">
              {breakdown.average.toFixed(1)}
            </p>
            <div className="flex items-center gap-0.5 mt-2 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.round(breakdown.average)
                      ? "fill-sunny text-sunny-dark"
                      : "text-forest/20"
                  }
                />
              ))}
            </div>
            <p className="text-sm text-forest-deep/50 mb-5">
              {breakdown.total} review{breakdown.total !== 1 && "s"}
            </p>

            <div className="space-y-2">
              {breakdown.distribution.map((row) => {
                const selected = starFilter === row.stars;
                return (
                  <button
                    key={row.stars}
                    onClick={() => setStarFilter(selected ? null : row.stars)}
                    disabled={row.count === 0}
                    className={cn(
                      "w-full flex items-center gap-2.5 text-xs group disabled:cursor-default",
                      selected && "font-semibold"
                    )}
                  >
                    <span className="w-8 text-left text-forest-deep/60 shrink-0">
                      {row.stars}★
                    </span>
                    <span className="flex-1 h-2 rounded-full bg-forest/8 overflow-hidden">
                      <motion.span
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={cn(
                          "block h-full rounded-full",
                          selected ? "bg-forest" : "bg-sunny"
                        )}
                      />
                    </span>
                    <span className="w-6 text-right text-forest-deep/45 shrink-0">
                      {row.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {starFilter !== null && (
              <button
                onClick={() => setStarFilter(null)}
                className="mt-4 text-xs font-semibold text-forest hover:underline"
              >
                Clear filter
              </button>
            )}

            <Button
              fullWidth
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={() => setFormOpen((v) => !v)}
            >
              <MessageSquarePlus size={15} />
              Write a review
            </Button>
          </div>
        </div>

        {/* list + form */}
        <div>
          <AnimatePresence initial={false}>
            {formOpen && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="overflow-hidden"
              >
                <div className="rounded-3xl bg-white border border-forest/10 p-6 mb-8">
                  <h3 className="font-display font-bold text-lg text-forest-deep mb-1">
                    Review {productName}
                  </h3>
                  <p className="text-xs text-forest-deep/50 mb-5">
                    Saved in your browser so you can see how it looks on the page.
                  </p>

                  <div className="mb-4">
                    <span className="text-sm font-semibold text-forest-deep mb-2 block">
                      Your rating
                    </span>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="review-name"
                        className="text-xs font-semibold text-forest-deep/70 mb-1 block"
                      >
                        Your name
                      </label>
                      <input
                        id="review-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Aayush Shrestha"
                        className="w-full rounded-xl border border-forest/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="review-title"
                        className="text-xs font-semibold text-forest-deep/70 mb-1 block"
                      >
                        Headline
                      </label>
                      <input
                        id="review-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Genuinely fresh"
                        className="w-full rounded-xl border border-forest/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="review-body"
                      className="text-xs font-semibold text-forest-deep/70 mb-1 block"
                    >
                      Your review
                    </label>
                    <textarea
                      id="review-body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      required
                      rows={4}
                      placeholder="What did you think of the flavour, texture and packaging?"
                      className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" size="sm">
                      Post review
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-sm text-forest-deep/55">
              Showing {visible.length} review{visible.length !== 1 && "s"}
              {starFilter !== null && ` rated ${starFilter}★`}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-forest-deep/55">Sort</span>
              <Select
                value={sort}
                onValueChange={(v) => setSort(v as ReviewSort)}
              >
                <SelectTrigger
                  aria-label="Sort reviews"
                  className="rounded-lg px-3 py-1.5"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortLabels.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {visible.map((review) => {
                const marked = hydrated && helpfulIds.includes(review.id);
                return (
                  <motion.article
                    key={review.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl bg-white border border-forest/10 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-full bg-forest text-white font-bold flex items-center justify-center shrink-0">
                        {review.author.charAt(0)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-forest-deep text-sm">
                            {review.author}
                          </span>
                          {review.verified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest bg-forest/8 rounded-full px-2 py-0.5">
                              <BadgeCheck size={11} /> Verified
                            </span>
                          )}
                          <span className="text-xs text-forest-deep/40">
                            {formatDate(review.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 mt-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < review.rating
                                  ? "fill-sunny text-sunny-dark"
                                  : "text-forest/20"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <h4 className="font-semibold text-forest-deep mt-4 mb-1.5">
                      {review.title}
                    </h4>
                    <p className="text-sm text-forest-deep/70 leading-relaxed">
                      {review.body}
                    </p>

                    <button
                      onClick={() => toggleHelpful(review.id)}
                      className={cn(
                        "mt-4 inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 transition-colors",
                        marked
                          ? "bg-forest text-white"
                          : "bg-forest/6 text-forest-deep/60 hover:bg-forest/12"
                      )}
                    >
                      <ThumbsUp size={12} />
                      Helpful ({review.helpfulCount + (marked ? 1 : 0)})
                    </button>
                  </motion.article>
                );
              })}
            </AnimatePresence>

            {visible.length === 0 && (
              <p className="text-center text-sm text-forest-deep/50 py-16 bg-white rounded-2xl border border-forest/10">
                No reviews match that filter.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
