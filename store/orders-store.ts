import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "@/lib/types";

interface OrdersState {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "placedAt" | "status">) => string;
  getOrder: (id: string) => Order | undefined;
  clearOrders: () => void;
}

function generateOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TJ-${suffix}`;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (draft) => {
        const order: Order = {
          ...draft,
          id: generateOrderId(),
          placedAt: new Date().toISOString(),
          status: "Pending",
        };
        set({ orders: [order, ...get().orders] });
        return order.id;
      },
      getOrder: (id) => get().orders.find((o) => o.id === id),
      clearOrders: () => set({ orders: [] }),
    }),
    { name: "tropijoy-orders" }
  )
);
