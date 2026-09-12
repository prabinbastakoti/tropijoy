"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accessibility,
  Archive,
  ArrowRight,
  Briefcase,
  Cookie,
  FileText,
  Gift,
  HelpCircle,
  Leaf,
  Mail,
  Newspaper,
  Package,
  PackageCheck,
  PackageSearch,
  ShieldCheck,
  Shield,
  Sprout,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { getShoppableProducts, getBundles, priceFrom } from "@/lib/products";
import { posts } from "@/lib/blog";
import { formatDate, formatPrice } from "@/lib/utils";

export type MegaId = "shop" | "blog" | "about" | "support";

const slicedFruits = getShoppableProducts().filter(
  (p) => p.category === "Dehydrated Fruit"
);
const powders = getShoppableProducts().filter(
  (p) => p.category === "Fruit Powder"
);
const bundles = getBundles();

type LinkItem = {
  label: string;
  href: string;
  icon?: typeof HelpCircle;
  description?: string;
};

const exploreLinkClass =
  "flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-forest-deep/70 hover:bg-forest/6 hover:text-forest transition-colors";

const iconLinkClass =
  "group flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-forest/6 transition-colors";

function IconLink({ label, href, icon: Icon, description }: LinkItem) {
  return (
    <li>
      <Link href={href} className={iconLinkClass}>
        {Icon && (
          <span className="w-8 h-8 rounded-lg bg-forest/8 flex items-center justify-center shrink-0 text-forest group-hover:bg-forest group-hover:text-white transition-colors">
            <Icon size={15} />
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-forest-deep group-hover:text-forest">
            {label}
          </span>
          {description && (
            <span className="block text-xs text-forest-deep/45 mt-0.5">
              {description}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}

const companyColumns: { heading: string; links: LinkItem[] }[] = [
  {
    heading: "Our Story",
    links: [
      { label: "Our Quality & Process", href: "/our-process", icon: Sprout, description: "From market fruit to pouch" },
      { label: "About Us", href: "/about", icon: Users, description: "Why we started" },
      { label: "Sustainability", href: "/sustainability", icon: Leaf, description: "Packaging & waste, honestly" },
    ],
  },
  {
    heading: "Work With Us",
    links: [
      { label: "Careers", href: "/careers", icon: Briefcase, description: "Join a small team" },
      { label: "Press & Media", href: "/press", icon: Newspaper, description: "Brand assets & contact" },
    ],
  },
];

const supportColumns: { heading: string; links: LinkItem[] }[] = [
  {
    heading: "Help",
    links: [
      { label: "FAQ", href: "/faq", icon: HelpCircle },
      { label: "Quality & Safety", href: "/quality-and-safety", icon: ShieldCheck },
      { label: "Shipping Policy", href: "/shipping-policy", icon: Truck },
      { label: "Returns & Refunds", href: "/returns-policy", icon: PackageSearch },
      { label: "Storage Guide", href: "/storage-guide", icon: Archive },
      { label: "Track Your Order", href: "/track-order", icon: PackageCheck },
      { label: "Contact Us", href: "/contact", icon: Mail },
    ],
  },
  {
    heading: "For Business",
    links: [
      { label: "Wholesale Orders", href: "/wholesale", icon: Store },
      { label: "Stockists", href: "/stockists", icon: Package },
      { label: "Corporate Gifting", href: "/corporate-gifting", icon: Gift },
      { label: "Refer a Friend", href: "/refer", icon: Gift },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy", icon: Shield },
      { label: "Terms & Conditions", href: "/terms", icon: FileText },
      { label: "Cookie Policy", href: "/cookies", icon: Cookie },
      { label: "Accessibility", href: "/accessibility", icon: Accessibility },
    ],
  },
];

const latestPosts = posts.slice(0, 3);

/**
 * Rendered via a portal straight to document.body — NOT nested inside the
 * header/nav tree — so it can never get trapped behind page content that
 * has its own Framer Motion transform/opacity (which creates a local CSS
 * stacking context; a fixed-position descendant of one of those can end up
 * painting below unrelated root-level content despite a high z-index).
 */
export default function MegaMenu({
  activeMega,
  onMouseEnter,
  onMouseLeave,
}: {
  activeMega: MegaId | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {activeMega && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="fixed inset-x-0 top-[var(--header-h)] z-[45] border-b border-forest/10 bg-cream shadow-window"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeMega === "shop" && (
              <div className="grid lg:grid-cols-[1fr_1fr_1fr_220px] gap-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-forest-deep/40 mb-4">
                    Sliced Fruits
                  </p>
                  <div className="space-y-1">
                    {slicedFruits.map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        className="group flex items-center gap-3 rounded-xl p-2 hover:bg-forest/5 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-lg bg-white shrink-0 overflow-hidden border border-forest/8">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-forest-deep truncate group-hover:text-forest">
                            {product.name}
                          </p>
                          <p className="text-xs text-forest-deep/50">
                            From {formatPrice(priceFrom(product))}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-forest-deep/40 mb-4">
                    Superfood Powders
                  </p>
                  <div className="space-y-1">
                    {powders.map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        className="group flex items-center gap-3 rounded-xl p-2 hover:bg-forest/5 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-lg bg-white shrink-0 overflow-hidden border border-forest/8">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-forest-deep truncate group-hover:text-forest">
                            {product.name}
                          </p>
                          <p className="text-xs text-forest-deep/50">
                            From {formatPrice(priceFrom(product))}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-forest-deep/40 mb-4">
                    Custom Bundles
                  </p>
                  <div className="space-y-1">
                    {bundles.map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        className="group flex items-center gap-3 rounded-xl p-2 hover:bg-forest/5 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-lg bg-white shrink-0 overflow-hidden border border-forest/8">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-forest-deep truncate group-hover:text-forest">
                            {product.name}
                          </p>
                          <p className="text-xs text-forest-deep/50">
                            {formatPrice(priceFrom(product))}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href="/bundles"
                      className="flex items-center justify-between gap-2 rounded-xl px-2 py-2.5 text-sm font-semibold text-forest hover:bg-forest/5 transition-colors"
                    >
                      Build Your Bundle <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                <div className="border-l border-forest/10 pl-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-forest-deep/40 mb-4">
                    Explore
                  </p>
                  <ul className="space-y-1">
                    <li>
                      <Link href="/shop" className={exploreLinkClass}>
                        All Products <ArrowRight size={14} />
                      </Link>
                    </li>
                    <li>
                      <Link href="/best-sellers" className={exploreLinkClass}>
                        Best Sellers <ArrowRight size={14} />
                      </Link>
                    </li>
                    <li>
                      <Link href="/gift-cards" className={exploreLinkClass}>
                        Gift Cards <ArrowRight size={14} />
                      </Link>
                    </li>
                    <li>
                      <Link href="/gifting" className={exploreLinkClass}>
                        Gifting &amp; Bulk Orders <ArrowRight size={14} />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeMega === "blog" && (
              <div className="grid lg:grid-cols-[1fr_240px] gap-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-forest-deep/40 mb-4">
                    Latest Articles
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {latestPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group block rounded-2xl p-3 hover:bg-forest/5 transition-colors"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-wide text-forest/50 mb-1.5">
                          {post.category}
                        </p>
                        <p className="text-sm font-semibold text-forest-deep leading-snug group-hover:text-forest line-clamp-2">
                          {post.title}
                        </p>
                        <p className="text-xs text-forest-deep/40 mt-2">
                          {formatDate(post.date)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="border-l border-forest/10 pl-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-forest-deep/40 mb-4">
                    Explore
                  </p>
                  <ul className="space-y-1">
                    <li>
                      <Link href="/blog" className={exploreLinkClass}>
                        All Articles <ArrowRight size={14} />
                      </Link>
                    </li>
                    <li>
                      <Link href="/recipes" className={exploreLinkClass}>
                        Recipes &amp; Uses <ArrowRight size={14} />
                      </Link>
                    </li>
                    <li>
                      <Link href="/reviews" className={exploreLinkClass}>
                        Reviews <ArrowRight size={14} />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeMega === "about" && (
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8 max-w-2xl">
                {companyColumns.map((col) => (
                  <div key={col.heading}>
                    <p className="text-xs font-bold uppercase tracking-wider text-forest-deep/40 mb-2 px-3">
                      {col.heading}
                    </p>
                    <ul>
                      {col.links.map((link) => (
                        <IconLink key={link.href} {...link} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeMega === "support" && (
              <div className="grid sm:grid-cols-3 gap-x-10 gap-y-8">
                {supportColumns.map((col) => (
                  <div key={col.heading}>
                    <p className="text-xs font-bold uppercase tracking-wider text-forest-deep/40 mb-2 px-3">
                      {col.heading}
                    </p>
                    <ul>
                      {col.links.map((link) => (
                        <IconLink key={link.href} {...link} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
