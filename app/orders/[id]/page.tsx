"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, MessageCircle, Package, Truck } from "lucide-react";
import { useOrdersStore } from "@/store/orders-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import HeritageBand from "@/components/brand/HeritageBand";
import { statusStyles, ORDER_JOURNEY } from "@/components/orders/status";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "1";

  const order = useOrdersStore((s) => s.orders.find((o) => o.id === id));
  const hydrated = useHydrated();
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (isNew && order) {
      setCelebrate(true);
      const timer = setTimeout(() => setCelebrate(false), 2600);
      return () => clearTimeout(timer);
    }
  }, [isNew, order]);

  if (!hydrated) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="skeleton h-96 rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Orders", href: "/orders" },
            { label: id },
          ]}
        />
        <div className="mt-8 rounded-3xl bg-white border border-forest/10">
          <EmptyState
            icon={Package}
            title="Order not found"
            description="We couldn't find that order in this browser. Order history is stored locally, so it won't appear on a different device."
            actionLabel="Back to orders"
            actionHref="/orders"
          />
        </div>
      </div>
    );
  }

  const status = statusStyles[order.status];
  const currentStep = ORDER_JOURNEY.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* celebratory confetti on a fresh order */}
      {celebrate && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ y: -40, x: `${Math.random() * 100}vw`, opacity: 1, rotate: 0 }}
              animate={{ y: "105vh", rotate: Math.random() * 720 - 360, opacity: 0 }}
              transition={{
                duration: 2 + Math.random() * 1.4,
                delay: Math.random() * 0.5,
                ease: "easeIn",
              }}
              className="absolute w-2.5 h-3.5 rounded-sm"
              style={{
                backgroundColor: ["#1A7D3E", "#116530", "#09381A", "#B5179E", "#2F9E52"][
                  i % 5
                ],
              }}
            />
          ))}
        </div>
      )}

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: order.id },
        ]}
      />

      {isNew && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
          className="mt-6 rounded-3xl bg-gradient-to-br from-forest via-forest-light to-forest-deep p-7 sm:p-9 text-center text-white noise relative overflow-hidden"
        >
          <HeritageBand
            tone="dark"
            imageClassName="object-top"
            heightClassName="h-40 sm:h-56"
          />
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-5"
            >
              <Check size={30} className="text-forest" />
            </motion.div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
              Thank you, {order.shipping.fullName.split(" ")[0]}!
            </h1>
            <p className="mt-3 text-white/75 max-w-md mx-auto text-sm leading-relaxed">
              Order <strong className="text-white">{order.id}</strong> is in. We&apos;ll
              message you on <strong>{order.contactPlatform}</strong> at{" "}
              <strong>{order.contactHandle}</strong> to confirm payment and delivery.
            </p>
            {order.demoMode && (
              <p className="mt-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs text-white/70">
                Demo mode — no email was actually sent
              </p>
            )}
          </div>
        </motion.div>
      )}

      {!isNew && (
        <h1 className="font-display font-extrabold text-3xl text-forest-deep mt-6">
          Order {order.id}
        </h1>
      )}

      {/* status journey */}
      <div className="mt-8 rounded-3xl bg-white border border-forest/10 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-forest/50">
              Status
            </p>
            <p className="font-semibold text-forest-deep mt-1">{order.status}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${status.chip}`}
          >
            {order.status}
          </span>
        </div>

        <p className="text-sm text-forest-deep/60 mb-6">{status.description}</p>

        <div className="flex items-center">
          {ORDER_JOURNEY.map((stage, i) => (
            <div key={stage} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <span
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                    i <= currentStep
                      ? "bg-forest text-white"
                      : "bg-forest/10 text-forest/35"
                  )}
                >
                  {i < currentStep ? (
                    <Check size={15} />
                  ) : i === 2 ? (
                    <Truck size={15} />
                  ) : (
                    <Package size={15} />
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs font-medium whitespace-nowrap",
                    i <= currentStep ? "text-forest-deep" : "text-forest-deep/35"
                  )}
                >
                  {stage}
                </span>
              </div>
              {i < ORDER_JOURNEY.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-1 sm:mx-2 -mt-6 rounded",
                    i < currentStep ? "bg-forest" : "bg-forest/10"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* details */}
      <div className="mt-6 grid sm:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white border border-forest/10 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-3">
            Delivering to
          </p>
          <p className="text-sm text-forest-deep leading-relaxed">
            {order.shipping.fullName}
            <br />
            {order.shipping.address}
            <br />
            {order.shipping.city} {order.shipping.postalCode}
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-forest/10 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-3">
            Contact channel
          </p>
          <p className="flex items-center gap-2 text-sm text-forest-deep">
            <MessageCircle size={15} className="text-forest shrink-0" />
            {order.contactPlatform}
          </p>
          <p className="text-sm text-forest-deep/60 mt-1">{order.contactHandle}</p>
          <p className="text-xs text-forest-deep/40 mt-3">
            Placed {formatDate(order.placedAt)}
          </p>
        </div>
      </div>

      {/* items */}
      <div className="mt-6 rounded-3xl bg-white border border-forest/10 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-4">
          Items
        </p>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-cream shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-forest-deep truncate">
                  {item.name}
                </p>
                <p className="text-xs text-forest-deep/50">
                  {item.weight} &middot; Qty {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold text-forest-deep shrink-0">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-forest/10 space-y-2 text-sm">
          <div className="flex justify-between text-forest-deep/65">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-forest-deep/65">
            <span>Delivery</span>
            <span>
              {order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base text-forest-deep pt-2 border-t border-forest/10">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <ButtonLink href="/shop">Continue shopping</ButtonLink>
        <Link
          href="/orders"
          className="inline-flex items-center px-6 py-3 text-sm font-semibold text-forest hover:underline"
        >
          All orders
        </Link>
      </div>
    </div>
  );
}
