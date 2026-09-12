import type { Metadata } from "next";
import { Briefcase, Gift, PartyPopper, Sparkles } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import InquiryForm from "@/components/shared/InquiryForm";

export const metadata: Metadata = {
  title: "Corporate & Event Gifting",
  description:
    "Dashain and Tihar hampers, wedding favours, and office gift boxes — Tropijoy corporate gifting with custom branding options.",
};

const occasions = [
  {
    icon: PartyPopper,
    title: "Dashain & Tihar Hampers",
    body: "Mixed-fruit festival hampers sized for family gifting or office-wide distribution, ready before the holiday rush.",
  },
  {
    icon: Briefcase,
    title: "Corporate Gift Boxes",
    body: "Client appreciation, employee welcome kits, or year-end gifting — natural, healthy, and easy to justify on an expense report.",
  },
  {
    icon: Gift,
    title: "Weddings & Events",
    body: "Favour-sized pouches for wedding guests or event attendees, with consistent presentation across large quantities.",
  },
  {
    icon: Sparkles,
    title: "Custom Branding",
    body: "Add your logo or a custom message to pouches or outer packaging on qualifying order volumes.",
  },
];

export default function CorporateGiftingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Corporate Gifting" }]}
      />

      <SectionHeading
        eyebrow="Corporate & Event Gifting"
        as="h1"
        title="Gifting that reflects well on you"
        description="Festival hampers, office gift boxes, and event favours — all built from the same real, one-ingredient products we sell every day."
        className="my-10"
      />

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {occasions.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08}>
            <div className="h-full rounded-3xl bg-white border border-forest/10 p-7">
              <div className="w-12 h-12 rounded-2xl bg-forest/8 flex items-center justify-center mb-5">
                <item.icon size={22} className="text-forest" />
              </div>
              <h3 className="font-display font-bold text-lg text-forest-deep mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-forest-deep/65 leading-relaxed">
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="max-w-xl">
        <InquiryForm
          source="corporate-gifting-inquiry"
          title="Get a corporate gifting quote"
          subtitle="Tell us the occasion, quantity, and timeline — we'll follow up with pricing and options."
          messageLabel="What are you planning?"
          messagePlaceholder="e.g. 60 branded Dashain hampers for our Kathmandu office, needed by early Asoj"
        />
      </div>
    </div>
  );
}
