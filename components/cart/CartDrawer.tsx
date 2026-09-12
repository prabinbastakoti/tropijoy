"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore, useCartTotals } from "@/store/cart-store";
import { variantLabel, stockRemaining } from "@/lib/products";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";
import { trackEvent } from "@/lib/analytics";
import Button from "@/components/ui/Button";
import QuantityStepper from "@/components/ui/QuantityStepper";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const { detailed, subtotal, shippingCost, total } = useCartTotals();
  const hydrated = useHydrated();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => closeCart(), [pathname, closeCart]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  function goToCheckout() {
    trackEvent("begin_checkout", {
      item_count: detailed.reduce((sum, { quantity }) => sum + quantity, 0),
      subtotal,
    });
    closeCart();
    router.push("/checkout");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-forest-deep/40 backdrop-blur-sm"
          onClick={closeCart}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-cream flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-forest/10 bg-white">
              <h2 className="font-display font-bold text-xl text-forest-deep flex items-center gap-2">
                <ShoppingBag size={22} className="text-forest" /> Your Cart
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="text-forest/60 hover:text-forest"
              >
                <X size={22} />
              </button>
            </div>

            {!hydrated ? (
              <div className="flex-1 p-6 space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="skeleton h-24 rounded-2xl" />
                ))}
              </div>
            ) : detailed.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mb-4">
                  <ShoppingBag size={32} className="text-forest/40" />
                </div>
                <p className="font-semibold text-forest-deep mb-1">
                  Your cart is empty
                </p>
                <p className="text-sm text-forest-deep/50 mb-6">
                  Add some tropical goodness to get started.
                </p>
                <Button onClick={closeCart}>Continue Shopping</Button>
              </div>
            ) : (
              <>
                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="px-6 py-3 bg-white border-b border-forest/10">
                    <p className="text-xs text-forest-deep/65 mb-1.5">
                      Add{" "}
                      <strong className="text-forest">
                        {formatPrice(remaining)}
                      </strong>{" "}
                      more for free delivery
                    </p>
                    <div className="h-1.5 rounded-full bg-forest/10 overflow-hidden">
                      <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                        className="h-full rounded-full bg-forest"
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  <AnimatePresence initial={false}>
                    {detailed.map(({ product, variant, quantity }) => (
                      <motion.div
                        key={`${product.id}:${variant.id}`}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-3 bg-white rounded-2xl p-3 border border-forest/5"
                      >
                        <Link
                          href={`/shop/${product.slug}`}
                          className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream shrink-0"
                        >
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        </Link>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/shop/${product.slug}`}
                              className="text-sm font-semibold text-forest-deep leading-tight line-clamp-2 hover:text-forest"
                            >
                              {product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(product.id, variant.id)}
                              className="text-forest-deep/30 hover:text-red-500 shrink-0"
                              aria-label={`Remove ${product.name}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="text-xs text-forest-deep/50 mb-2">
                            {variantLabel(variant)}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <QuantityStepper
                              size="sm"
                              quantity={quantity}
                              onIncrement={() => incrementItem(product.id, variant.id)}
                              onDecrement={() => decrementItem(product.id, variant.id)}
                              incrementDisabled={quantity >= stockRemaining(variant)}
                            />
                            <span className="font-bold text-forest-deep text-sm">
                              {formatPrice(variant.price * quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-forest/10 bg-white px-6 py-5 space-y-3">
                  <div className="flex justify-between text-sm text-forest-deep/70">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-forest-deep/70">
                    <span>Delivery</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-forest-deep pt-2 border-t border-forest/10">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <Button fullWidth size="lg" onClick={goToCheckout} className="mt-2">
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
