import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { seededReviews, buildRatingBreakdown } from "@/lib/reviews";
import { getProductById, FRUIT_ACCENTS } from "@/lib/products";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Every Tropijoy review, straight from product pages — nothing curated.",
};

export default function ReviewsPage() {
  const breakdown = buildRatingBreakdown(seededReviews);
  const sorted = [...seededReviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Reviews" }]} />

      <SectionHeading
        eyebrow="What people say"
        as="h1"
        title="All Reviews"
        description="Every review across every product, newest first."
        className="my-10"
      />

      <div className="grid lg:grid-cols-[280px_1fr] gap-10">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-white border border-forest/10 p-6">
            <p className="font-display font-extrabold text-4xl text-forest-deep">
              {breakdown.average.toFixed(1)}
            </p>
            <div className="flex items-center gap-0.5 mt-2 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className={
                    i < Math.round(breakdown.average)
                      ? "fill-sunny text-sunny-dark"
                      : "text-forest/15"
                  }
                />
              ))}
            </div>
            <p className="text-sm text-forest-deep/50 mb-5">
              {breakdown.total} reviews
            </p>
            <div className="space-y-2">
              {breakdown.distribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-forest-deep/50 shrink-0">
                    {row.stars}★
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-forest/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sunny"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-forest-deep/40 shrink-0">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          {sorted.map((review, i) => {
            const product = getProductById(review.productId);
            const accent = product ? FRUIT_ACCENTS[product.fruitType] : null;
            return (
              <Reveal key={review.id} delay={Math.min(i * 0.02, 0.2)}>
                <div className="rounded-3xl bg-white border border-forest/10 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-forest text-white text-sm font-bold flex items-center justify-center shrink-0">
                        {review.author.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-forest-deep">
                          {review.author}
                        </p>
                        <p className="text-xs text-forest-deep/40">
                          {formatDate(review.date)}
                          {review.verified && " · Verified purchase"}
                        </p>
                      </div>
                    </div>
                    {product && (
                      <Link
                        href={`/shop/${product.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold hover:underline"
                        style={
                          accent
                            ? { backgroundColor: `${accent.hex}1a`, color: accent.hex }
                            : undefined
                        }
                      >
                        {product.name}
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        size={13}
                        className={
                          s < review.rating
                            ? "fill-sunny text-sunny-dark"
                            : "text-forest/15"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-forest-deep mb-1">
                    {review.title}
                  </p>
                  <p className="text-sm text-forest-deep/70 leading-relaxed">
                    {review.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
