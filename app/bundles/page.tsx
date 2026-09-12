import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ProductCard from "@/components/product/ProductCard";
import { getBundles } from "@/lib/products";

export const metadata: Metadata = {
  title: "Custom Bundles",
  description:
    "Curated multi-pouch bundles of our bestselling dried fruit and banana powder, priced below buying each pouch separately.",
};

export default function BundlesPage() {
  const bundles = getBundles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Bundles" }]} />

      <SectionHeading
        eyebrow="Build Your Bundle"
        as="h1"
        title="Custom Snack Bundles"
        description="Curated 3- and 6-pouch bundles of our bestsellers, priced below buying each pouch separately. Perfect for healthy daily snacking or gifting."
        className="my-10"
      />

      <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
        {bundles.map((bundle, i) => (
          <Reveal key={bundle.id} delay={i * 0.08}>
            <ProductCard product={bundle} index={i} />
          </Reveal>
        ))}
      </div>

      <p className="mt-10 text-sm text-forest-deep/50 max-w-2xl">
        Looking for something more specific — a mixed hamper, a corporate
        order, or a fully custom pouch count? Visit{" "}
        <a href="/gifting" className="text-forest font-semibold hover:underline">
          Gifting &amp; Bulk Orders
        </a>{" "}
        or{" "}
        <a href="/corporate-gifting" className="text-forest font-semibold hover:underline">
          Corporate Gifting
        </a>
        .
      </p>
    </div>
  );
}
