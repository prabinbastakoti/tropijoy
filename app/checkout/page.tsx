"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore, useCartTotals } from "@/store/cart-store";
import { useOrdersStore } from "@/store/orders-store";
import { variantLabel } from "@/lib/products";
import { useHydrated } from "@/lib/use-hydrated";
import { cn, formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { submitOrder } from "@/app/actions/checkout";
import type { ContactPlatform, ShippingDetails } from "@/lib/types";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";

const steps = ["Delivery", "Contact", "Review"];

const contactPlatforms: {
  id: ContactPlatform;
  icon: typeof Mail;
  placeholder: string;
  label: string;
}[] = [
  {
    id: "WhatsApp",
    icon: MessageCircle,
    placeholder: "+977 98XXXXXXXX",
    label: "WhatsApp number",
  },
  {
    id: "Email",
    icon: Mail,
    placeholder: "you@email.com",
    label: "email address",
  },
  {
    id: "Instagram",
    icon: Instagram,
    placeholder: "@yourhandle",
    label: "Instagram handle",
  },
  {
    id: "Telegram",
    icon: Send,
    placeholder: "@yourhandle",
    label: "Telegram handle",
  },
  {
    id: "Phone Call/SMS",
    icon: Phone,
    placeholder: "+977 98XXXXXXXX",
    label: "phone number",
  },
];

const emptyShipping: ShippingDetails = {
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { detailed, subtotal, shippingCost, total } = useCartTotals();
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrdersStore((s) => s.addOrder);

  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingDetails>(emptyShipping);
  const [platform, setPlatform] = useState<ContactPlatform | null>(null);
  const [handle, setHandle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedPlatform = contactPlatforms.find((p) => p.id === platform);

  const shippingValid =
    shipping.fullName.trim() !== "" &&
    shipping.address.trim() !== "" &&
    shipping.city.trim() !== "" &&
    shipping.postalCode.trim() !== "";

  const contactValid = platform !== null && handle.trim() !== "";

  async function handleConfirm() {
    if (!platform || !handle.trim()) return;
    setSubmitting(true);
    try {
      const result = await submitOrder({
        shipping,
        contactPlatform: platform,
        contactHandle: handle,
        items: detailed.map(({ product, variant, quantity }) => ({
          name: product.name,
          quantity,
          price: variant.price,
          weight: variantLabel(variant),
        })),
        subtotal,
        shipping_cost: shippingCost,
        total,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      const orderId = addOrder({
        items: detailed.map(({ product, variant, quantity }) => ({
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          weight: variantLabel(variant),
          price: variant.price,
          quantity,
          image: product.images[0],
        })),
        shipping,
        contactPlatform: platform,
        contactHandle: handle,
        subtotal,
        shippingCost,
        total,
        demoMode: result.demoMode,
      });

      trackEvent("purchase", {
        order_id: orderId,
        item_count: detailed.reduce((sum, { quantity }) => sum + quantity, 0),
        subtotal,
        shipping_cost: shippingCost,
        total,
        contact_platform: platform,
      });
      clearCart();
      toast.success(result.message);
      router.push(`/orders/${orderId}?new=1`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="skeleton h-96 rounded-3xl" />
      </div>
    );
  }

  if (detailed.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Checkout" }]}
        />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep mt-6">
          Checkout
        </h1>
        <div className="mt-8 rounded-3xl bg-white border border-forest/10">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add a few pouches and come back — checkout needs at least one item."
            actionLabel="Browse the shop"
            actionHref="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Checkout" }]}
      />

      <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep mt-6 mb-10">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div>
          {/* step indicator */}
          <div className="flex items-center gap-2 mb-9">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                      i <= step
                        ? "bg-forest text-white"
                        : "bg-forest/10 text-forest/40"
                    )}
                  >
                    {i < step ? <Check size={14} /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold hidden sm:block",
                      i <= step ? "text-forest-deep" : "text-forest-deep/35"
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 rounded",
                      i < step ? "bg-forest" : "bg-forest/10"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white border border-forest/10 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-4"
                >
                  <p className="flex items-center gap-2 text-sm text-forest-deep/60 mb-5">
                    <MapPin size={16} className="text-forest" />
                    Where should we deliver your order?
                  </p>

                  <div>
                    <label
                      htmlFor="fullName"
                      className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
                    >
                      Full name
                    </label>
                    <input
                      id="fullName"
                      value={shipping.fullName}
                      onChange={(e) =>
                        setShipping({ ...shipping, fullName: e.target.value })
                      }
                      placeholder="Aayush Shrestha"
                      className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
                    >
                      Address
                    </label>
                    <input
                      id="address"
                      value={shipping.address}
                      onChange={(e) =>
                        setShipping({ ...shipping, address: e.target.value })
                      }
                      placeholder="Ward 4, Jhamsikhel Marg"
                      className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
                      >
                        City
                      </label>
                      <input
                        id="city"
                        value={shipping.city}
                        onChange={(e) =>
                          setShipping({ ...shipping, city: e.target.value })
                        }
                        placeholder="Lalitpur"
                        className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="postalCode"
                        className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
                      >
                        Postal code
                      </label>
                      <input
                        id="postalCode"
                        value={shipping.postalCode}
                        onChange={(e) =>
                          setShipping({ ...shipping, postalCode: e.target.value })
                        }
                        placeholder="44700"
                        className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-5"
                >
                  <div>
                    <p className="font-semibold text-forest-deep mb-1">
                      How should we reach you?
                    </p>
                    <p className="text-sm text-forest-deep/55">
                      We&apos;ll confirm your order and arrange payment on this
                      channel — nothing sensitive goes through the website.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {contactPlatforms.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPlatform(p.id);
                          setHandle("");
                        }}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-2xl border-2 py-4 px-2 transition-colors",
                          platform === p.id
                            ? "border-forest bg-forest/5"
                            : "border-forest/10 hover:border-forest/30"
                        )}
                      >
                        <p.icon
                          size={22}
                          className={
                            platform === p.id
                              ? "text-forest"
                              : "text-forest-deep/45"
                          }
                        />
                        <span className="text-xs font-semibold text-forest-deep text-center leading-tight">
                          {p.id}
                        </span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {selectedPlatform && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <label
                          htmlFor="handle"
                          className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
                        >
                          Enter your {selectedPlatform.label}
                        </label>
                        <input
                          id="handle"
                          value={handle}
                          onChange={(e) => setHandle(e.target.value)}
                          placeholder={selectedPlatform.placeholder}
                          className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-2">
                      Delivering to
                    </p>
                    <p className="text-sm text-forest-deep leading-relaxed">
                      {shipping.fullName}
                      <br />
                      {shipping.address}, {shipping.city} {shipping.postalCode}
                    </p>
                    <button
                      onClick={() => setStep(0)}
                      className="text-xs font-semibold text-forest hover:underline mt-1"
                    >
                      Edit
                    </button>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-2">
                      We&apos;ll contact you on
                    </p>
                    <p className="text-sm text-forest-deep">
                      {platform} &middot; {handle}
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-forest hover:underline mt-1"
                    >
                      Edit
                    </button>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-3">
                      Order items
                    </p>
                    <div className="space-y-3">
                      {detailed.map(({ product, variant, quantity }) => (
                        <div
                          key={`${product.id}:${variant.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-cream shrink-0">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="44px"
                              className="object-contain p-1"
                            />
                          </div>
                          <p className="text-sm text-forest-deep flex-1 min-w-0 truncate">
                            {product.name} ({variantLabel(variant)}) &times;{quantity}
                          </p>
                          <p className="text-sm font-semibold text-forest-deep shrink-0">
                            {formatPrice(variant.price * quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-forest/10">
              {step > 0 && (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  <ChevronLeft size={16} /> Back
                </Button>
              )}
              <div className="flex-1" />
              {step < 2 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 0 ? !shippingValid : !contactValid}
                >
                  Continue
                </Button>
              ) : (
                <Button onClick={handleConfirm} disabled={submitting} size="lg">
                  {submitting ? "Placing order…" : "Confirm Order"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* summary rail */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-white border border-forest/10 p-6">
            <h2 className="font-display font-bold text-lg text-forest-deep mb-5">
              Order summary
            </h2>

            <div className="space-y-3 mb-5 max-h-72 overflow-y-auto -mt-1 -mr-1 pt-1 pr-1">
              {detailed.map(({ product, variant, quantity }) => (
                <Link
                  key={`${product.id}:${variant.id}`}
                  href={`/shop/${product.slug}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="relative w-12 h-12 shrink-0">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-cream">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-forest text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {quantity}
                    </span>
                  </div>
                  <p className="text-sm text-forest-deep/80 flex-1 min-w-0 truncate group-hover:text-forest">
                    {product.name} <span className="text-forest-deep/40">({variantLabel(variant)})</span>
                  </p>
                  <span className="text-sm font-semibold text-forest-deep shrink-0">
                    {formatPrice(variant.price * quantity)}
                  </span>
                </Link>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-forest/10 text-sm">
              <div className="flex justify-between text-forest-deep/65">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-forest-deep/65">
                <span>Delivery</span>
                <span>
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-forest-deep pt-2 border-t border-forest/10">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
