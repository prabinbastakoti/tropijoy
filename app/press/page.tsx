import type { Metadata } from "next";
import Image from "next/image";
import { Download, Mail } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { BUSINESS } from "@/lib/legal";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Press & Media",
  description:
    "Brand assets and media contact for journalists and partners writing about Tropijoy.",
};

const logoDownloads = [
  { label: "Logo — Forest Green", src: "/brand/logo-green.png" },
];

const facts = [
  { label: "Founded", value: "2026" },
  { label: "Based in", value: BUSINESS.location },
  { label: "Products", value: `${products.length} — dried fruit slices & banana powder` },
  { label: "Sourcing", value: "Premium fruit from trusted Nepali markets" },
];

export default function PressPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Press & Media" }]} />

      <SectionHeading
        eyebrow="Press"
        as="h1"
        title="Press & Media"
        description="Brand assets and a direct line to us — no PR agency in between."
        className="my-10"
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div>
          <Reveal>
            <div className="rounded-3xl bg-white border border-forest/10 p-7 mb-6">
              <h2 className="font-display font-bold text-lg text-forest-deep mb-4">
                Quick facts
              </h2>
              <dl className="grid sm:grid-cols-2 gap-5">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-1">
                      {fact.label}
                    </dt>
                    <dd className="text-sm text-forest-deep/75">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-3xl bg-white border border-forest/10 p-7">
              <h2 className="font-display font-bold text-lg text-forest-deep mb-4">
                Logo &amp; brand assets
              </h2>
              <p className="text-sm text-forest-deep/60 mb-5">
                Please use these as provided — don&apos;t recolour, stretch or
                add effects to the wordmark.
              </p>
              <div className="grid gap-3">
                {logoDownloads.map((asset) => (
                  <a
                    key={asset.src}
                    href={asset.src}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-forest/10 p-4 hover:border-forest/30 hover:bg-forest/5 transition-colors"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="relative w-16 h-8 shrink-0 rounded-lg bg-cream overflow-hidden">
                        <Image
                          src={asset.src}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-contain p-1.5"
                        />
                      </span>
                      <span className="text-sm font-medium text-forest-deep truncate">
                        {asset.label}
                      </span>
                    </span>
                    <Download
                      size={16}
                      className="text-forest-deep/40 shrink-0 group-hover:text-forest transition-colors"
                    />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="rounded-3xl bg-forest text-cream p-8 sticky top-28">
            <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
              <Mail size={20} className="text-white" />
            </span>
            <h2 className="font-display font-bold text-xl mb-3">Media contact</h2>
            <p className="text-cream/70 leading-relaxed mb-5">
              For interviews, quotes, or anything else — email us directly.
              We&apos;re a small team so it really does reach a real person.
            </p>
            <a
              href={`mailto:${BUSINESS.email}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline"
            >
              {BUSINESS.email}
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
