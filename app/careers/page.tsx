import type { Metadata } from "next";
import { Heart, Leaf, Sprout, Users } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import InquiryForm from "@/components/shared/InquiryForm";
import { BUSINESS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Work at Tropijoy — a small team in Kathmandu drying fruit the honest way. Current openings and how to reach us.",
};

const values = [
  {
    icon: Leaf,
    title: "We taste everything",
    body: "Every batch gets tasted before it ships, by whoever is in the room — not just the person whose job it technically is.",
  },
  {
    icon: Users,
    title: "Small team, real ownership",
    body: "We're a handful of people, not a department chart. Whatever you work on, you see it through to the pouch.",
  },
  {
    icon: Sprout,
    title: "Direct with farms",
    body: "Everyone on the team ends up on a farm visit eventually. It's hard to write honest copy about sourcing you've never seen.",
  },
  {
    icon: Heart,
    title: "No shortcuts culture",
    body: "The same rule that keeps sugar out of our pouches applies internally: if it's not right, we say so rather than ship it anyway.",
  },
];

export default function CareersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Careers" }]} />

      <SectionHeading
        eyebrow="Join us"
        as="h1"
        title="Careers at Tropijoy"
        description={`We're a small team based in ${BUSINESS.location}, buying fruit direct from Nepali farms and drying it without shortcuts. Here's what that's like to work on.`}
        className="my-10"
      />

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {values.map((value, i) => (
          <Reveal key={value.title} delay={i * 0.08}>
            <div className="h-full rounded-3xl bg-white border border-forest/10 p-7">
              <div className="w-12 h-12 rounded-2xl bg-forest/8 flex items-center justify-center mb-5">
                <value.icon size={22} className="text-forest" />
              </div>
              <h3 className="font-display font-bold text-lg text-forest-deep mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-forest-deep/65 leading-relaxed">{value.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
        <div className="rounded-3xl bg-forest text-cream p-8 sm:p-10">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-3">
            No open roles right now
          </h2>
          <p className="text-cream/70 leading-relaxed mb-4">
            We hire rarely, and only when the team genuinely needs another
            person — not on a schedule. There&apos;s nothing open at the
            moment, but we keep every speculative application on file and
            reach out when that changes.
          </p>
          <p className="text-cream/70 leading-relaxed">
            If you think you&apos;d be useful here — on sourcing, production,
            operations, or anything else — tell us why. We read every one of
            these ourselves.
          </p>
        </div>

        <InquiryForm
          source="careers-speculative"
          title="Introduce yourself"
          subtitle="No open roles right now, but we keep every message on file."
          messageLabel="What would you want to work on?"
          messagePlaceholder="A bit about you and what you're looking for."
        />
      </div>
    </div>
  );
}
