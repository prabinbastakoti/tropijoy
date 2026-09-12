import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import BlogCard from "@/components/blog/BlogCard";
import { posts } from "@/lib/blog";
import { getShoppableProducts, FRUIT_ACCENTS } from "@/lib/products";

const products = getShoppableProducts();

export const metadata: Metadata = {
  title: "Recipes & Uses",
  description:
    "Quick ways to use every Tropijoy product — from smoothie bowls to trail mix — plus our in-depth recipe guides.",
};

const quickUses: Record<string, string> = {
  "dried-apple": "Toss into porridge or trail mix, or eat straight from the pouch.",
  "dried-lemon": "Steep a slice in hot water for tea, or muddle into a cocktail.",
  "dried-orange": "Garnish a dessert, or simmer into a mulled drink.",
  "dried-pineapple": "Chop into yoghurt bowls or a tropical trail mix.",
  "dried-banana": "Pack for trekking, or crush over oats for crunch.",
  "banana-powder": "Blend into smoothies, or fold into pancake and cake batter.",
};

export default function RecipesPage() {
  const recipePosts = posts.filter((p) => p.category === "Recipes");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Recipes & Uses" }]} />

      <SectionHeading
        eyebrow="In the kitchen"
        as="h1"
        title="Recipes & Uses"
        description="Six products, endless ways to eat them. Start with a quick idea, or read a full recipe below."
        className="my-10"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 mb-16">
        {products.map((product, i) => {
          const accent = FRUIT_ACCENTS[product.fruitType];
          return (
            <Reveal key={product.id} delay={Math.min(i * 0.05, 0.3)}>
              <Link
                href={`/shop/${product.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white border border-forest/10 hover:shadow-lift transition-shadow"
              >
                <div className="relative aspect-[4/3] bg-cream">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                    className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p
                    className="text-[11px] font-bold uppercase tracking-wide mb-1"
                    style={{ color: accent.hex }}
                  >
                    {product.name}
                  </p>
                  <p className="text-sm text-forest-deep/70 leading-snug">
                    {quickUses[product.id]}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      {recipePosts.length > 0 && (
        <>
          <h2 className="font-display font-bold text-2xl text-forest-deep mb-8">
            In-depth recipes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recipePosts.map((post) => (
              <BlogCard key={post.slug} post={post} size="lg" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
