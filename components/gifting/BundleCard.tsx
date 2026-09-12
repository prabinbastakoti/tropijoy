"use client";

import Image from "next/image";
import { Gift, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { getProductById, getVariant } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import Button from "@/components/ui/Button";

export interface BundleLine {
  productId: string;
  variantId: string;
}

export default function BundleCard({
  title,
  description,
  lines,
}: {
  title: string;
  description: string;
  lines: BundleLine[];
}) {
  const addItem = useCartStore((s) => s.addItem);

  const resolved = lines.flatMap(({ productId, variantId }) => {
    const product = getProductById(productId);
    if (!product) return [];
    return [{ product, variant: getVariant(product, variantId) }];
  });

  const total = resolved.reduce((sum, { variant }) => sum + variant.price, 0);

  function handleAddBundle() {
    resolved.forEach(({ product, variant }) => addItem(product.id, variant.id, 1));
    toast.success(`${title} added to cart`);
  }

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white border border-forest/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-9 h-9 rounded-xl bg-forest/8 flex items-center justify-center text-forest shrink-0">
          <Gift size={18} />
        </span>
        <h3 className="font-display font-bold text-lg text-forest-deep">{title}</h3>
      </div>
      <p className="text-sm text-forest-deep/60 leading-relaxed mb-5">{description}</p>

      <div className="flex -space-x-3 mb-5">
        {resolved.map(({ product, variant }) => (
          <div
            key={`${product.id}:${variant.id}`}
            className="relative w-14 h-14 rounded-full border-2 border-white bg-cream overflow-hidden shrink-0"
            title={`${product.name} — ${variant.weight}`}
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="56px"
              className="object-contain p-1.5"
            />
          </div>
        ))}
      </div>

      <ul className="text-sm text-forest-deep/70 space-y-1 mb-5">
        {resolved.map(({ product, variant }) => (
          <li key={`${product.id}:${variant.id}`}>
            {product.name} <span className="text-forest-deep/40">({variant.weight})</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-forest/10">
        <span className="font-bold text-forest-deep">{formatPrice(total)}</span>
        <Button onClick={handleAddBundle} size="sm">
          <ShoppingBag size={15} /> Add Bundle
        </Button>
      </div>
    </div>
  );
}
