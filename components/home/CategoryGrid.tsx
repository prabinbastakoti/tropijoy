import { Leaf, Sprout, Star } from "lucide-react";
import { getShoppableProducts, priceFrom } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";

export default function CategoryGrid() {
  const bestsellers = getShoppableProducts();
  const cheapest = Math.min(...bestsellers.map(priceFrom));
  const avgRating =
    bestsellers.reduce((sum, p) => sum + p.rating, 0) / bestsellers.length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <SectionHeading
        align="left"
        eyebrow="Bestsellers"
        title="Loved Across Nepal"
        description="Six fruits, dried the same honest way — nothing added, nothing hidden."
        className="mb-10"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
        {bestsellers.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 rounded-3xl bg-white border border-forest/10 p-5">
            <div className="w-11 h-11 rounded-2xl bg-forest/8 flex items-center justify-center shrink-0">
              <Star size={20} className="text-forest" />
            </div>
            <div>
              <p className="font-display font-extrabold text-2xl text-forest-deep leading-none">
                {avgRating.toFixed(1)}★
              </p>
              <p className="text-xs text-forest-deep/55 mt-1">average customer rating</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-white border border-forest/10 p-5">
            <div className="w-11 h-11 rounded-2xl bg-forest/8 flex items-center justify-center shrink-0">
              <Leaf size={20} className="text-forest" />
            </div>
            <div>
              <p className="font-display font-extrabold text-2xl text-forest-deep leading-none">
                {bestsellers.length}
              </p>
              <p className="text-xs text-forest-deep/55 mt-1">one ingredient each</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-forest p-5 text-cream">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Sprout size={20} className="text-white" />
            </div>
            <div>
              <p className="font-display font-extrabold text-2xl leading-none">
                From {formatPrice(cheapest)}
              </p>
              <p className="text-xs text-cream/60 mt-1">free delivery over Rs. 3,000</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
