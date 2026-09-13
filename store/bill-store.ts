import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BillCompanyProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  panNo: string;
}

interface BillState {
  nextInvoiceNo: string;
  company: BillCompanyProfile;
  setCompany: (company: BillCompanyProfile) => void;
  /** Advances the stored counter past `usedInvoiceNo` once a bill has been saved. */
  commitInvoiceNo: (usedInvoiceNo: string) => void;
}

const DEFAULT_COMPANY: BillCompanyProfile = {
  name: "Tropijoy",
  address: "Kathmandu, Nepal",
  phone: "+977 9768530718",
  email: "contact@tropijoynp.com",
  panNo: "160789212",
};

/**
 * Bumps the trailing numeric run in an invoice number, preserving its prefix
 * and zero-padding width — e.g. "SAL-0001" -> "SAL-0002". Falls back to
 * appending "-1" for a number with no trailing digits at all.
 */
export function incrementInvoiceNo(value: string): string {
  const match = value.match(/^(.*?)(\d+)(\D*)$/);
  if (!match) return `${value}-1`;
  const [, prefix, digits, suffix] = match;
  const next = (BigInt(digits) + BigInt(1)).toString().padStart(digits.length, "0");
  return `${prefix}${next}${suffix}`;
}

export const useBillStore = create<BillState>()(
  persist(
    (set) => ({
      nextInvoiceNo: "SAL-0001",
      company: DEFAULT_COMPANY,
      setCompany: (company) => set({ company }),
      commitInvoiceNo: (usedInvoiceNo) =>
        set({ nextInvoiceNo: incrementInvoiceNo(usedInvoiceNo) }),
    }),
    {
      name: "tropijoy-bill",
      version: 2,
      migrate: (persisted: unknown) => {
        const state = persisted as { nextInvoiceNo?: string; company?: Partial<BillCompanyProfile> };
        return {
          nextInvoiceNo: state?.nextInvoiceNo ?? "SAL-0001",
          company: { ...DEFAULT_COMPANY, ...state?.company },
        };
      },
    }
  )
);
