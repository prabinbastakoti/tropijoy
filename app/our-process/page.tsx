import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import HeritageBand from "@/components/brand/HeritageBand";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Our Quality & Process",
  description:
    "How Tropijoy selects, washes, slices, dries and packs fruit — from premium market produce to a sealed, resealable pouch.",
};

const qualityChecks = [
  "Selected from trusted Nepali markets at peak ripeness",
  "Washed in a sanitary, food-safe facility",
  "Cut on precision slicing machines for uniform thickness",
  "Dried low and slow — nothing is ever cooked",
  "Sealed within 48 hours in nitrogen-flushed pouches",
];

const productSamples = [
  { fruit: "Apple", src: "/products/apple.png" },
  { fruit: "Orange", src: "/products/orange.png" },
  { fruit: "Banana", src: "/products/banana.png" },
  { fruit: "Lemon", src: "/products/lemon.png" },
  { fruit: "Pineapple", src: "/products/pineapple.png" },
];

export default function OurProcessPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Our Quality & Process" }]}
        />

        <div className="mt-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <Reveal>
            <span className="inline-block text-xs font-bold tracking-[0.18em] text-forest uppercase mb-4">
              Our sourcing &amp; quality process
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-display-md text-forest-deep leading-[1.05] text-balance">
              From premium fruit to a sealed pouch
            </h1>
            <div className="mt-6 space-y-4 text-forest-deep/70 leading-relaxed">
              <p>
                We select premium, ripe fruit from trusted Nepali markets —
                checked by hand before anything is washed or sliced. Quality
                starts with what we choose, not just how it&apos;s processed.
              </p>
              <p>
                From there, every batch follows the same disciplined process:
                hygienic washing, precision machine-slicing for even texture,
                low-temperature dehydration, and airtight resealable
                packaging — sealed while the fruit is still at its best.
              </p>
              <p>
                No sulphites, no added sugar, no shortcuts. One ingredient on
                every label.
              </p>
            </div>
            <div className="mt-8">
              <ButtonLink href="/quality-and-safety" variant="outline">
                Quality &amp; safety standards <ArrowRight size={18} />
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-[2rem] bg-white border border-forest/10 p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-5">
                What every batch goes through
              </p>
              <ul className="space-y-4">
                {qualityChecks.map((check) => (
                  <li key={check} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-forest shrink-0 mt-0.5" />
                    <p className="text-sm text-forest-deep/75 leading-relaxed">
                      {check}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      <ProcessTimeline />

      {/* authenticity — real packaging */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <SectionHeading
          eyebrow="No surprises"
          title="Exactly what arrives at your door"
          description="Every pouch is labelled with the fruit on the front and nothing hidden on the back."
          className="mb-10"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {productSamples.map((product, i) => (
            <Reveal key={product.fruit} delay={i * 0.06}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-forest/10 bg-white">
                <Image
                  src={product.src}
                  alt={`Tropijoy ${product.fruit} packaging`}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                  className="object-contain p-4"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* closing CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest via-forest-light to-forest-deep px-6 py-14 sm:px-14 sm:py-20 text-center noise">
          <HeritageBand
            tone="dark"
            imageClassName="object-top"
            heightClassName="h-40 sm:h-56"
          />
          <div className="relative">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white text-balance">
              Taste the difference precision makes
            </h2>
            <p className="mt-4 text-white/70 max-w-lg mx-auto text-balance">
              Selected, washed, sliced, dried and sealed with the same care,
              every batch.
            </p>
            <div className="mt-8">
              <ButtonLink href="/shop" size="lg">
                Shop All Products <ArrowRight size={18} />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
