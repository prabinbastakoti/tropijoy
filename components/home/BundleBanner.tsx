import Image from "next/image";
import { ArrowRight, Gift } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";

const previewImages = [
  "/products/apple.png",
  "/products/orange.png",
  "/products/banana.png",
  "/products/lemon.png",
  "/products/pineapple.png",
  "/products/banana-powder.png",
];

export default function BundleBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-sage px-6 py-12 sm:px-14 sm:py-16 flex flex-col lg:flex-row lg:items-center lg:justify-center gap-8 lg:gap-14">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 mb-5 text-xs font-semibold text-forest-deep">
              <Gift size={14} className="text-forest" />
              Custom Bundles
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep text-balance">
              Build Your Custom Snack Bundle
            </h2>
            <p className="mt-3 text-forest-deep/70 max-w-md mx-auto lg:mx-0 text-balance">
              Pick any 3 or 6 dried fruit pouches and save up to 15%. Perfect
              for healthy daily snacking or gifting.
            </p>
            <div className="mt-7 flex justify-center lg:justify-start">
              <ButtonLink href="/bundles" size="lg">
                Build Your Bundle <ArrowRight size={18} />
              </ButtonLink>
            </div>
          </div>

          <div className="flex -space-x-7 sm:-space-x-12 justify-center shrink-0">
            {previewImages.map((src, i) => (
              <div
                key={src}
                style={{
                  zIndex: previewImages.length - i,
                  transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (4 + i)}deg)`,
                }}
                className="relative w-16 h-20 sm:w-36 sm:h-48 shrink-0 drop-shadow-xl transition-transform hover:-translate-y-1 hover:z-20"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 64px, 144px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
