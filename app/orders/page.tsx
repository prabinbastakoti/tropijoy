"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { useOrdersStore } from "@/store/orders-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatDate, formatPrice } from "@/lib/utils";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import { statusStyles } from "@/components/orders/status";

export default function OrdersPage() {
  const orders = useOrdersStore((s) => s.orders);
  const hydrated = useHydrated();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Order History" }]}
      />

      <div className="mt-6 mb-10">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep">
          Order History
        </h1>
        <p className="mt-2 text-forest-deep/60 text-sm max-w-lg">
          Orders are stored privately in this browser. Clearing your browser data
          will remove them from here — it won&apos;t cancel anything we&apos;ve
          already confirmed.
        </p>
      </div>

      {!hydrated ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton h-36 rounded-3xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl bg-white border border-forest/10">
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order it'll show up here with its full details and status."
            actionLabel="Start shopping"
            actionHref="/shop"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const status = statusStyles[order.status];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Link
                  href={`/orders/${order.id}`}
                  className="group block rounded-3xl bg-white border border-forest/10 p-5 sm:p-6 hover:shadow-lift transition-shadow"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-display font-bold text-lg text-forest-deep">
                          {order.id}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status.chip}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-forest-deep/50 mt-1">
                        {formatDate(order.placedAt)} &middot; {order.items.length}{" "}
                        item{order.items.length !== 1 && "s"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-forest-deep">
                        {formatPrice(order.total)}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest mt-1 group-hover:gap-2 transition-all">
                        View details <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-5 pt-5 border-t border-forest/8">
                    {order.items.slice(0, 5).map((item) => (
                      <div
                        key={item.productId}
                        className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream shrink-0"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-contain p-1.5"
                        />
                      </div>
                    ))}
                    {order.items.length > 5 && (
                      <span className="text-xs font-semibold text-forest-deep/45">
                        +{order.items.length - 5} more
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
