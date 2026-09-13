import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BillLineItem } from "@/components/bill/BillDocument";

export interface BillDraft {
  invoiceNo: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerPan: string;
  payMode: string;
  items: BillLineItem[];
  discount: number;
}

interface BillDraftState extends BillDraft {
  setDraft: (patch: Partial<BillDraft>) => void;
}

/** Fields reset by "Clear" / "Save & Next Bill" — invoiceNo and date are set separately by the caller. */
export const EMPTY_DRAFT_FIELDS: Omit<BillDraft, "invoiceNo" | "date"> = {
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  customerPan: "",
  payMode: "Cash",
  items: [],
  discount: 0,
};

/**
 * The in-progress bill being edited on /bill-print — persisted to
 * localStorage so it survives a refresh or a freshly opened tab, the way a
 * half-filled paper bill would just sit on the counter until it's finished.
 */
export const useBillDraftStore = create<BillDraftState>()(
  persist(
    (set) => ({
      invoiceNo: "",
      date: "",
      ...EMPTY_DRAFT_FIELDS,
      setDraft: (patch) => set(patch),
    }),
    {
      name: "tropijoy-bill-draft",
      // Discount is a one-off adjustment for the bill being typed right now —
      // it shouldn't carry over and silently apply to the next bill.
      partialize: (state) => {
        const { discount, ...rest } = state;
        return rest;
      },
    }
  )
);
