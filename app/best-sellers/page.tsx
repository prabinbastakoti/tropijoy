import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { getBestSellers, priceFrom } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Best Sellers",
  description:
    "The Tropijoy products our customers reach for again and again, ranked by rating.",
};

export default function BestSellersPage() {
  const bestSellers = getBestSellers();
  const podium = bestSellers.slice(0, 3);
  const rest = bestSellers.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Best Sellers" }]}
      />

      <SectionHeading
        eyebrow="Customer favourites"
        as="h1"
        title="Best Sellers"
        description="Ranked by average rating across every verified review. These are the pouches that keep selling out."
        className="my-10"
      />

      {/* podium */}
      <div className="grid md:grid-cols-3 gap-5 mb-14">
        {podium.map((product, i) => (
          <Reveal key={product.id} delay={i * 0.1}>
            <div className="rounded-3xl bg-white border border-forest/10 p-5 h-full">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 shrink-0 rounded-full bg-sunny text-white font-display font-extrabold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex items-center gap-2">
                  <Trophy size={15} className="text-sunny-dark" />
                  <span className="text-xs font-bold uppercase tracking-wider text-forest/50">
                    {product.rating.toFixed(1)} average · {product.reviewsCount}{" "}
                    reviews
                  </span>
                </div>
              </div>
              <h3 className="font-display font-bold text-xl text-forest-deep mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-forest-deep/60 leading-relaxed line-clamp-3 mb-4">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-forest-deep">
                  {formatPrice(priceFrom(product))}
                </span>
                <ButtonLink href={`/shop/${product.slug}`} size="sm">
                  View
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {rest.length > 0 && (
        <>
          <h2 className="font-display font-bold text-2xl text-forest-deep mb-8">
            Also loved
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {rest.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
