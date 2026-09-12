import type { Metadata } from "next";
import ShopBrowser from "@/components/product/ShopBrowser";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse every Tropijoy product — dehydrated fruit slices and freeze-dried fruit powders. No added sugar, no preservatives.",
};

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

      <SectionHeading
        eyebrow="Our collection"
        as="h1"
        title="Shop Tropijoy"
        description="Every product is dried in small batches to protect flavour, colour and nutrition. Nothing added, ever."
        className="my-10"
      />

      <ShopBrowser />
    </div>
  );
}
