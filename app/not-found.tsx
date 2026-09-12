import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import HeritageBand from "@/components/brand/HeritageBand";

const suggestions = [
  { label: "Shop all products", href: "/shop" },
  { label: "Best sellers", href: "/best-sellers" },
  { label: "Our Quality & Process", href: "/our-process" },
  { label: "The journal", href: "/blog" },
  { label: "Contact us", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      <HeritageBand imageClassName="object-top" heightClassName="h-40 sm:h-56" />
      <div className="relative text-center max-w-lg">
        <div className="w-20 h-20 rounded-3xl bg-white border border-forest/10 flex items-center justify-center mx-auto mb-7">
          <Compass size={32} className="text-forest" />
        </div>

        <p className="font-display font-extrabold text-display-md sm:text-display-lg text-accent-apple leading-none">
          404
        </p>
        <h1 className="mt-4 font-display font-extrabold text-2xl sm:text-3xl text-forest-deep text-balance">
          This page went out of season
        </h1>
        <p className="mt-3 text-forest-deep/60 leading-relaxed text-balance">
          We couldn&apos;t find what you were looking for. It may have moved, or
          the link might be slightly off.
        </p>

        <div className="mt-8">
          <ButtonLink href="/" size="lg">
            Back to home <ArrowRight size={18} />
          </ButtonLink>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {suggestions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full bg-white border border-forest/10 px-4 py-2 text-sm font-medium text-forest-deep/70 hover:text-forest hover:border-forest/30 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
