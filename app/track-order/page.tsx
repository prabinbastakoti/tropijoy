"use client";

import { useState } from "react";
import Link from "next/link";
import { PackageSearch, Search } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useOrdersStore } from "@/store/orders-store";
import { useHydrated } from "@/lib/use-hydrated";
import { statusStyles } from "@/components/orders/status";
import { formatDate, formatPrice } from "@/lib/utils";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const getOrder = useOrdersStore((s) => s.getOrder);
  const hydrated = useHydrated();

  const order = searched ? getOrder(query.trim().toUpperCase()) : undefined;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearched(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Track Your Order" }]} />

      <SectionHeading
        eyebrow="Order status"
        as="h1"
        title="Track Your Order"
        description="Enter your order ID — it looks like TJ-XXXXXX and was shown on your confirmation."
        className="my-10"
      />

      <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-forest/10 p-6 sm:p-7 mb-6">
        <label htmlFor="order-id" className="text-xs font-semibold text-forest-deep/70 mb-1.5 block">
          Order ID
        </label>
        <div className="flex gap-2">
          <input
            id="order-id"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearched(false);
            }}
            placeholder="TJ-8K2P91"
            className="flex-1 min-w-0 rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30 uppercase"
          />
          <Button type="submit">
            <Search size={16} /> Track
          </Button>
        </div>
      </form>

      {!hydrated ? null : searched && !order ? (
        <div className="rounded-3xl bg-white border border-forest/10">
          <EmptyState
            icon={PackageSearch}
            title="Order not found"
            description="We couldn't find that order in this browser. Order history is stored locally on the device you ordered from."
          />
        </div>
      ) : order ? (
        <div className="rounded-3xl bg-white border border-forest/10 p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="font-display font-bold text-lg text-forest-deep">{order.id}</p>
              <p className="text-xs text-forest-deep/45 mt-0.5">
                Placed {formatDate(order.placedAt)}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[order.status].chip}`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-sm text-forest-deep/60 mb-5">
            {statusStyles[order.status].description}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-forest/10 text-sm">
            <span className="text-forest-deep/60">
              {order.items.length} item{order.items.length !== 1 && "s"}
            </span>
            <span className="font-bold text-forest-deep">{formatPrice(order.total)}</span>
          </div>
          <Link
            href={`/orders/${order.id}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
          >
            View full order details
          </Link>
        </div>
      ) : (
        <p className="text-center text-sm text-forest-deep/45">
          Don&apos;t have your order ID?{" "}
          <Link href="/orders" className="text-forest font-semibold hover:underline">
            See your full order history
          </Link>
          .
        </p>
      )}
    </div>
  );
}
