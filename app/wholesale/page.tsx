import type { Metadata } from "next";
import { Handshake, Package, Percent, Truck } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import InquiryForm from "@/components/shared/InquiryForm";

export const metadata: Metadata = {
  title: "Bulk & Wholesale Orders",
  description:
    "Stock Tropijoy dried fruit and banana powder at your cafe, bar, bakery or organic mart — wholesale pricing and case sizes for Nepal-based businesses.",
};

const perks = [
  {
    icon: Percent,
    title: "Tiered wholesale pricing",
    body: "Per-unit pricing drops as order volume grows — ask for a rate card for your expected monthly volume.",
  },
  {
    icon: Package,
    title: "Case-packed for retail",
    body: "100g and 200g pouches ship in retail-ready cases, shelf-labelled and ready to stock without repacking.",
  },
  {
    icon: Truck,
    title: "Reliable restock",
    body: "We hold buffer stock for wholesale partners so a popular fruit doesn't disappear from your shelf mid-season.",
  },
  {
    icon: Handshake,
    title: "Direct relationship",
    body: "No distributor markup — you order directly from us and talk to the same small team every time.",
  },
];

export default function WholesalePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Bulk & Wholesale Orders" }]}
      />

      <SectionHeading
        eyebrow="For businesses"
        as="h1"
        title="Bulk & wholesale orders"
        description="Cafes, bars (dried citrus makes a great cocktail garnish), bakeries and organic marts across Nepal carry our fruit. Here's how to become one of them."
        className="my-10"
      />

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {perks.map((perk, i) => (
          <Reveal key={perk.title} delay={i * 0.08}>
            <div className="h-full rounded-3xl bg-white border border-forest/10 p-7">
              <div className="w-12 h-12 rounded-2xl bg-forest/8 flex items-center justify-center mb-5">
                <perk.icon size={22} className="text-forest" />
              </div>
              <h3 className="font-display font-bold text-lg text-forest-deep mb-2">
                {perk.title}
              </h3>
              <p className="text-sm text-forest-deep/65 leading-relaxed">
                {perk.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
        <div className="rounded-3xl bg-forest text-cream p-8 sm:p-10">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-3">
            How it works
          </h2>
          <ol className="text-cream/75 leading-relaxed space-y-4 mt-5">
            <li>
              <span className="font-semibold text-white">1. Tell us about your shop.</span>{" "}
              Send your enquiry with your business type and expected monthly volume.
            </li>
            <li>
              <span className="font-semibold text-white">2. We send a rate card.</span>{" "}
              Pricing and minimum order quantities tailored to your volume.
            </li>
            <li>
              <span className="font-semibold text-white">3. First order ships.</span>{" "}
              Case-packed and ready to shelve, dispatched from Kathmandu.
            </li>
          </ol>
        </div>

        <InquiryForm
          source="wholesale-inquiry"
          title="Enquire about wholesale"
          subtitle="Tell us about your business and we'll send pricing and minimums."
          messageLabel="About your business"
          messagePlaceholder="e.g. Cocktail bar in Kathmandu, interested in dried citrus for garnishes"
        />
      </div>
    </div>
  );
}
