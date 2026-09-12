import type { Metadata } from "next";
import BlogIndex from "@/components/blog/BlogIndex";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Recipes, nutrition explainers, sourcing stories and practical guides from the Tropijoy kitchen.",
};

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <SectionHeading
        eyebrow="Our stories"
        as="h1"
        title="Things worth knowing about fruit"
        description="Recipes, nutrition explainers and honest notes from the people who dry it."
        className="my-10"
      />

      <BlogIndex />
    </div>
  );
}
