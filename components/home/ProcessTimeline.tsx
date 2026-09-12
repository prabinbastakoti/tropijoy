"use client";

import { motion } from "framer-motion";
import { Droplets, Package, ShieldCheck, Snowflake, Zap } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

type Tint = "forest" | "sunny";

const tintClasses: Record<Tint, string> = {
  forest: "bg-forest/8 text-forest",
  sunny: "bg-sunny/12 text-sunny-dark",
};

const steps: {
  icon: typeof ShieldCheck;
  title: string;
  detail: string;
  meta: string;
  tint: Tint;
}[] = [
  {
    icon: ShieldCheck,
    title: "Selecting premium fruit",
    detail:
      "We hand-pick premium, ripe fruit from trusted Nepali markets — checked for quality before anything is sliced.",
    meta: "Step 1",
    tint: "forest",
  },
  {
    icon: Droplets,
    title: "Hygienic washing",
    detail:
      "Every batch is washed in a sanitary facility to remove dirt and residue before processing begins.",
    meta: "Step 2",
    tint: "sunny",
  },
  {
    icon: Zap,
    title: "Precision machine slicing",
    detail:
      "Uniform, machine-sliced cuts for consistent texture and even drying — no ragged hand-cut pieces.",
    meta: "Step 3",
    tint: "forest",
  },
  {
    icon: Snowflake,
    title: "Low-temperature dehydration",
    detail:
      "Dried slow and low at 45–55°C so flavour, colour and nutrition are protected — nothing ever cooks.",
    meta: "Step 4",
    tint: "sunny",
  },
  {
    icon: Package,
    title: "Airtight resealable packaging",
    detail:
      "Sealed into airtight, resealable pouches that lock in freshness and crunch — no preservatives, ever.",
    meta: "Step 5",
    tint: "forest",
  },
];

function StepCard({
  step,
  className,
}: {
  step: (typeof steps)[number];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-3xl bg-white border border-forest/8 shadow-sm hover:shadow-lift hover:-translate-y-1 transition-all duration-300 pt-7 pb-7 px-6 text-center h-full flex flex-col items-center",
        className
      )}
    >
      <div
        className={cn(
          "w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-5",
          tintClasses[step.tint]
        )}
      >
        <step.icon size={32} strokeWidth={2} />
      </div>

      <p className="text-[11px] font-bold uppercase tracking-wider text-forest/45 mb-1.5">
        {step.meta}
      </p>
      <h3 className="font-display font-bold text-lg text-forest-deep mb-2 text-balance min-h-[3.25rem] flex items-center justify-center lg:min-h-[3.5rem]">
        {step.title}
      </h3>
      <p className="text-sm text-forest-deep/60 leading-relaxed text-balance">
        {step.detail}
      </p>
    </div>
  );
}

export default function ProcessTimeline() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
      {/* soft organic glow, purely decorative — echoes the hero for visual cohesion */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-sunny/8 blur-3xl -z-10"
        aria-hidden
      />

      <SectionHeading
        eyebrow="Our Sourcing & Quality Process"
        title="From market fruit to pouch, five careful steps"
        description="No shortcuts, no mystery ingredients. Here's exactly what happens before your pouch is sealed."
        className="mb-16"
      />

      {/* mobile / tablet — swipeable row */}
      <div className="lg:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar">
        {steps.map((step, i) => (
          <Reveal
            key={step.title}
            delay={i * 0.1}
            className="shrink-0 w-[78%] sm:w-[45%] snap-center"
          >
            <StepCard step={step} />
          </Reveal>
        ))}
      </div>

      {/* desktop — five-across grid with a connecting line */}
      <div className="hidden lg:block relative">
        <div className="absolute top-[64px] left-[10%] right-[10%] h-0.5 bg-forest/10">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ originX: 0 }}
            className="h-full bg-gradient-to-r from-forest via-forest-light to-forest"
          />
        </div>

        <div className="grid grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.12}>
              <StepCard step={step} />
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal delay={0.3}>
        <div className="mt-12 text-center">
          <Link
            href="/our-process"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-forest-light transition-colors"
          >
            See our full quality process <ArrowRight size={15} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
