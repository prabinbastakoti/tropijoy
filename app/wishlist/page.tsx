"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { useHydrated } from "@/lib/use-hydrated";
import { getProductById } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => s.productIds);
  const hydrated = useHydrated();

  const saved = productIds.flatMap((id) => {
    const product = getProductById(id);
    return product ? [product] : [];
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />

      <div className="mt-6 mb-10">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep">
          Your Wishlist
        </h1>
        <p className="mt-2 text-forest-deep/60 text-sm">
          {hydrated && saved.length > 0
            ? `${saved.length} product${saved.length !== 1 ? "s" : ""} saved in this browser.`
            : "Tap the heart on any product to save it here."}
        </p>
      </div>

      {!hydrated ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <div className="rounded-3xl bg-white border border-forest/10">
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            description="Hit the heart icon on a product and it'll appear here so you can find it again."
            actionLabel="Browse the shop"
            actionHref="/shop"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {saved.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
