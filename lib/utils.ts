import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Canonical production URL — used for metadataBase, sitemap.xml and robots.txt. */
export const SITE_URL = "https://tropijoynp.com";

/** Nepali Rupee, e.g. 1150 -> "Rs. 1,150" */
export function formatPrice(value: number): string {
  return `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
}

export function calculateDiscount(price: number, originalPrice: number | null): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Free delivery threshold and flat rate, in NPR. */
export const FREE_SHIPPING_THRESHOLD = 3000;
export const FLAT_SHIPPING_RATE = 150;
