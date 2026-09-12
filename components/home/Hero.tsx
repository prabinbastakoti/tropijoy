"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { getShoppableProducts } from "@/lib/products";

const shoppable = getShoppableProducts();
const avgRating =
  shoppable.reduce((sum, p) => sum + p.rating, 0) / shoppable.length;

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center overflow-hidden bg-sage/40 -mt-[var(--header-h)] pt-[var(--header-h)]">
      {/* soft organic glow, purely decorative */}
      <div
        className="pointer-events-none absolute -top-32 -right-40 h-[26rem] w-[26rem] rounded-full bg-forest/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-32 h-80 w-80 rounded-full bg-sunny/10 blur-3xl"
        aria-hidden
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-12 lg:gap-16">
        {/* left — copy */}
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-forest mb-5"
          >
            100% Natural &middot; Pure Goodness
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display font-extrabold text-4xl sm:text-6xl lg:text-display-md text-forest-deep leading-[1.03] tracking-tight text-balance"
          >
            Pure joy,
            <br />
            in every{" "}
            <span className="relative inline-block text-sunny">
              bite
              <svg
                viewBox="0 0 200 20"
                className="absolute left-0 -bottom-1 sm:-bottom-2 w-full h-3 sm:h-4 text-sunny"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 14C40 4 90 2 100 8C110 14 160 16 198 6"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-base sm:text-lg text-forest-ink/80 max-w-md mx-auto lg:mx-0 leading-relaxed text-balance"
          >
            100% pure, single-ingredient Nepali fruit—precision-sliced and
            small-batch dehydrated with zero added sugar or preservatives.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-9 flex flex-wrap sm:flex-nowrap items-center justify-center lg:justify-start gap-2 sm:gap-3"
          >
            <ButtonLink href="/shop" size="md" className="whitespace-nowrap px-4 sm:px-6">
              Shop All Products <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink
              href="/our-process"
              variant="outline"
              size="md"
              className="whitespace-nowrap px-4 sm:px-6"
            >
              Our Quality &amp; Process
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm"
          >
            <span className="flex items-center gap-1.5 font-semibold text-forest-deep">
              <Star size={15} className="fill-sunny text-sunny" />
              {avgRating.toFixed(1)}
              <span className="font-normal text-forest-ink/60">
                &middot; 2,400+ happy customers
              </span>
            </span>
            <span className="hidden sm:block h-4 w-px bg-forest-ink/20" aria-hidden />
            <span className="text-forest-ink/60">
              Free delivery over Rs. 3,000
            </span>
          </motion.div>
        </div>

        {/* right — product visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-2xl lg:max-w-none aspect-[4/3]"
        >
          {/* soft halo behind the card for depth */}
          <div
            className="absolute -inset-4 sm:-inset-6 rounded-[3rem] bg-gradient-to-br from-forest/25 via-sunny/15 to-transparent blur-2xl -z-10"
            aria-hidden
          />

          <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-window ring-1 ring-white/70">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/products/pineapple.png"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/video/hero.mp4" type="video/mp4" />
            </video>
            {/* subtle vignette for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/25 via-transparent to-transparent" />
            {/* inner highlight ring for a polished, premium edge */}
            <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] ring-1 ring-inset ring-white/20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
