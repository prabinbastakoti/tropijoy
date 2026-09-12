import type { OrderStatus } from "@/lib/types";

export const statusStyles: Record<
  OrderStatus,
  { chip: string; dot: string; description: string }
> = {
  Pending: {
    chip: "bg-sunny/25 text-forest-deep",
    dot: "bg-sunny",
    description: "We've received your order and will confirm it shortly.",
  },
  Confirmed: {
    chip: "bg-forest/12 text-forest",
    dot: "bg-forest",
    description: "Confirmed and being packed in our Kathmandu kitchen.",
  },
  Shipped: {
    chip: "bg-citrus/20 text-citrus",
    dot: "bg-citrus",
    description: "On its way to you with our courier partner.",
  },
  Delivered: {
    chip: "bg-forest text-white",
    dot: "bg-forest",
    description: "Delivered. We hope you enjoy it.",
  },
};

export const ORDER_JOURNEY: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
];
