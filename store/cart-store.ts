import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductVariant } from "@/lib/types";
import { getProductById, getVariant, stockRemaining } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_RATE } from "@/lib/utils";

/** Units left for a cart line's variant, or Infinity if untracked/product missing. */
function remainingFor(productId: string, variantId: string): number {
  const product = getProductById(productId);
  if (!product) return Infinity;
  return stockRemaining(getVariant(product, variantId));
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  incrementItem: (productId: string, variantId: string) => void;
  decrementItem: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const sameLine = (i: CartItem, productId: string, variantId: string) =>
  i.productId === productId && i.variantId === variantId;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (productId, variantId, quantity = 1) => {
        const items = get().items;
        const max = remainingFor(productId, variantId);
        const existing = items.find((i) => sameLine(i, productId, variantId));
        if (existing) {
          set({
            items: items.map((i) =>
              sameLine(i, productId, variantId)
                ? { ...i, quantity: Math.min(i.quantity + quantity, max) }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              { productId, variantId, quantity: Math.min(quantity, max) },
            ],
          });
        }
        set({ isOpen: true });
      },
      removeItem: (productId, variantId) =>
        set({
          items: get().items.filter((i) => !sameLine(i, productId, variantId)),
        }),
      incrementItem: (productId, variantId) => {
        const max = remainingFor(productId, variantId);
        set({
          items: get().items.map((i) =>
            sameLine(i, productId, variantId)
              ? { ...i, quantity: Math.min(i.quantity + 1, max) }
              : i
          ),
        });
      },
      decrementItem: (productId, variantId) => {
        const items = get().items;
        const target = items.find((i) => sameLine(i, productId, variantId));
        if (target && target.quantity <= 1) {
          set({
            items: items.filter((i) => !sameLine(i, productId, variantId)),
          });
        } else {
          set({
            items: items.map((i) =>
              sameLine(i, productId, variantId)
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ),
          });
        }
      },
      setQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter((i) => !sameLine(i, productId, variantId)),
          });
          return;
        }
        const max = remainingFor(productId, variantId);
        set({
          items: get().items.map((i) =>
            sameLine(i, productId, variantId)
              ? { ...i, quantity: Math.min(quantity, max) }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: "tropijoy-cart",
      version: 2,
      migrate: () => ({ items: [] }),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export interface DetailedCartLine {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export function useCartTotals() {
  const items = useCartStore((s) => s.items);

  const detailed: DetailedCartLine[] = items.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];
    const variant = getVariant(product, item.variantId);
    return [{ product, variant, quantity: item.quantity }];
  });

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = detailed.reduce(
    (sum, { variant, quantity }) => sum + variant.price * quantity,
    0
  );
  const shippingCost =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
  const total = subtotal + shippingCost;

  return { detailed, itemCount, subtotal, shippingCost, total };
}
