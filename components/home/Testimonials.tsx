"use client";

import { CheckCircle2, Quote, Star } from "lucide-react";
import { seededReviews } from "@/lib/reviews";
import { getProductById } from "@/lib/products";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import Spotlight from "@/components/motion/Spotlight";

/** Pull the most-helpful 5-star reviews so the section reflects real seeded data. */
const featured = seededReviews
  .filter((r) => r.rating === 5 && r.body.length > 120)
  .sort((a, b) => b.helpfulCount - a.helpfulCount)
  .slice(0, 3);

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <SectionHeading
        eyebrow="What people say"
        title="2,400+ happy customers"
        description="Reviews pulled straight from product pages — nothing curated."
        className="mb-12"
      />

      <StaggerGroup className="grid md:grid-cols-3 gap-6">
        {featured.map((review) => {
          const product = getProductById(review.productId);
          return (
            <StaggerItem key={review.id}>
              <Spotlight className="h-full">
                <figure className="relative h-full rounded-3xl bg-white border border-forest/10 p-7 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Quote size={28} className="text-sunny shrink-0" aria-hidden />
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-forest/8 text-forest text-[10px] font-bold uppercase tracking-wide px-2.5 py-1">
                        <CheckCircle2 size={11} /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        size={13}
                        className="fill-sunny text-sunny-dark"
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm text-forest-deep/75 leading-relaxed flex-1">
                    {review.body}
                  </blockquote>
                  <figcaption className="mt-5 pt-5 border-t border-forest/10 flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-forest text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {review.author.charAt(0)}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-forest-deep truncate">
                        {review.author}
                      </span>
                      <span className="block text-xs text-forest-deep/45 truncate">
                        on {product?.name ?? "Tropijoy"}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Spotlight>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
