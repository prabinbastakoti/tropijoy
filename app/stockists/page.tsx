import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Store } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import InquiryForm from "@/components/shared/InquiryForm";

export const metadata: Metadata = {
  title: "Stockists",
  description:
    "Where to buy Tropijoy — currently online across Nepal, with retail partners opening soon. Want to stock us? Get in touch.",
};

export default function StockistsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Stockists" }]} />

      <SectionHeading
        eyebrow="Where to buy"
        as="h1"
        title="Online now, in stores soon"
        description="Tropijoy is currently available directly through this website, with delivery across Nepal. We're actively building out retail partnerships."
        className="my-10"
      />

      <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
        <Reveal>
          <div className="rounded-3xl bg-white border border-forest/10 p-7 sm:p-9">
            <span className="w-12 h-12 rounded-2xl bg-forest/8 flex items-center justify-center mb-5">
              <Store size={22} className="text-forest" />
            </span>
            <h2 className="font-display font-bold text-xl text-forest-deep mb-3">
              How to buy Tropijoy today
            </h2>
            <p className="text-sm text-forest-deep/65 leading-relaxed mb-4">
              The full range ships nationwide from{" "}
              <Link href="/shop" className="text-forest font-semibold hover:underline">
                our shop
              </Link>{" "}
              with free delivery on orders over Rs. 3,000.
            </p>
            <div className="mt-6 pt-6 border-t border-forest/10">
              <p className="flex items-start gap-3 text-sm text-forest-deep/70 leading-relaxed">
                <MapPin size={16} className="text-forest shrink-0 mt-0.5" />
                We&apos;re in conversation with organic stores and supermarkets
                in Kathmandu and Pokhara about carrying Tropijoy on-shelf —
                this page will list them here as those partnerships go live.
              </p>
            </div>
          </div>
        </Reveal>

        <InquiryForm
          source="stockists-inquiry"
          title="Want to stock Tropijoy?"
          subtitle="Run a retail store, organic mart, or supermarket? Tell us a bit about your shop."
          messageLabel="About your store"
          messagePlaceholder="e.g. Organic grocery in Patan, interested in the full dried fruit range"
        />
      </div>
    </div>
  );
}
