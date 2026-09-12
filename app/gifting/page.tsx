import type { Metadata } from "next";
import { ArrowRight, Gift } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import BundleCard from "@/components/gifting/BundleCard";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Gifting & Bulk Orders",
  description:
    "Curated Tropijoy gift bundles for festivals and corporate gifting, plus bulk order enquiries for larger quantities.",
};

const bundles = [
  {
    title: "The Original Five",
    description:
      "One 100g pouch of every dried fruit we make — apple, lemon, orange, pineapple and banana. The easiest way to introduce someone to Tropijoy.",
    lines: [
      { productId: "dried-apple", variantId: "100g" },
      { productId: "dried-lemon", variantId: "100g" },
      { productId: "dried-orange", variantId: "100g" },
      { productId: "dried-pineapple", variantId: "100g" },
      { productId: "dried-banana", variantId: "100g" },
    ],
  },
  {
    title: "Smoothie Starter",
    description:
      "Banana powder plus dried apple and orange for topping — everything you need for the smoothie bowl recipes on our journal.",
    lines: [
      { productId: "banana-powder", variantId: "50g" },
      { productId: "dried-apple", variantId: "100g" },
      { productId: "dried-orange", variantId: "100g" },
    ],
  },
  {
    title: "Trekker's Stash",
    description:
      "Full 200g pouches of apple, banana and orange — calorie-dense, pack-friendly, and built for a week on the trail.",
    lines: [
      { productId: "dried-apple", variantId: "200g" },
      { productId: "dried-banana", variantId: "200g" },
      { productId: "dried-orange", variantId: "200g" },
    ],
  },
];

export default function GiftingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Gifting & Bulk Orders" }]}
      />

      <SectionHeading
        eyebrow="Gifting"
        as="h1"
        title="Gift bundles worth giving"
        description="Curated combinations of our real products — added to your cart as one click, sized however you like."
        className="my-10"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {bundles.map((bundle, i) => (
          <Reveal key={bundle.title} delay={i * 0.08}>
            <BundleCard {...bundle} />
          </Reveal>
        ))}
      </div>

      <div className="rounded-3xl bg-forest text-cream p-8 sm:p-10">
        <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
          <Gift size={22} className="text-white" />
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-3">
          Corporate gifting &amp; bulk orders
        </h2>
        <p className="text-cream/70 leading-relaxed mb-6 max-w-xl">
          Festival hampers, office gifting, weddings, or a large one-off
          order — tell us the quantity and occasion and we&apos;ll put
          together pricing, custom pouch counts, and branded packaging
          options.
        </p>
        <ButtonLink href="/corporate-gifting">
          Explore Corporate Gifting <ArrowRight size={18} />
        </ButtonLink>
      </div>
    </div>
  );
}
