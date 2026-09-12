"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import {
  FRUIT_ACCENTS,
  bestDiscount,
  getDefaultVariant,
  isProductInStock,
  priceFrom,
  stockRemaining,
} from "@/lib/products";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useHydrated } from "@/lib/use-hydrated";
import { trackEvent } from "@/lib/analytics";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const wishlisted = useWishlistStore((s) => s.productIds.includes(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const hydrated = useHydrated();

  const inStock = isProductInStock(product);
  const discount = bestDiscount(product);
  const defaultVariant = getDefaultVariant(product);
  const lowStock = inStock && stockRemaining(defaultVariant) <= 5;
  const accent = FRUIT_ACCENTS[product.fruitType];
  const hasMultipleSizes = product.variants.length > 1;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem(product.id, defaultVariant.id);
    trackEvent("add_to_cart", {
      product_id: product.id,
      product_name: product.name,
      variant_id: defaultVariant.id,
      price: defaultVariant.price,
      source: "product_card",
    });
    toast.success(`${product.name} added to cart`);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(wishlisted ? "Removed from wishlist" : "Saved to wishlist", {
      icon: "❤️",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.24) }}
      whileHover={{ y: -6 }}
      className="group relative h-full"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="flex h-full flex-col rounded-3xl bg-white border border-forest/10 overflow-hidden hover:shadow-lift transition-shadow"
      >
        <div className="relative aspect-square overflow-hidden bg-cream">
          {!imgLoaded && <div className="absolute inset-0 skeleton" />}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            onLoad={() => setImgLoaded(true)}
            className={cn(
              "object-contain p-6 transition-transform duration-500 group-hover:scale-105",
              !imgLoaded && "opacity-0"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
            {product.tags.includes("Best Seller") && (
              <Badge variant="sunny">Best Seller</Badge>
            )}
            {!inStock && <Badge variant="outline">Sold Out</Badge>}
            {lowStock && <Badge variant="warning">Low Stock</Badge>}
          </div>

          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart
              size={16}
              className={
                hydrated && wishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-forest-deep/60"
              }
            />
          </button>

          <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:block">
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-full backdrop-blur text-sm font-semibold py-2.5 transition-colors",
                inStock
                  ? "bg-forest/95 text-white hover:bg-forest-light"
                  : "bg-white/95 text-forest-deep/50 cursor-not-allowed"
              )}
            >
              <ShoppingBag size={15} />
              {inStock ? "Quick Add" : "Sold Out"}
            </button>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest/50 uppercase tracking-wide mb-1">
            <span
              aria-hidden
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: accent.hex }}
            />
            {product.category} &middot;{" "}
            {hasMultipleSizes ? `${product.variants.length} sizes` : defaultVariant.weight}
          </p>
          <h3 className="font-semibold text-forest-deep leading-snug mb-1.5 line-clamp-2 group-hover:text-forest transition-colors">
            {product.name}
          </h3>
          <StarRating
            rating={product.rating}
            reviewsCount={product.reviewsCount}
            className="mb-3"
          />

          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 min-w-0">
              {hasMultipleSizes && (
                <span className="text-[11px] text-forest-deep/45">From</span>
              )}
              <span className="font-bold text-forest-deep">
                {formatPrice(priceFrom(product))}
              </span>
            </div>
            <button
              onClick={handleAdd}
              disabled={!inStock}
              aria-label={`Add ${product.name} to cart`}
              className={cn(
                "sm:hidden shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                inStock
                  ? "bg-forest text-white"
                  : "bg-forest/10 text-forest-deep/30 cursor-not-allowed"
              )}
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
