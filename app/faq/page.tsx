import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { faqCategories } from "@/lib/blog";
import Accordion from "@/components/ui/Accordion";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import PoliciesSidebar from "@/components/legal/PoliciesSidebar";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers on ordering, payment, delivery across Nepal, ingredients, storage and returns.",
};

export default function FaqPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />

      <SectionHeading
        eyebrow="Help centre"
        as="h1"
        title="Frequently asked questions"
        description="Ordering, delivery, ingredients and returns — all in one place."
        className="my-10"
      />

      <div className="grid lg:grid-cols-[1fr_220px] gap-10">
        <div>
          <div className="space-y-6">
            {faqCategories.map((group, i) => (
              <Reveal key={group.category} delay={i * 0.06}>
                <section className="rounded-3xl bg-white border border-forest/10 p-6 sm:p-8">
                  <h2 className="font-display font-bold text-xl text-forest-deep mb-2">
                    {group.category}
                  </h2>
                  <Accordion items={group.items} />
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <Link
              href="/contact"
              className="group mt-8 flex items-center justify-between gap-4 rounded-3xl bg-forest p-7 text-cream hover:bg-forest-light transition-colors"
            >
              <span>
                <span className="block font-display font-bold text-lg">
                  Still stuck?
                </span>
                <span className="block text-sm text-cream/65 mt-1">
                  Message us on WhatsApp, email or Instagram — we answer everything.
                </span>
              </span>
              <ArrowRight
                size={22}
                className="text-white shrink-0 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <PoliciesSidebar currentHref="/faq" />
      </div>
    </div>
  );
}
