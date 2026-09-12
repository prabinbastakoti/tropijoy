"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Heart,
  Leaf,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { calculateDiscount, cn, formatPrice } from "@/lib/utils";
import {
  FRUIT_ACCENTS,
  getDefaultVariant,
  stockRemaining,
  variantLabel,
} from "@/lib/products";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useHydrated } from "@/lib/use-hydrated";
import { trackEvent } from "@/lib/analytics";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";

const guarantees = [
  { icon: Truck, text: "Free delivery over Rs. 3,000" },
  { icon: RotateCcw, text: "7-day returns on unopened pouches" },
  { icon: ShieldCheck, text: "Nine month shelf life, no preservatives" },
];

export default function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const defaultVariant = getDefaultVariant(product);
  const [style, setStyle] = useState(defaultVariant.style);
  const [weight, setWeight] = useState(defaultVariant.weight);
  const addItem = useCartStore((s) => s.addItem);
  const wishlisted = useWishlistStore((s) => s.productIds.includes(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const hydrated = useHydrated();

  const accent = FRUIT_ACCENTS[product.fruitType];
  const styles = Array.from(
    new Set(product.variants.map((v) => v.style).filter(Boolean))
  ) as string[];
  const weights = Array.from(new Set(product.variants.map((v) => v.weight)));
  const hasStyles = styles.length > 1;
  const hasMultipleSizes = weights.length > 1;

  const variant =
    product.variants.find(
      (v) => v.weight === weight && (!hasStyles || v.style === style)
    ) ??
    product.variants.find((v) => v.weight === weight) ??
    defaultVariant;

  const discount = calculateDiscount(variant.price, variant.originalPrice);
  const maxQty = stockRemaining(variant);

  useEffect(() => {
    setQuantity((q) => Math.max(1, Math.min(q, maxQty)));
  }, [maxQty]);

  function handleAdd() {
    if (!variant.inStock) return;
    addItem(product.id, variant.id, quantity);
    trackEvent("add_to_cart", {
      product_id: product.id,
      product_name: product.name,
      variant_id: variant.id,
      price: variant.price,
      quantity,
      source: "product_detail",
    });
    toast.success(`${quantity} × ${product.name} (${variantLabel(variant)}) added to cart`);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
      {/* gallery */}
      <div>
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-forest/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={product.images[activeImage]}
                alt={`${product.name} — view ${activeImage + 1}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-10"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
            {discount > 0 && <Badge variant="sale">-{discount}% off</Badge>}
            {product.tags.includes("Best Seller") && (
              <Badge variant="sunny">Best Seller</Badge>
            )}
          </div>
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-3 mt-4">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "relative w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white transition-colors",
                  activeImage === i
                    ? "border-forest"
                    : "border-transparent hover:border-forest/30"
                )}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* info */}
      <div>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-forest/55 mb-3">
          <span
            aria-hidden
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: accent.hex }}
          />
          {product.category} &middot; {product.fruitType}
        </p>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-display-sm text-forest-deep leading-tight text-balance">
          {product.name}
        </h1>

        <a href="#reviews" className="inline-block mt-4 hover:opacity-70 transition-opacity">
          <StarRating
            rating={product.rating}
            reviewsCount={product.reviewsCount}
            size={16}
          />
        </a>

        <div className="flex items-baseline gap-3 mt-5">
          <span className="font-display font-extrabold text-3xl text-forest-deep">
            {formatPrice(variant.price)}
          </span>
          {variant.originalPrice && (
            <span className="text-lg text-forest-deep/35 line-through">
              {formatPrice(variant.originalPrice)}
            </span>
          )}
        </div>

        {/* type/weight selector */}
        {hasStyles && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-2">
              Type
            </p>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => {
                const optionVariant =
                  product.variants.find(
                    (v) => v.style === s && v.weight === weight
                  ) ?? product.variants.find((v) => v.style === s);
                return (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    disabled={!optionVariant?.inStock}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                      style === s
                        ? "border-forest bg-forest text-white"
                        : "border-forest/20 text-forest-deep/70 hover:border-forest/50"
                    )}
                  >
                    {s}
                    {!optionVariant?.inStock && " — Sold Out"}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {hasMultipleSizes ? (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-2">
              Size
            </p>
            <div className="flex flex-wrap gap-2">
              {weights.map((w) => {
                const optionVariant =
                  product.variants.find(
                    (v) => v.weight === w && (!hasStyles || v.style === style)
                  ) ?? product.variants.find((v) => v.weight === w);
                return (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    disabled={!optionVariant?.inStock}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                      weight === w
                        ? "border-forest bg-forest text-white"
                        : "border-forest/20 text-forest-deep/70 hover:border-forest/50"
                    )}
                  >
                    {w}
                    {!optionVariant?.inStock && " — Sold Out"}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          !hasStyles && (
            <p className="mt-4 text-sm text-forest-deep/50">{variant.weight} pouch</p>
          )
        )}

        <p className="mt-5 text-forest-deep/70 leading-relaxed">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full bg-forest/6 px-3 py-1.5 text-xs font-semibold text-forest-deep/75"
            >
              <Leaf size={11} className="text-forest" />
              {tag}
            </span>
          ))}
        </div>

        {/* nutrition */}
        <div className="mt-7 rounded-2xl bg-white border border-forest/10 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-3">
            Nutrition highlights
          </p>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {product.nutritionHighlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-forest-deep/75"
              >
                <Check size={15} className="text-forest mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* buy row */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white p-1.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="w-9 h-9 rounded-full flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-bold text-forest-deep tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(q + 1, maxQty))}
              disabled={quantity >= maxQty}
              aria-label="Increase quantity"
              className="w-9 h-9 rounded-full flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-forest"
            >
              <Plus size={16} />
            </button>
          </div>

          <Button
            size="lg"
            onClick={handleAdd}
            disabled={!variant.inStock}
            className="flex-1 min-w-[200px]"
          >
            <ShoppingBag size={18} />
            {variant.inStock
              ? `Add to Cart · ${formatPrice(variant.price * quantity)}`
              : "Out of Stock"}
          </Button>

          <button
            onClick={() => {
              toggleWishlist(product.id);
              toast(wishlisted ? "Removed from wishlist" : "Saved to wishlist", {
                icon: "❤️",
              });
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            className={cn(
              "w-[52px] h-[52px] rounded-full border flex items-center justify-center transition-colors shrink-0",
              hydrated && wishlisted
                ? "bg-red-50 border-red-200"
                : "bg-white border-forest/15 hover:border-forest/40"
            )}
          >
            <Heart
              size={20}
              className={
                hydrated && wishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-forest"
              }
            />
          </button>
        </div>

        {!variant.inStock ? (
          <p className="mt-3 text-sm text-forest-deep/55">
            This option sold out — we restock seasonally. Check back after the
            next harvest.
          </p>
        ) : (
          maxQty <= 5 && (
            <p className="mt-3 text-sm font-semibold text-sunny-dark">
              Low Stock
            </p>
          )
        )}

        <ul className="mt-7 space-y-2.5 border-t border-forest/10 pt-6">
          {guarantees.map((g) => (
            <li
              key={g.text}
              className="flex items-center gap-3 text-sm text-forest-deep/65"
            >
              <g.icon size={16} className="text-forest shrink-0" />
              {g.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
