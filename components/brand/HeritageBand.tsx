import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The Himalayan skyline line-art strip used across every real Tropijoy
 * packaging label. Used as a recurring decorative motif in place of the old
 * `.dotted-grid` texture — replace `<div className="dotted-grid ..." />`
 * usages with this component.
 */
export default function HeritageBand({
  tone = "light",
  className,
  imageClassName,
  heightClassName = "h-20 sm:h-28",
}: {
  tone?: "light" | "dark";
  className?: string;
  /** Overrides the image's own crop/position (e.g. "object-top") for a single usage, without affecting every other place this component appears. */
  imageClassName?: string;
  /** Overrides the band's height for a single usage — a taller band reveals more of the source art's vertical range (the tallest and shortest peaks are ~300px apart in the source). */
  heightClassName?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("absolute inset-x-0 bottom-0 pointer-events-none", className)}
    >
      <div className={cn("relative w-full", heightClassName)}>
        <Image
          src="/brand/mountain.png"
          alt=""
          fill
          className={cn(
            "object-cover object-bottom",
            tone === "dark" ? "opacity-30 invert brightness-[3]" : "opacity-[0.08]",
            imageClassName
          )}
        />
      </div>
    </div>
  );
}
