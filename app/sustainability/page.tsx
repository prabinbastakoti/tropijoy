import type { Metadata } from "next";
import { Leaf, Package, Recycle, Truck } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import HeritageBand from "@/components/brand/HeritageBand";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "How Tropijoy thinks about packaging, food waste and sourcing — the honest version, including what we haven't solved yet.",
};

const pillars = [
  {
    icon: Truck,
    title: "Less distance, less waste",
    body: "Selecting fruit close to our processing facility means it travels once — market to facility to you — instead of sitting in transit longer than it needs to. Less time in transit means less spoilage along the way.",
  },
  {
    icon: Package,
    title: "Dehydration is a waste-reduction tool",
    body: "A nine-month shelf life means less fruit gets thrown out at every stage — ours, and yours. That's the original point of drying food, long before it was a snack trend.",
  },
  {
    icon: Recycle,
    title: "Resealable, not single-use",
    body: "Our pouches are designed to be opened and closed dozens of times over months, not torn open once. Less packaging per gram of fruit eaten than a multi-pack of small snack bags.",
  },
  {
    icon: Leaf,
    title: "No industrial inputs",
    body: "No added sugar, preservatives or colourings means nothing extra to manufacture, transport or dispose of — the footprint of the product is just the footprint of the fruit.",
  },
];

export default function SustainabilityPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sustainability" }]} />

        <SectionHeading
          eyebrow="How we think about it"
          as="h1"
          title="Sustainability, honestly"
          description="We're a small business, not a certification body. Here's what we actually do, and what we haven't solved yet."
          className="my-10"
        />

        <div className="grid sm:grid-cols-2 gap-6 mb-14">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-white border border-forest/10 p-7">
                <div className="w-12 h-12 rounded-2xl bg-forest/8 flex items-center justify-center mb-5">
                  <pillar.icon size={22} className="text-forest" />
                </div>
                <h3 className="font-display font-bold text-lg text-forest-deep mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-forest-deep/65 leading-relaxed">{pillar.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="rounded-3xl bg-white border border-forest/10 p-8 sm:p-10 max-w-3xl">
            <h2 className="font-display font-extrabold text-2xl text-forest-deep mb-4">
              What we haven&apos;t solved
            </h2>
            <p className="text-forest-deep/70 leading-relaxed mb-4">
              Our pouches are food-safe multi-layer film, which is what
              actually keeps a nitrogen-flushed product shelf-stable for nine
              months — and that construction isn&apos;t easily recyclable
              through household collection in Nepal today. We haven&apos;t
              found a barrier packaging alternative that keeps the product
              this fresh without added preservatives, but we&apos;re
              genuinely looking.
            </p>
            <p className="text-forest-deep/70 leading-relaxed">
              We&apos;d rather say that plainly than put a vague green label
              on the pouch. If that changes, this page will say so.
            </p>
          </div>
        </Reveal>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest via-forest-light to-forest-deep px-6 py-14 sm:px-14 sm:py-20 text-center noise">
          <HeritageBand
            tone="dark"
            imageClassName="object-top"
            heightClassName="h-40 sm:h-56"
          />
          <div className="relative">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white text-balance">
              See where it starts
            </h2>
            <p className="mt-4 text-white/70 max-w-lg mx-auto text-balance">
              Our sourcing, our process, and the trade-offs we make for it.
            </p>
            <div className="mt-8">
              <ButtonLink href="/our-process" size="lg">
                Our Quality &amp; Process <ArrowRight size={18} />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
