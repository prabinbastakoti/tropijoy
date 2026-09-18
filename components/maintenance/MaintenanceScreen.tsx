"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Mail, Wrench } from "lucide-react";
import Countdown from "@/components/maintenance/Countdown";
import { LAUNCH_AT } from "@/lib/maintenance";
import { cn } from "@/lib/utils";

/** Decorative pouches flanking the content on extra-wide screens. */
const flankPouches = [
  { src: "/products/orange.png", className: "left-[3%] top-[16%] w-40 xl:w-48 -rotate-[9deg]", float: "animate-float" },
  { src: "/products/apple.png", className: "left-[6%] bottom-[9%] w-32 xl:w-40 rotate-[7deg]", float: "animate-float-slow" },
  { src: "/products/pineapple.png", className: "right-[3%] top-[20%] w-40 xl:w-48 rotate-[9deg]", float: "animate-float-slow" },
  { src: "/products/lemon.png", className: "right-[6%] bottom-[9%] w-32 xl:w-40 -rotate-[7deg]", float: "animate-float" },
];

/** Smaller fan shown under the content on tall, narrower screens. */
const fanPouches = [
  { src: "/products/orange.png", className: "-rotate-[10deg] translate-y-3" },
  { src: "/products/pineapple.png", className: "z-10 scale-110" },
  { src: "/products/apple.png", className: "rotate-[10deg] translate-y-3" },
];

const contactLink =
  "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: "easeOut" as const },
});

/**
 * Sized to fit one viewport with no scrolling: type, gaps and countdown tiles
 * scale with viewport height (`vh`) as well as width. The outer container only
 * scrolls — with the scrollbar hidden — on absurdly small windows, so nothing
 * is ever unreachable.
 */
export default function MaintenanceScreen() {
  return (
    <div className="noise fixed inset-0 isolate flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar bg-forest-deep text-cream bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#1A7D3E_0%,#116530_38%,#09381A_78%)]">
      {/* Decoration lives in its own clipped layer: glows and pouches that bleed
          past the edges must not add to the container's scrollable area. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-[30rem] w-[30rem] rounded-full bg-accent-lemon/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-accent-orange/20 blur-3xl" />

        {/* Not <HeritageBand>: mountain.png has ~8.5% transparent padding under
            the art (rows 454-496 of 496), which left a gap above the page edge.
            Pushing the image down by that share of its own height sits the art
            flush on the bottom at any width. */}
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-40 overflow-hidden opacity-70">
          <Image
            src="/brand/mountain.png"
            alt=""
            width={2139}
            height={496}
            className="absolute bottom-0 left-0 h-auto w-full translate-y-[8.5%] opacity-30 invert brightness-[3]"
          />
        </div>

        {/* flanking pouches (extra-wide screens only) */}
        {flankPouches.map((p) => (
          <div key={p.src} className={cn("absolute hidden xl:block", p.className)}>
            <div className={p.float}>
              <Image
                src={p.src}
                alt=""
                width={448}
                height={598}
                sizes="192px"
                className="h-auto w-full drop-shadow-[0_30px_35px_rgba(0,0,0,0.4)]"
              />
            </div>
          </div>
        ))}
      </div>

      <header className="relative z-10 flex shrink-0 items-start justify-end px-4 pt-4 sm:px-8 sm:pt-6">
        <motion.nav
          {...fadeUp(0.1)}
          aria-label="Contact"
          className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3"
        >
          <a href="mailto:contact@tropijoynp.com" className={contactLink}>
            <Mail size={15} aria-hidden /> contact@tropijoynp.com
          </a>
          <a
            href="https://instagram.com/tropijoynp"
            target="_blank"
            rel="noopener noreferrer"
            className={contactLink}
          >
            <Instagram size={15} aria-hidden /> @tropijoynp
          </a>
        </motion.nav>
      </header>

      <main className="relative flex flex-1 flex-col items-center justify-center gap-[clamp(0.9rem,2.8vh,2rem)] px-5 pb-6 pt-2 text-center sm:px-8">
        <motion.div {...fadeUp(0)}>
          {/* Offset via `top` (not margin) so only the logo lifts; the content
              below keeps its spacing. Separate from the motion wrapper because
              framer-motion owns that element's transform. */}
          <div className="relative -top-[clamp(0.5rem,2.5vh,1.5rem)] [@media(max-height:480px)]:top-0">
            <Image
              src="/brand/logo-white.png"
              alt="Tropijoy"
              width={2336}
              height={824}
              sizes="360px"
              priority
              className="h-[clamp(3.5rem,min(11vh,30vw),7rem)] w-auto object-contain"
            />
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.08)}
          className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-lemon opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-lemon" />
          </span>
          <Wrench size={14} className="text-accent-lemon" aria-hidden />
          <span className="whitespace-nowrap text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-cream/90">
            Website under maintenance
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.16)}
          className="max-w-3xl font-display font-extrabold leading-[1.05] tracking-tight text-white text-balance [font-size:clamp(2rem,min(7.2vw,8vh),4.25rem)]"
        >
          We&apos;re making things{" "}
          <span className="relative inline-block text-accent-lemon">
            even fresher
            <svg
              viewBox="0 0 200 20"
              className="absolute left-0 -bottom-1 sm:-bottom-2 h-3 sm:h-4 w-full"
              fill="none"
              aria-hidden
              preserveAspectRatio="none"
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
          {...fadeUp(0.24)}
          className="max-w-xl leading-relaxed text-cream/75 text-balance [font-size:clamp(0.875rem,2.1vh,1.125rem)] [@media(max-height:600px)]:hidden"
        >
          Our website is taking a short break for some behind-the-scenes
          upgrades. Thank you for your patience — we&apos;ll be back with the
          same 100% natural Nepali fruit you love.
        </motion.p>

        <motion.div {...fadeUp(0.32)} className="w-full max-w-[42rem]">
          <p className="mb-[clamp(0.5rem,1.6vh,1rem)] text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cream/60">
            Reopening in
          </p>
          <Countdown target={LAUNCH_AT} />
        </motion.div>

        {/* pouch fan: only where there is spare height and no room to flank */}
        <div aria-hidden className="xl:hidden">
          <div className="hidden items-end justify-center pt-4 [@media(min-height:900px)]:flex">
            {fanPouches.map((p) => (
              <Image
                key={p.src}
                src={p.src}
                alt=""
                width={448}
                height={598}
                sizes="120px"
                className={cn(
                  "relative -mx-3 h-auto w-24 sm:w-32 drop-shadow-[0_20px_25px_rgba(0,0,0,0.4)]",
                  p.className
                )}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
