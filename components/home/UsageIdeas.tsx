import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

const ideas = [
  {
    title: "Banana Powder",
    image: "/products/banana-powder.png",
    uses: ["Smoothies", "Baby food", "Healthy baking"],
  },
  {
    title: "Dried Citrus",
    image: "/products/lemon.png",
    uses: ["Cocktail garnishes", "Tea infusions", "Detox water"],
  },
];

export default function UsageIdeas() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
      <SectionHeading
        eyebrow="Usage Ideas & Recipes"
        title="More than a snack"
        description="A few ways our customers actually use these — see the full list on our recipes page."
        className="mb-10"
      />

      <div className="grid sm:grid-cols-2 gap-5">
        {ideas.map((idea, i) => (
          <Reveal key={idea.title} delay={i * 0.08}>
            <Link
              href="/recipes"
              className="group flex items-center gap-5 rounded-3xl bg-white border border-forest/10 p-6 hover:shadow-lift transition-shadow h-full"
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-cream shrink-0 overflow-hidden">
                <Image
                  src={idea.image}
                  alt={idea.title}
                  fill
                  sizes="144px"
                  className="object-contain p-3"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-lg text-forest-deep">
                    {idea.title}
                  </h3>
                  <ArrowUpRight
                    size={18}
                    className="text-forest-deep/40 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-forest"
                  />
                </div>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {idea.uses.map((use) => (
                    <li
                      key={use}
                      className="rounded-full bg-sage px-2.5 py-1 text-xs font-medium text-forest-deep/75"
                    >
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
