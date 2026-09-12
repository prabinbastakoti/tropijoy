import { Leaf, Package, Truck, Zap } from "lucide-react";

const claims = [
  {
    icon: Leaf,
    title: "100% Organic & Natural",
    detail: "No added sugar or sulfites",
  },
  {
    icon: Zap,
    title: "Precision Machine-Sliced",
    detail: "Uniform slices for perfect texture",
  },
  {
    icon: Package,
    title: "Resealable Pouches",
    detail: "Stays fresh longer",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    detail: "On all orders in Nepal over Rs. 3,000",
  },
];

export default function TrustBar() {
  return (
    <section className="border-y border-forest/10 bg-forest py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {claims.map((claim) => (
            <div key={claim.title} className="flex flex-col items-center text-center gap-2.5 sm:flex-row sm:text-left sm:gap-3">
              <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                <claim.icon size={19} />
              </span>
              <div>
                <p className="text-sm font-semibold text-cream leading-snug">
                  {claim.title}
                </p>
                <p className="text-xs text-cream/55 leading-snug mt-0.5">
                  {claim.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
