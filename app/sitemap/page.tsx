import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Every page on the Tropijoy site, organized by category.",
};

const groups = [
  {
    title: "Shop",
    links: [
      { label: "Shop All Products", href: "/shop" },
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "Custom Bundles", href: "/bundles" },
      { label: "Gift Cards", href: "/gift-cards" },
      { label: "Gifting & Bulk Orders", href: "/gifting" },
      { label: "Corporate Gifting", href: "/corporate-gifting" },
      { label: "Wholesale Orders", href: "/wholesale" },
      { label: "Stockists", href: "/stockists" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Our Quality & Process", href: "/our-process" },
      { label: "Quality & Safety Standards", href: "/quality-and-safety" },
      { label: "Blog", href: "/blog" },
      { label: "Recipes & Uses", href: "/recipes" },
      { label: "Storage & Shelf Life Guide", href: "/storage-guide" },
      { label: "Reviews", href: "/reviews" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press & Media", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Your Account",
    links: [
      { label: "Wishlist", href: "/wishlist" },
      { label: "Order History", href: "/orders" },
      { label: "Track Your Order", href: "/track-order" },
      { label: "Checkout", href: "/checkout" },
      { label: "Refer a Friend", href: "/refer" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Returns & Refund Guarantee", href: "/returns-policy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sitemap" }]} />

      <SectionHeading
        eyebrow="Every page"
        as="h1"
        title="Sitemap"
        description="The whole site, organized by category."
        className="my-10"
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {groups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.06}>
            <div className="h-full rounded-3xl bg-white border border-forest/10 p-6 sm:p-7">
              <h2 className="font-display font-bold text-lg text-forest-deep mb-4">
                {group.title}
              </h2>
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-medium text-forest-deep/70 hover:bg-forest/6 hover:text-forest transition-colors"
                    >
                      {link.label}
                      <ArrowRight
                        size={14}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
