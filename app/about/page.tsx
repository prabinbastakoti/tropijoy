import type { Metadata } from "next";
import { ArrowRight, Leaf, Package, Sparkles, Sun } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import { ButtonLink } from "@/components/ui/Button";
import HeritageBand from "@/components/brand/HeritageBand";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tropijoy selects premium Nepali market fruit and dries it in small batches, with nothing added. Here's why.",
};

const stats = [
  { value: 100, suffix: "%", label: "natural ingredients" },
  { value: products.length, suffix: "", label: "products" },
  { value: 2400, suffix: "+", label: "happy customers" },
  { value: 0, suffix: "", label: "grams of added sugar" },
];

const pillars = [
  {
    icon: Sun,
    title: "Selected, not just sourced",
    body: "We hand-select ripe, premium fruit from trusted Nepali markets rather than accepting whatever's cheapest. Riper fruit means more sugar, better flavour and better yield.",
  },
  {
    icon: Leaf,
    title: "Gently dried",
    body: "Slices dry at 45–55°C over 8–14 hours. Our banana powder is freeze-dried under vacuum so nothing ever cooks — which is why it stays a true pale gold instead of browning.",
  },
  {
    icon: Package,
    title: "Small-batch packed",
    body: "Sealed within 48 hours into nitrogen-flushed, resealable pouches. Nine month shelf life instead of two years, because we don't use sulphites.",
  },
  {
    icon: Sparkles,
    title: "Radically plain labels",
    body: "One ingredient per pouch: the fruit on the front. If a batch doesn't taste good unsweetened, we reject the batch rather than sweeten it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

        {/* intro */}
        <div className="mt-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <span className="inline-block text-xs font-bold tracking-[0.18em] text-forest uppercase mb-4">
              Our story
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-display-md text-forest-deep leading-[1.05] text-balance">
              We started because the labels made us angry
            </h1>
            <div className="mt-6 space-y-4 text-forest-deep/70 leading-relaxed">
              <p>
                In 2023 we picked up a packet of dried fruit in a Kathmandu
                supermarket and read the back. Sugar was the second ingredient.
                Then a sulphite preservative. Then an artificial colour to keep
                it looking bright.
              </p>
              <p>
                None of that was there to make the fruit better. It was there to
                make cheap, early-picked fruit acceptable — and to keep it on a
                shelf for two years.
              </p>
              <p>
                So we started selecting premium fruit ourselves, drying it in
                small batches, and putting exactly one ingredient in each
                pouch. It costs more and yields less. We think it&apos;s
                obviously the right trade.
              </p>
            </div>
            <div className="mt-8">
              <ButtonLink href="/shop">
                See what we make <ArrowRight size={18} />
              </ButtonLink>
            </div>
          </Reveal>

          {/* stat panel — typography instead of photography */}
          <Reveal delay={0.15}>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest via-forest-light to-forest-deep p-8 sm:p-10 noise">
              <HeritageBand
                tone="dark"
                imageClassName="object-top"
                heightClassName="h-32 sm:h-44"
                className="-bottom-[15px]"
              />
              <div className="relative grid grid-cols-2 gap-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display font-extrabold text-4xl sm:text-5xl text-white leading-none">
                      <CountUp to={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="mt-2 text-sm text-white/65 leading-snug">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* pillars */}
        <div className="mt-24 grid sm:grid-cols-2 gap-6">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-white border border-forest/10 p-7">
                <div className="w-12 h-12 rounded-2xl bg-forest/8 flex items-center justify-center mb-5">
                  <pillar.icon size={22} className="text-forest" />
                </div>
                <h3 className="font-display font-bold text-lg text-forest-deep mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-forest-deep/65 leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <ProcessTimeline />

      {/* honest caveat */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Reveal>
          <div className="rounded-3xl bg-white border border-forest/10 p-8 sm:p-10">
            <h2 className="font-display font-extrabold text-2xl text-forest-deep mb-4">
              What we get wrong
            </h2>
            <p className="text-forest-deep/70 leading-relaxed mb-4">
              Sourcing seasonally means accepting the season. There are weeks
              when a variety simply isn&apos;t at the quality we want, and we
              go out of stock rather than lower our bar. Customers notice, and
              occasionally they&apos;re annoyed.
            </p>
            <p className="text-forest-deep/70 leading-relaxed">
              Our fruit also changes colour over its shelf life, and batches
              taste different from harvest to harvest. We could blend all of that
              away into something uniform. We&apos;d rather you tasted the year.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
